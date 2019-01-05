<template>
  <div>
    <input 
      type="text" 
      v-model="username"
      label="Username"
      counter
      :rules="rules" />
    <input 
      name="password"
      :append-icon="show1 ? 'visibility_off' : 'visibility'"
      v-model="password"
      label="Password"
      :rules="rules"
      hint="Must Be At Least 8 Characters"
      :type="show1 ? 'text' : 'password'"
      counter
      @click:append="show1 = !show1" />
      <!-- <button @click='submit' :disabled="!valid" id="btn">Login</button>     -->
      <p> {{ username }} </p>

  </div>
</template>

<script>

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: '',
      valid: true,
      show1: false,
      rules: [
        data => !!data || 'Required.',
        data => data.length < 8 ? 'Too few characters.' : true
      ]
    }
  }
}
</script>
