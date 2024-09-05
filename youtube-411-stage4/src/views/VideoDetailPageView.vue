<template>
    <div class="video-detail">
      <h1 class="video-title">{{ video.video_title}}</h1>
      <img class="video-thumbnail" :src="video.thumbnail_link" alt="Video Thumbnail">
      <div class="video-metadata">
        <div class="video-metadata-item">
          <span class="video-metadata-label">Published At:</span>
          <span class="video-metadata-value">{{ video.uploaded_date }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Trending At:</span>
          <span class="video-metadata-value">{{ video.trending_date }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Channel:</span>
          <span class="video-metadata-value">{{ video.channel_title }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Category:</span>
          <span class="video-metadata-value">{{ video.category_description }}</span>
        </div>
        <div class="video-metadata-item">
  <span class="video-metadata-label">Tags:</span>
  <span
    class="video-metadata-value video-tag"
    v-for="(tag, index) in video.tag_description"
    :key="index"
    @click="addTagToList(video.tag_id[index], tag)"
  >
    {{ tag }}
  </span>
</div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Views:</span>
          <span class="video-metadata-value">{{ video.view_count }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Likes:</span>
          <span class="video-metadata-value">{{ video.like_count }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Dislikes:</span>
          <span class="video-metadata-value">{{ video.dislike_count }}</span>
        </div>
        <div class="video-metadata-item">
          <span class="video-metadata-label">Comments:</span>
          <span class="video-metadata-value">{{ video.comment_count }}</span>
        </div>
      </div>
      <p class="video-description">{{ video.description }}</p>
      <button @click="this.addVideoToList(video.video_id)">Add Video to My List</button>
      <p class="message">{{ message }}</p>
    </div>
  </template>
  
  
  
  <script>
  import {getVideoById, addFavoriteTag, addFavoriteVideo} from '../api.js'
  export default {
    async created() {
      this.userId = window.localStorage.user_id
      const videoId = this.$route.params.videoId
      const response = await getVideoById(videoId)
      console.log(response.data)
      this.video = response.data
      
    },
    data() {
      return {
        userId:'',
        video: '',
        message: "",
      }
    },
    methods: {
    async addVideoToList(videoId) {
      try {
        await addFavoriteVideo(this.userId, videoId);
        this.message = "Video added to your list successfully!";
      } catch (error) {
        console.error(error);
        this.message = "Error adding video to your list";
      }
    },
    async addTagToList(tagId, tagDescription) {
      try {
        await addFavoriteTag(this.userId, tagId);
        this.message = `Tag "${tagDescription}" added to your list successfully!`;
      } catch (error) {
        console.error(error);
        this.message = "Error adding tag to your list";
      }
    },
  },
  }
  </script>

<style scoped>
.video-detail {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.video-title {
  font-size: 2rem;
  margin: 2rem 0;
}

.video-metadata {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.video-metadata-item {
  margin: 1rem;
  padding: 0.5rem;
  background-color: #f2f2f2;
  border-radius: 0.5rem;
}

.video-metadata-label {
  font-weight: bold;
  margin-right: 0.5rem;
}

.video-description {
  margin: 2rem 0;
}

.video-tag {
  margin: 0.1rem;
  padding: 0.3rem;
  border-radius: 0.5rem;
  background-color: #d6ccc2;
  cursor: pointer;
  font-size: .4rem;
}
.video-tag:hover {
  background-color: #edb89f;
}
.add-button {
  background-color: #1e88e5;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  margin-bottom: 1rem;
}

.add-button:hover {
  background-color: #1565c0;
}

.message {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #4caf50;
  font-weight: bold;
}
</style>
  