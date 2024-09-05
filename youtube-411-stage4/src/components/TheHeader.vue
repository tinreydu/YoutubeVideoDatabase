<template>
    <header class="banner-header">
      <button  @click="go('/trends')">Youtube Trends</button>
      <h1 @click="go('/explore');">Youtube 411</h1>
      <div class="auth-buttons">
        <button v-if="!isAuthenticated" @click="go('/login')">Login</button>
        <button v-if="!isAuthenticated" @click="go('/register')">Register</button>
        <div v-else>
        <button  @click="go('/user/' + this.userId)">User {{this.userId}} Home</button>
        <button @click="logout">Logout</button>
      </div>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    data() {
      return {
        isAuthenticated: false,
        userId: ''
      }
    },
    created() {
      this.userId = window.localStorage.user_id
      this.isAuthenticated = this.userId
    },
    methods: {
      logout() {
        localStorage.clear();
        this.isAuthenticated = false;
      },
      go(page) {
        return this.$router.push(page);
      }
    }
  }
  </script>
  
  <style scoped>

  h1 {
    cursor: pointer;
  }
  .banner-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
    color: #fff;
  }
  
  .auth-buttons button {
    background-color: transparent;
    border: 2px solid #fff;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    margin: .1rem .2rem;
  }
  
  .auth-buttons button:hover {
    box-shadow: 0;
    background-color: rgb(255, 255, 255);
    color: cornflowerblue;
    transform: translateY(1.5px);
    box-shadow: 1px 1px 1px 0.8px rgba(0, 0, 255, .2);
    border: 1px solid cornflowerblue;
  }
  </style>
  