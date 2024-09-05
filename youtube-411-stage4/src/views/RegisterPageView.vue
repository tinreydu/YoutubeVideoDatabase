<template>
    <div class="auth-page">
      <h2>Register</h2>
      <div class="form-container">
        <label>
          Name:
          <input type="text" v-model="username" required>
        </label>
        <label>
          Email:
          <input type="email" v-model="email" required>
        </label>
        <label>
          Password:
          <input type="password" v-model="password" required>
        </label>
        <button @click="handleSubmit">Register</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </div>
  </template>
  
  <script>
  import {userRegister} from '../api.js'
  export default {
    data() {
      return {
        username: '',
        email: '',
        password: '',
        errorMessage: ''
      }
    },
    methods: {
      async handleSubmit() {
        try {
          const response = await userRegister(this.username, this.email, this.password)
          const userId = response.data[0].insertId
          window.localStorage.user_id = userId
          this.$router.push('/explore')
          
        } catch (error) {
          this.errorMessage = error
          
        }
      }
    }
  }
  </script>
  
  <style>
  .auth-page {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  .form-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 2rem;
  }
  </style>

   
  