<template>
  <div class="container mx-auto">
    <div class="form-box-register">
      <div class="row">
        <div class="col">
            <h1>Join A Band</h1>
            <h4>Please paste the unique band-code below</h4><hr>
        </div>
      </div>
    <form>
    
    <div class="row">
      <div class="col mt-4">
        <input
          class="form-control"
          type="text"
          placeholder="band-code"
          v-model="token">
      </div>
    </div>
    
    <div class="row">
      <div class="col mt-4">
        <button
          class="btn btn-register-2"
          @click="submit()"> Join
        </button>
      </div>
    </div>

    </form>  
    </div>
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
      this.$store.commit('clearErrors')
      this.$store.dispatch('addUserToBand', payload)
    }
  }
}
</script>


