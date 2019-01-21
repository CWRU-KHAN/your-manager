<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-lg-6 col-md-12 section">
                <div class="container mx-auto">
                    <div class="form-box-register">
                        <div class="row">
                            <div class="col">
                                <h1>Join a band</h1>
                                <h4 class="align">Please paste the unique band-code below</h4>
                                <hr>
                            </div>
                        </div>
                        <form>
                            <div class="row">
                                <div class="col mt-4">
                                    <input class="form-control" type="text" placeholder="band-code" v-model="token">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col mt-4">
                                    <button class="btn btn-register-2" @click="submit()"> Join</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="col-md-12 col-lg-6 section">
                <div class="container mx-auto">
                    <div class="form-box-register">
                        <div class="row">
                            <h1>Create a Band</h1>
                        </div>
                        <form>
                            <div class="row align">
                                <h3 class="sectionHead"><label for="bandImg"> Band Image <br>
                                    <hr>
                                    <img class="profPic" v-if="displayImage" :src="displayImage" alt="Band">
                                    <input v-if="!upload1" type="file" name="file" id="bandImg" ref="file" accept="image/*"
                                        v-on:change="processUpload()">
                                </label></h3>
                                <br>
                                <button v-if="upload1 && !upload2" class="btn btn-login" type="button" @click='submitImage()'>
                                    Submit Image
                                </button>
                            </div><br>
                            <div class="row align">
                                <h3 class="sectionHead"><label for="bandName"> Band Name:
                                    <hr>
                                    <input class="form-control" type="text" placeholder="" id='bandName' v-model="bandName">
                                </label></h3>
                            </div>
                            <div class="row align">
                                <div class="col mt-4">
                                    <h3 class="force-label sectionHead">Genre:</h3>
                                    <hr>
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <input class="form-check-input" id="blues" type="checkbox" v-model='genres'
                                                value="1">
                                            <label class="form-check-label" for="blues"> Blues </label><br>

                                            <input class="form-check-input" id="classical" type="checkbox" v-model='genres'
                                                value="2">
                                            <label class="form-check-label" for="classical"> Classical </label><br>

                                            <input class="form-check-input" id="jazz" type="checkbox" v-model='genres'
                                                value="3">
                                            <label class="form-check-label" for="jazz"> Jazz </label><br>

                                            <input class="form-check-input" id="reggae" type="checkbox" v-model='genres'
                                                value="4">
                                            <label class="form-check-label" for="reggae"> Reggae </label><br>

                                            <input class="form-check-input" id="country" type="checkbox" v-model='genres'
                                                value="5">
                                            <label class="form-check-label" for="country"> Country </label><br>
                                        </div>
                                        <div class="col-lg-6">
                                            <input class="form-check-input" id="electronic" type="checkbox" v-model='genres'
                                                value="6">
                                            <label class="form-check-label" for="electronic"> Electronic </label><br>

                                            <input class="form-check-input" id="folk" type="checkbox" v-model='genres'
                                                value="7">
                                            <label class="form-check-label" for="folk"> Folk </label><br>

                                            <input class="form-check-input" id="rock" type="checkbox" v-model='genres'
                                                value="8">
                                            <label class="form-check-label" for="rock"> Rock </label><br>

                                            <input class="form-check-input" id="hip-hop" type="checkbox" v-model='genres'
                                                value="9">
                                            <label class="form-check-label" for="hip-hop"> Hip-Hop </label><br>
                                            <input class="form-check-input" id="other" type="checkbox" v-model='genres'
                                                value="9">
                                            <label class="form-check-label" for="other"> Other </label><br>
                                        </div>
                                    </div>



                                </div>
                            </div>
                            <div class="row">
                                <div class="col mt-4">
                                    <button class="btn btn-register-2" type='button' @click='submitNewBand'>
                                        Create Band
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: "joinBand",
  data() {
    return {
      token: '',
      genres: [],
      bandName: '',
      errors: [],
      file: '',
      upload1: false,
      upload2: false,
      bandimage: ''
    }
  },
  computed: {
      displayImage() {
          return this.bandimage ? this.bandimage : false
      }
  },
  methods: {
    submit() {
      const payload = {
        token: this.token,
        usersid: this.$store.state.userCredentials.usersid
      }
      this.$store.commit('clearErrors')
      this.$store.dispatch('addUserToBand', payload)
    },
    submitNewBand() {
      this.errors = []

      if (this.bandName.length < 2) this.errors.push('Bandname must be at least 2 characters.')
      if (!this.errors.length) {
        const bandInfo = {
          bandName: this.bandName,
          genres: this.genres,
          bandimage: this.$store.state.currentUploadedImage,
          usersid: this.$store.state.userCredentials.usersid,
          token: this.$store.state.userCredentials.userToken,
          userName: this.$store.state.userCredentials.username
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('createBand', bandInfo)
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
            this.bandimage = this.$store.getters.getCurrentUploadedImage
            this.upload2 = true
        })
    }
  }
}
</script>

<style scoped>
  .profPic {
    width: 100%;
    border: 2px solid #979797;
    border-radius: 5px;
  }

    .btn {
    font-family: 'Open Sans';
    font-size: .75em;
    text-transform: uppercase;
    letter-spacing: .1em;
    padding: .5em 2em .5em 2em;
    margin: 0em .5em 0em .5em
  }

  .btn-register-2 {
    background-color: #677794;
    border: solid 2px transparent;
    color: #ededed;
    transition-property: background-color, color;
    transition: 400ms;
  }

  .btn-register-2:hover {
    background-color: transparent;
    border: solid 2px #677794;
    color: #677794;
  }

    .align {
      text-align: left;
  }

  .sectionHead {
    font-family: 'Open Sans', 'sans-serif';
    font-size: 1em;
    letter-spacing: .1em;
    text-transform: uppercase; 
  }

    .section {
        padding: 2em;
    }


</style>

