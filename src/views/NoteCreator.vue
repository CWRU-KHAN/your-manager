<template>
  <div>
    <h1>Write a Note</h1>
    <form >

      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </p>
      Subject: <input type="text" placeholder="practice monday" v-model="noteTitle">
      <br>
      Message: <input type="text" placeholder="can't make practice tomrrow, what about monday?" v-model="noteBody">
      <br>
      Regarding event on: <input type="datetime-local" v-model="calendarDate">
      <br>
      Band: <select name="bands" v-model="bandName">
                <option v-for="band in bandsList" :key="band.id">{{ band.name }}</option>
            </select>
    
      <br><br>

      <button type='button' @click='submit'>Write Note</button>

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
        bandName: '',
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
      return this.$store.state.currentPageJson.data[2]
    }
  },
  methods: {
    submit() {
      this.errors = []

        if (!this.noteTitle.length) this.errors.push('Note must have a title.')
        if (!this.noteBody.length) this.errors.push('Note must have a message')
        if (!this.bandName.length) this.errors.push('Please select one of your bands')


      if (!this.errors.length) {
        const noteInfo = {
            notetitle: this.noteTitle,
            notebody: this.noteBody,
            calendardate: this.calendarDate,
            bandname: this.bandName,
            postedat: new Date,
            errors: [],
            usersid: this.$store.state.userCredentials.usersid,
            token: this.$store.state.userCredentials.userToken,
            userName: this.$store.state.userCredentials.username
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createNote', noteInfo)
      }
    },
    processUpload () {
      this.file = this.$refs.file.files[0]
      // this.fileChosen = true
    }
    // submitImage() {
    //   let formData = new FormData()
    //   formData.append('file', this.file)
    // //   this.$store.dispatch('uploadImg', formData)
    //     // .then(() => this.bandimage = this.$store.getters.getCurrentUploadedImage)
    // }
  }
}
</script>
