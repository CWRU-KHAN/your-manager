<template>
  <div class="container py-4 my-3 mx-auto">
        <form>
    <div class="row justify-content-start">
      <div class="col">
        <img class="ym-luggage" src="@/assets/svg/ym-icon-luggage.svg">
      </div>
      <div class="col-12 col-md-8 col-lg-6 col-xl-5 text-left">
        <div class="form-box">
          <div class="row">
            <div class="col">
              <h1>Create A Note</h1>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <label for="subject"> Subject
                  <input
                      id="subject"
                      class="form-control"
                      type="text"
                      placeholder=""
                      v-model="noteTitle">
                </label>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <label for="message"> Message
                  <input
                      id="message"
                      class="form-control"
                      type="text"
                      placeholder=""
                      v-model="noteBody">
                </label>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <label for="note-date"> Regarding Date:
                  <input
                      id="note-date"
                      class="form-control"
                      type="text"
                      placeholder=""
                      v-model="calendarDate">
                </label>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <label for="band-note-link"> Band:
                  <select
                      id="band-note-link"
                      name="bands"
                      class="form-control"
                      v-model="bandsid">
                  <option v-for="band in bandsList" :key="band.id">{{ band.bandname }}</option>
                  </select>
                </label>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <button class="btn btn-note-create-2"
                        @click='submit' 
                        type="button">
                    Write Note
                </button>
      <router-link class="btn btn-register" to="/dashboard">
          <i class="fa fa-home btn-icon" aria-hidden="true"></i>
          Back to Dashboard
        </router-link>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
                <p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                </ul>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </form>
  </div>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  name: 'noteCreator',
  data() {
    return {
        noteTitle: '',
        noteBody: '',
        calendarDate: '',
        bandsid: '',
        errors: [],
        // file: '',
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    }),
    //need to check CPJ.data for accurate path
    bandsList() {
      return this.$store.state.currentPageJson.data[0].bands
    }
  },
  methods: {
    submit() {
      this.errors = []

        if (!this.noteTitle.length) this.errors.push('Note must have a title.')
        if (!this.noteBody.length) this.errors.push('Note must have a message')
        if (!this.bandsid) this.errors.push('Please select one of your bands')


      if (!this.errors.length) {
        const noteInfo = {
            noteTitle: this.noteTitle,
            noteBody: this.noteBody,
            calendarDate: this.calendarDate,
            bandsid: this.bandsid,
            postedat: new Date,
            errors: [],
            usersid: this.$store.state.userCredentials.usersid,
            token: this.$store.state.userCredentials.userToken,
            userName: this.$store.state.userCredentials.username
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createNote', noteInfo)
        this.$router.push({"path" : "/dashboard"})

      }
    },
  }
}
</script>

<style>

  .btn-note-create-2 {
    background-color: #979797;
    border: solid 1px #979797;
    color: #ededed;
  }

  .btn-note-create-2:hover {
    background-color: transparent;
    border: solid 2px #979797;
    color: #ededed
  }

</style>
