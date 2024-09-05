<template>
  <div class="container">
    <div>
        <img :src="video.url" alt="Video thumbnail" />
        <h2>{{ video.title }}</h2>
        <p>{{ video.description }}</p>
        <button @click="this.$router.push({name: 'videoDetail', params: { videoId: video.id}})">Details</button>
        <button @click="this.addToList(video.id)">Add to my list</button>
    </div>
  </div>
</template>

<script>
export default {
    data() {
        video:''
    }
}
</script>

<style>
.container {
    display: flex;
    align-items: center;
    border-left: 1px black solid;
    border-bottom: 1px black solid;
}

</style>