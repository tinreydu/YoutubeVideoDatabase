<template>
    <div class="container">
      <h1 class="title">Top 15 videos</h1>
      <div class="top-videos">
        <span
        v-for="topVideo in topVideos"
        :key="topVideo.video_id"
        class="video-item"
        @click="navigateToVideo(topVideo.video_id)"
      >
          {{ topVideo.video_title }}
        </span>
      </div>
      <h1 class="title">Top 15 tags</h1>
      <div class="top-tags">
        <span v-for="topTag in topTags" :key="topTag" class="tag-item">
          {{ topTag }}
        </span>
      </div>
      <h1 class="title">Global Videos</h1>
    <div class="global-videos">
      <div
        v-for="globalVideo in globalVideos"
        :key="globalVideo.video_id"
        @click="navigateToVideo(globalVideo.video_id)"
        class="global-video-item"
      >
        <h2>{{ globalVideo.video_title }}</h2>
        <div class="video-details">
          <div class="detail-item">
            <span>Above Average:</span>
            <span :class="{ 'above-average': globalVideo.above_average }">{{ globalVideo.above_average ? 'Yes' : 'No' }}</span>
          </div>
          <div class="detail-item">
            <span>Times Favorited:</span>
            <span class="favorited">{{ globalVideo.times_favorited }}</span>
          </div>
          <div class="detail-item">
            <span>Uniqueness Level:</span>
            <span :class="{ 'unique': globalVideo.uniqueness_level }">{{ globalVideo.uniqueness_level }}</span>
          </div>
        </div>
      </div>
    </div>
    </div>
  </template>

<script>
import {  getTopVideos, getTopTags, getGlobalFavorite} from '../api.js'

export default {
  data() {
    return {
      userId: '',
      topVideos: [],
      topTags:[],
      searchQuery: '',
      globalVideos: []
    }
  },
  async created() {
    try {
      this.userId = window.localStorage.user_id
      const res = await getTopVideos();
      this.topVideos = res.data;
      const r = await getTopTags();
      this.topTags = r.data.map(e => {
        return e.tag_description
      })
      const g = await getGlobalFavorite();
      this.globalVideos = g.data[0];
      console.log(g)
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    navigateToVideo(videoId) {
        console.log(videoId)
      this.$router.push({ name: 'videoDetail', params: { videoId: videoId } });
    },
  },
}
</script>

<style scoped>
span {
    cursor: pointer;
}
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
}

.title {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.top-videos,
.top-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.video-item,
.tag-item {
  padding: 8px 12px;
  background-color: #f1f1f1;
  border-radius: 4px;
  font-size: 14px;
  color: #333;
}
.global-videos {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
}

.global-video-item {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.global-video-item h2 {
  font-size: 18px;
  margin-bottom: 10px;
}

.video-details {
  display: flex;
  flex-direction: column;
}

.detail-item {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.detail-item:last-child {
  margin-bottom: 0;
}

.detail-item span {
  font-size: 14px;
  color: #333;
  margin-right: 5px;
}

.above-average {
  color: #4caf50;
}

.favorited {
  color: #ff9800;
}

.unique {
  color: #2196f3;
}
</style>