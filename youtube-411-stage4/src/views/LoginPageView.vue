<template>
    <div class="auth-page">
      <h2>Login</h2>
      <div class="form-container">
        <label>
          Email:
          <input type="email" v-model="email" required>
        </label>
        <label>
          Password:
          <input type="password" v-model="password" required>
        </label>
        <button @click="handleSubmit">Login</button>
      </div>
      <p v-if="errorMessage" class="error-message">{{ errorMessage.data }}</p>
    </div>
  </template>
  
  <script>
  import { userLogin } from '../api.js'
  export default {
    data() {
      return {
        email: '',
        password: '',
        errorMessage: ''
      }
    },
    methods: {
      async handleSubmit() {
        try {
          const response = await userLogin(this.email, this.password)
          window.localStorage.user_id = response.data.user_id
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
  
  label {
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
  }
  
  input {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  button {
    margin-top: 1rem;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
    font-size: 1rem;
    cursor: pointer;
  }
  
  .error-message {
    margin-top: 1rem;
    color: red;
    font-size: 1rem;
  }
  </style>
  