<template>
    <div class="container-fluid">
        <div class="row">
        <div class="col-lg-6 col-md-12">
            <h1 class="pge-title">Join a Band</h1>
            <h4 class="pge-subtitle">Please paste the unique band-code below</h4>
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
                    <input
                        class="frm-input"
                        type="text"
                        placeholder="band-code"
                        v-model="token">
                </div>
                <div>
                    <button
                        class="but but-block but-blue"
                        @click="submit()">Join
                    </button>
                </div>
            </form>
        </div>
        <div class="col-lg-6 col-md-12">
            <h1 class="pge-title">Create a Band</h1>
            <form>
                <div class="frm-group">
                    <label class="frm-input-label" for="bandImg">Band Image
                        <img
                            class="profPic"
                            v-if="displayImage"
                            :src="displayImage"
                            alt="Band">
                        <input
                            v-if="!upload1"
                            type="file"
                            name="file"
                            class="frm-input"
                            id="bandImg"
                            ref="file"
                            accept="image/*"
                            v-on:change="processUpload()">
                        <button
                            v-if="upload1 && !upload2"
                            type="button"
                            @click='submitImage()'>Submit Image
                        </button>
                    </label>
                </div>
                <div class="frm-group">
                    <label class="frm-input-label" for="bandName">Band Name
                        <input
                            class="frm-input"
                            type="text"
                            placeholder=""
                            id='bandName'
                            v-model="bandName">
                    </label>
                </div>
                <div class="frm-group">
                    <label class="frm-input-label">Genre
                        <div class="row fix-row-genres">
                            <div class="col-lg-6">
                                <input
                                    class="form-check-input"
                                    id="blues"
                                    type="checkbox"
                                    v-model='genres'
                                    value="1">
                                <label class="form-check-label" for="blues"> Blues </label><br>

                                <input
                                    class="form-check-input"
                                    id="classical"
                                    type="checkbox"
                                    v-model='genres'
                                    value="2">
                                <label class="form-check-label" for="classical"> Classical </label><br>

                                <input
                                    class="form-check-input"
                                    id="jazz"
                                    type="checkbox"
                                    v-model='genres'
                                    value="3">
                                <label class="form-check-label" for="jazz"> Jazz </label><br>

                                <input
                                    class="form-check-input"
                                    id="reggae"
                                    type="checkbox"
                                    v-model='genres'
                                    value="4">
                                <label class="form-check-label" for="reggae"> Reggae </label><br>

                                <input
                                    class="form-check-input"
                                    id="country"
                                    type="checkbox"
                                    v-model='genres'
                                    value="5">
                                <label class="form-check-label" for="country"> Country </label><br>
                            </div>
                            <div class="col-lg-6">
                                <input
                                    class="form-check-input"
                                    id="electronic"
                                    type="checkbox"
                                    v-model='genres'
                                    value="6">
                                <label class="form-check-label" for="electronic"> Electronic </label><br>

                                <input
                                    class="form-check-input"
                                    id="folk"
                                    type="checkbox"
                                    v-model='genres'
                                    value="7">
                                <label class="form-check-label" for="folk"> Folk </label><br>

                                <input
                                    class="form-check-input"
                                    id="rock"
                                    type="checkbox"
                                    v-model='genres'
                                    value="8">
                                <label class="form-check-label" for="rock"> Rock </label><br>

                                <input
                                    class="form-check-input"
                                    id="hip-hop"
                                    type="checkbox"
                                    v-model='genres'
                                    value="9">
                                <label class="form-check-label" for="hip-hop"> Hip-Hop </label><br>

                                <input
                                    class="form-check-input"
                                    id="other"
                                    type="checkbox"
                                    v-model='genres'
                                    value="10">
                                <label class="form-check-label" for="other"> Other </label><br>
                            </div>
                        </div>
                    </label>
                </div>
                <div>
                    <button
                        class="but but-block but-yellow"
                        type='button' 
                        @click='submitNewBand'>Create Band
                    </button>
                </div>
            </form>
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

  .fix-row-genres {
      margin: .5em 2em
  }

</style>