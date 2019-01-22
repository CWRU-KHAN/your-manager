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
    <h1>Change Password</h1>
    </div>
          </div>
    <div class="row">
            <div class="col">
    <p v-if="errors.length">
      <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors" :key="error">{{ error }}</li>
      </ul>
    </p>
</div>
          </div>

        <div class="row">
          <div class="col mt-4">
            <label for="currentPassword"> Current Password
              <input
                class="form-control"
                :type="show1 ? 'text' : 'password'"
                id="currentPassword"
                v-model="currentPassword"          
                autocomplete="current-password"
              />
            </label>
          </div>
        </div>

        <div class="row">
          <div class="col mt-4">
            <label for="newPassword"> New Password
              <input
                class="form-control"
                :type="show1 ? 'text' : 'password'" 
                id="newPassword"
                v-model="newPassword"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
            </label>
          </div>
        </div>
        
        <div class="row">
          <div class="col mt-4">
            <label for="confirmPassword"> Confirm Password
              <input
                class="form-control"
                :type="show1 ? 'text' : 'password'" 
                id="confirmPassword"
                v-model="confirmPassword"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
            </label>
              <button 
                class="btn btn-show-password-2"
                @click="show1 = !show1"
                type="button"> 
                  {{ !show1 ? "Show Password" : "Hide Password" }} 
              </button>
          </div>
        </div>

       <div class="row">
          <div class="col mt-4">
            <button 
              class="btn btn-register-2"
              type="button" 
              @click="submit">
              Change Password
            </button>
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
  data() {
    return {
      errors: [],
      show1: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    submit() {
      this.errors = []
      if (this.newPassword !== this.confirmPassword) this.errors.push('Password and Confirm Password must match.')


      if (!this.errors.length) {
        const credentials = {
          currentPassword: this.currentPassword,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword,
          userName: this.$store.state.userCredentials.username,
          token: this.$store.state.userCredentials.userToken,
          usersid: this.$store.state.userCredentials.usersid
        }
        this.$store.commit('clearErrors')
        this.$store.dispatch('updateUserPassword', credentials)
      }
    },
  },
  computed: {
    ...mapGetters({
      serverErrors: 'getCurrentErrors'
    })
  }
}
</script>
