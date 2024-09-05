<template>
  <div>
    <div class="search-box">
      <input v-model="searchQuery" placeholder="Search videos by title" />
      <button @click="submitSearch">Search</button>
    </div>
    <p class="message">{{ message }}</p>
    <div class="video-list">
    <div v-for="video in filteredVideos" :key="video.id" class="video">
      <img :src="video.thumbnail_link
" alt="Video thumbnail" />
      <h2>{{ video.video_title}}</h2>
      <p>{{ video.channel_title}}</p>
      <button @click="this.$router.push({name: 'videoDetail', params: { videoId: video.video_id}})">Details</button>
      <button @click="this.addToList(video.video_id)">Add to my list</button>
    </div>
  </div>
  <div id="plotly_figure"></div>
</div>
</template>

<script>
import { getVideos, searchVideos, addFavoriteVideo,} from '../api.js'

export default {
  data() {
    return {
      userId: '',
      videos: [],
      anares: [],
      searchQuery: '',
      message: ''
    }
  },
  async created() {
    try {
      this.userId = window.localStorage.user_id
      const response = await getVideos();
      this.videos = response.data;
    } catch (error) {
      this.message = error
    }
  },
  methods: {
    async submitSearch() {
      console.log(this.searchQuery)
      try {
        const response = await searchVideos(this.searchQuery);
        this.videos = response.data["data"];
        //catch the plotly data here
        this.anares = response.data["analysis"];
        
        // Update this part to display the Plotly figure
        const figureData = JSON.parse(this.anares);
        // Wait for the next DOM update cycle before executing the code inside
        this.$nextTick(() => {
          const figureElement = document.getElementById("plotly_figure");

          // Recreate the Plotly figure using the JSON data
          console.log("figureData:", figureData);

          // Display the interactive figure
          Plotly.newPlot(figureElement, figureData.data, figureData.layout);
        });
      } catch (error) {
        console.error(error);
      }
    },
    async addToList(videoId) {
      try {
        await addFavoriteVideo(this.userId,videoId)
        this.message = `Video "${videoId}" added to your list!`;
      } catch (error) {
        this.message = "Error: the video may already exist in your list"
      }
    }
  },
  computed: {
    filteredVideos() {
      return this.videos;
    }
  }
}
</script>

<style scoped>
span {
  padding-right: 3rem;
}
.search-box {
  display: flex;
  justify-content: center;
  margin: 2rem;
}
.video-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.video {
  margin: 1rem;
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 300px;
}

.video img {
  max-width: 100%;
  height: auto;
  margin-bottom: 1rem;
}
button {
  margin: .3rem;
}
.message {
  font-size: 1rem;
  margin-bottom: 1rem;
  color: #4caf50;
  font-weight: bold;
}
</style>
