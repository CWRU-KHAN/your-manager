<template>
  <div class="container-fluid">
      <h1 class="pge-title">Change User Password</h1>
      <div class="err-handler">
          <p class="err-handler-text" v-if="errors.length">
              <b>Please correct the following error(s):</b>
              <ul>
                  <li v-for="error in errors" :key="error">{{ error }}</li>
                  <li v-for="error in serverErrors" :key="error">{{ error }}</li>
              </ul>
          </p>
      </div>
      <form>
        <div class="frm-group">
            <label class="frm-input-label" for="currentPassword"> Current Password
              <input
                class="frm-input"
                :type="show1 ? 'text' : 'password'"
                id="currentPassword"
                v-model="currentPassword"          
                autocomplete="current-password"
              />
            </label>
        </div>

        <div class="frm-group">
            <label class="frm-input-label" for="newPassword"> New Password
              <input
                class="frm-input"
                :type="show1 ? 'text' : 'password'" 
                id="newPassword"
                v-model="newPassword"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
            </label>
        </div>
        
        <div class="frm-group">
            <label class="frm-input-label" for="confirmPassword"> Confirm Password
              <input
                class="frm-input"
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

       <div>
          <button 
            class="but but-block but-blue"
            type="button" 
            @click="submit">
            Change Password
          </button>
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

<style scoped>

</style>