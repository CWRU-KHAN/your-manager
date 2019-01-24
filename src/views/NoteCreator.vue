<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-12">
    <h1 class="pge-title">Create a Note</h1>
    <div class="err-handler">
      <p class="err-handler-text" v-if="errors.length || serverErrors.length">
          <b>Please correct the following error(s):</b>
          <ul>
              <li v-for="error in errors" :key="error">{{ error }}</li>
              <li v-for="error in serverErrors" :key="error">{{ error }}</li>
          </ul>
      </p>
    </div>
    <form>
      <div class="frm-group">
        <label class="frm-input-label" for="subject"> Subject
          <input
              id="subject"
              class="frm-input"
              type="text"
              placeholder=""
              v-model="noteTitle" />
        </label>
      </div>
      <div class="frm-group">
        <label class="frm-input-label" for="message"> Message
          <textarea
              id="message"
              class="frm-input frm-input-textarea"
              placeholder=""
              v-model="noteBody" />
        </label>
      </div>
      <div class="frm-group">
        <label class="frm-input-label" for="note-date"> Regarding Date:
          <input
              id="note-date"
              class="frm-input"
              type="date"
              placeholder=""
              v-model="calendarDate">
        </label>
      </div>
      <div class="frm-group">
        <label class="frm-input-label" for="band-note-link"> Band:
          <select
              id="band-note-link"
              name="bands"
              class="frm-input"
              v-model="bandsid">
                  <option
                    v-for="band in bandsList"
                    :key="band.id"
                    :value="band.id">{{ band.bandname }}
                  </option>
          </select>
        </label>
      </div>
    <div>
      <button
        class="but but-block but-blue"
        @click='submit'
        type="button">Create Note
      </button>
    </div>
    </form>
      </div>
    </div>
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
    }
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    }),

    bandsList() {
      const data = this.$store.state.currentUser
      return data.bandname ? 
        [{
          bandname: data.bandname,
          id: this.$store.state.bandCredentials.bandsid
        }] :
        data[0].bands
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
  //a phantom change
}
</script>

<style scoped>

</style>
