<template>
  <div>
  <div class="container mx-auto">
    <div class="form-box-register">
      <div class="row">
        <div class="col">
          <h1>User Profile</h1>
        </div>
      </div>
    <form>

    <div class="row">
      <div class="col mt-4">
        <label for="email"> Email
          <input
            class="form-control"
            type="text" 
            id="email"
            v-model="email"
          />
        </label>
      </div>
    </div>

    <router-link class="btn btn-register" to="/user/changePassword">Change Password</router-link>


    <div class="row">
      <div class="col mt-4">
        <label for="username"> Username
        <input 
          class="form-control"
          type="text"
          id="username"
          v-model="username"
        />
      </label>
      </div>
    </div>

    <div class="row">
      <div class="col mt-4">
        <label for="firstname"> First Name
          <input
            class="form-control"
            type="text"
            id="firstname"
            v-model="firstname">
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col mt-4">
        <label for="lastname"> Last Name
          <input
            class="form-control"
            type="text"
            id="lastname"
            v-model="lastname">
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col mt-4">
        <label for="userimage"> Profile Image
          <h3 class="form-header" v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</h3>
          <img :src="displayImage" alt="User Profile">
          <input v-if="!upload1" type="file" name="file" id="userImg" ref="file" accept="image/*" v-on:change="processUpload()">
          <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
        </label>
      </div>
    </div>

    <div class="row">
      <div class="col mt-4">
        <button type="button" @click="submit">Save Changes</button>
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

    </form>
    </div>
  </div>
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

  .form-header {
    font-family: 'Open Sans', 'sans-serif'
  }

  .btn-register {
    background-color: #fbaf2c;
    border: solid 2px transparent;
    color: #373737;
  }

  .btn-register:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }
</style>
