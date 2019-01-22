<template>
  <div class="container-fluid">
    <div class="form-box-register">
      <div class="row">
        <h1>Edit User Profile</h1>
      </div>
      <form>
        <div class="form-group">
          <div class="row">
            <div class="col-lg-6 col-md-12">
              <div class="row">
                <label for="email"> Email
                  <input class="form-control" type="text" id="email" v-model="email">
                </label>
              </div>
              <div class="row">
                <label for="username"> Username
                  <input class="form-control" type="text" id="username" v-model="username">
                </label>
              </div>
              <div class="row">
                <label for="firstname"> First Name
                  <input class="form-control" type="text" id="firstname" v-model="firstname">
                </label>
              </div>
              <div class="row">
                <label for="lastname"> Last Name
                  <input class="form-control" type="text" id="lastname" v-model="lastname">
                </label>
              </div>
              <br>
              <div class="row">
                <router-link class="btn btn-register" to="/user/changePassword">Change Password</router-link>
              </div>
            </div>
            <div class="col-lg-6 col-md-12">
              <div class="row">
                <label for="userimage"> Profile Image </label>
              </div>
              <div class="row">
                  <img class="profPic" :src="displayImage" alt="User Profile">
                  <input v-if="!upload1" type="file" name="file" id="userImg" ref="file" accept="image/*" v-on:change="processUpload()"  class="btn-register">
                  <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col mt-4">
              <button type="button" class="btn-register-save" @click="submit">Save Changes</button>
            </div>
            <h3 class="form-header" v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</h3>
          </div>
        </div>
      </form>
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
  /* label {
    display: block;
    text-align: left;
    margin-top: 3%;
  } */

  .form-header {
    font-family: 'Open Sans', 'sans-serif'
  }

  .form-box-register {
    margin-top: 3%;
  }

  .btn-register {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
  }

  .btn-register:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794
  }

  .btn-register-save {
    background-color: #fbaf2c;
    border: solid 2px transparent;
    color: #ededed;
    letter-spacing: .1em;
    text-transform: uppercase; 
    font-size: .75em; 
  }

    .btn-register-save:hover {
    background-color: transparent;
    border: solid 2px #fbaf2c;
    color: #fbaf2c
  }

  .profPic {
    height: 20em;
    width: auto;
    border: 2px solid #979797;
    border-radius: 5px;
  }

</style>
