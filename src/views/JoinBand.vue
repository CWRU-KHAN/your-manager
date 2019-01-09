<template>
  <div>

    <h1>Join A Band</h1>
    <h4>Please paste the unique band-code below</h4>
    <input type="text" placeholder="band-code" v-model="token">
    <button @click="submit()">Join</button>

  </div>
</template>

<script>
export default {
  name: "joinBand",
  data() {
    return {
      token: ''
    }
  },
  methods: {
    submit() {
      const payload = {
        token: this.token,
        usersid: this.$store.state.userCredentials.usersid
      }
      this.$store.dispatch('addUserToBand', payload)
    }
  }
}
</script>


