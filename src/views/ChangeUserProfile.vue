<template>
  <div>
    <h3>Profile Information</h3>

    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>

    <form>
      <label for="email"> Email
        <input type="text" id="email" v-model="email">
      </label>

      <label for="username"> Username
        <input type="text" id="username" v-model="username">
      </label>

      <label for="firstname"> First Name
        <input type="text" id="firstname" v-model="firstname">
      </label>

      <label for="lastname"> Last Name
        <input type="text" id="lastname" v-model="lastname">
      </label>

      <label for="userimage"> Profile Image
        <h3 v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</h3>
        <img :src="displayImage" alt="User Profile">
        <input v-if="!upload1" type="file" name="file" id="userImg" ref="file" accept="image/*" v-on:change="processUpload()">
        <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
      </label>

      <button type="button" @click="submit">Save Changes</button>
    </form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      email: this.$store.state.currentUser[0].email,
      username: this.$store.state.currentUser[0].username,
      userimage: this.$store.state.currentUser[0].userimage,
      firstname: this.$store.state.currentUser[0].firstname,
      lastname: this.$store.state.currentUser[0].lastname,
      errors: [],
      file: '',
      upload1: false,
      upload2: false
    }
  },
  computed: {
    displayImage() {
      return this.userimage ? this.userimage : require('../assets/no-profile-pic.png')
    }
  },
  methods: {
    validEmail(email) {
      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    },
    submit() {
      this.errors = []

      if (this.username.length < 4) this.errors.push('Username 4 characters or longer required.')
      if (!this.validEmail(this.email)) this.errors.push('Must use a valid email.')

      if (!this.errors.length) {
        const payload = {
          userName: this.$store.state.userCredentials.username,
          usersid: this.$store.state.userCredentials.usersid,
          token: this.$store.state.userCredentials.userToken,
          updates: {
            email: this.email,
            userName: this.username,
            userimage: this.userimage,
            firstname: this.firstname,
            lastname: this.lastname          
          }
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('updateUserInfo', payload)
      }
    },
    processUpload () {
      this.file = this.$refs.file.files[0]
      this.upload1 = true
    },
    submitImage() {
      let formData = new FormData()
      formData.append('file', this.file)
      this.$store.dispatch('uploadImg', formData)
        .then(() => {
          this.userimage = this.$store.getters.getCurrentUploadedImage
          this.upload1 = false
          this.upload2 = true
      })
    }
  }
}
</script>


<style scoped>
  label {
    display: block;
  }
</style>
