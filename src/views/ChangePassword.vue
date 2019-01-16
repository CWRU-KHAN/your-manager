<template>
  <div>
    <img src="../assets/ym-logo-bad.png" alt="Your Manager Logo">
    <h3>Change Password</h3>
      <label for="currentPassword"> Current Password
        <input 
          :type="show1 ? 'text' : 'password'"
          id="currentPassword"
          v-model="currentPassword"          
          autocomplete="current-password"
        />
      </label>

      <label for="newPassword"> New Password
        <input 
          :type="show1 ? 'text' : 'password'" 
          id="newPassword"
          v-model="newPassword"
          placeholder="At least 8 characters"
          autocomplete="new-password"
        />
      </label>

      <label for="confirmPassword"> Confirm Password
        <input 
          :type="show1 ? 'text' : 'password'" 
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="At least 8 characters"
          autocomplete="new-password"
        />
      </label>
  </div>
</template>


<script>

import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      show1: false,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  },
  methods: {
    submit() {
      this.errors = []
      if (this.currentPassword !== this.confirmPassword) this.errors.push('Password and Confirm Password must match.')


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
