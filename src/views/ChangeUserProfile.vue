<template>
  <div class="container-fluid">
    <h1 class="pge-title">Edit User Profile</h1>
      <form>
        <div class="row">
        <div class="col-lg-6 col-md-12">
          <div class="frm-group">
            <label class="frm-input-label" for="email"> Email
              <input class="frm-input" type="text" id="email" v-model="email">
            </label>
          </div>
              <div class="frm-group">
                <label class="frm-input-label" for="username"> Username
                  <input class="frm-input" type="text" id="username" v-model="username">
                </label>
              </div>
              <div class="frm-group">
                <label class="frm-input-label" for="firstname"> First Name
                  <input class="frm-input" type="text" id="firstname" v-model="firstname">
                </label>
              </div>
              <div class="frm-group">
                <label class="frm-input-label" for="lastname"> Last Name
                  <input class="frm-input" type="text" id="lastname" v-model="lastname">
                </label>
              </div>
              <div>
                <router-link tag="button" class="but but-block but-blue" to="/user/changePassword">Change Password</router-link>
              </div>
            </div>
            <div class="col-lg-6 col-md-12">
              <div class="frm-group">
                                  <input
                    class="frm-input bandImgClass"
                    v-if="!upload1"
                    type="file"
                    name="file"
                    id="userImg"
                    ref="file"
                    accept="image/*"
                    v-on:change="processUpload()">
                <label class="frm-input-label" for="userImg">Upload New Profile Image</label>
                  <hp class="err-handler-text" v-if="upload2">You Must Hit 'Save Changes' Below To Save Your Changes</hp>
                <img class="img-user-edit" :src="displayImage" alt="User Profile">

                        <button v-if="upload1" type="button" @click='submitImage()'>Submit Image</button>
              <div>
                  <button class="but but-block but-yellow" type="button" @click="submit">Save Changes</button>
              </div>
              </div>
          </div>
        </div>
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
  /* label {
    display: block;
    text-align: left;
    margin-top: 3%;
  } */

  .img-user-edit {
    width: 100%;
    height: auto;
    border: 2px solid #979797;
    border-radius: 5px;
  }

    .bandImgClass {
  width: 0.1px;
	height: 0.1px;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	z-index: -1;
}

.bandImgClass + label {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    border-radius: .4em;
    display: inline-block;
    padding: .5em;
}



.bandImgClass:focus + label,
.bandImgClass + label:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #373737}

.bandImgClass + label {
	cursor: pointer;
}

.but {
  margin-top: 3em;
}

</style>
