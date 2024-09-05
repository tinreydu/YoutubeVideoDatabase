<template>
  <div class="profile-container">
    <h1>User Profile</h1>
    <span class="loyal-tag" v-if="userIsLoyal">loyal user</span>
    <div class="input-group">
      <label for="username">User Name:</label>
      <input id="username" v-model="username" :disabled="!editing">
    </div>
    <div class="input-group">
      <label for="useremail">User Email:</label>
      <input id="useremail" v-model="useremail" :disabled="!editing">
    </div>
    <div class="input-group">
      <label for="password">Password:</label>
      <input id="password" v-model="password" :disabled="!editing" :type="passwordVisible ? 'text' : 'password'">
      <button @click="togglePasswordVisibility">{{ passwordVisible ? 'Hide' : 'Show' }}</button>
    </div>
    <div>
      <button @click="editing = true" v-if="!editing">Edit</button>
      <button @click="saveChanges" v-if="editing">Save</button>
    </div>
    <hr>
    <p class="message">{{ message }}</p>
    <h2>Saved Videos</h2>
    <ul class="saved-list">
      <li class="saved-item" v-for="video in savedVideos" :key="video.video_id">
        <img class="video-thumbnail" :src="video.thumbnail_link" alt="Video Thumbnail">
        <div class="video-info">
          {{ video.video_title }} <span v-if="video.favorite_date">(added at {{ video.favorite_date }})</span>
        </div>
        <button class="remove-button" @click="removeVideo(video.video_id)">Remove</button>
      </li>
    </ul>
    <h2>Saved Tags</h2>
    <ul class="saved-list">
      <li v-for="tag in savedTags" :key="tag.tag_id">
        {{ tag.tag_description }} <span v-if="tag.favorite_date">(added at {{ tag.favorite_date }}) </span>
        <button @click="removeTag(tag.tag_id)">Remove</button>
      </li>
    </ul>
  </div>
</template>
  
  <script>
  import { getUserInfo, userUpdate, getFavoriteVideo, getFavoriteTag,removeFavoriteVideo, removeFavoriteTag } from '../api.js'

  export default {
    async created() {
        this.userId = this.$route.params.userId
        this.userIfo = await getUserInfo(this.userId)
        this.userId = this.userIfo.data[0].user_id
        this.username = this.userIfo.data[0].user_name
        this.useremail = this.userIfo.data[0].user_email
        this.password = this.userIfo.data[0].user_password
        this.userIsLoyal = this.userIfo.data[0].loyal_user == 1
        const response = await getFavoriteVideo(this.userId)
        this.savedVideos = response.data
        const r = await getFavoriteTag(this.userId)
        this.savedTags = r.data
        console.log(this.savedTags)
        this.getUsers()
    },
    data() {
      return {
        userId : '',
        username: '',
        useremail: '',
        password: '',
        passwordVisible: false,
        userIsLoyal: false,
        editing: false,
        savedVideos: [],
        savedTags:[],
        message: ''
      };
    },
    methods: {
      togglePasswordVisibility() {
        this.passwordVisible = !this.passwordVisible;
      },
      async saveChanges() {
        try {
          this.editing = false;
          await userUpdate(this.userId,this.username, this.useremail, this.password)
          this.message = "User info updated successfully!"
        } catch (error) {
          this.message = error;
        }
      },
      async removeVideo(videoId) {
        try {
          await removeFavoriteVideo(this.userId, videoId)
          const response = await getFavoriteVideo(this.userId)
          this.savedVideos = response.data
          this.message = `Video "${videoId}" removed from your list!`;
        } catch (error) {
          this.message = error
        }
      },
      async removeTag(tagId) {
        try {
          await removeFavoriteTag(this.userId, tagId)
          const response = await getFavoriteTag(this.userId)
          this.savedTags = response.data  
          this.message = `Tag "${tagId}" removed from your list!`;      
        } catch (error) {
          this.message = error
        }
      },
    },
  };
  </script>

<style scoped>
  .profile-container {
    width: 80%;
    margin: 0 auto;
    font-family: Arial, sans-serif;
  }

  h1, h2 {
    color: #333;
  }
  span {
    display: inline-block;
  }

  .loyal-tag {
    display: inline-block;
    background-color: #4caf50;
    color: #fff;
    padding: 4px 8px;
    border-radius: 4px;
    margin-left: 8px;
  }

  .input-group {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  label {
    width: 150px;
    font-weight: bold;
  }

  input {  
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  button {
    background-color: #4caf50;
    color: #fff;
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-left: 8px;
  }

  button:hover {
    background-color: #45a049;
  }

  hr {
    border: 1px solid #ccc;
    margin: 2rem 0;
  }

  .saved-list {
    list-style-type: none;
    padding: 0;
  }

  .saved-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }

  .video-thumbnail {
    width: 120px;
    height: 90px;
    object-fit: cover;
    margin-right: 1rem;
  }

  .video-info {
    flex-grow: 1;
  }

  .remove-button {
    background-color: #f44336;
  }

  .remove-button:hover {
    background-color: #e53935;
  }
  .message {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #4caf50;
  font-weight: bold;
}

</style>
