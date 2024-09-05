import axios from 'axios';

const base_URL = 'http://localhost:3000/api'; 


export const userRegister = (userName, userEmail, password) => {
  console.log(password)
  return axios.post(`${base_URL}/user/register`, {
    userName,
    userEmail,
    password,
  });
};

export const userLogin = (userEmail, password) => {
  return axios.post(`${base_URL}/user/login`, {
    userEmail,
    password,
  });
};

export const getAllUsers = () => {
  return axios.get(`${base_URL}/users`);
}

export const getUserInfo = (userId) => {
  return axios.get(`${base_URL}/user/${userId}`);
}
export const userUpdate = (userId, userName, userEmail ,password) => {
  return axios.put(`${base_URL}/user/${userId}`, {
    userName,
    userEmail,
    password,
  });
};

export const getVideos = () => {
  return axios.get(`${base_URL}/videos`);
};

export const getTopVideos = () => {
  return axios.get(`${base_URL}/advancedQuery/video`);
};

export const getTopTags = () => {
  return axios.get(`${base_URL}/advancedQuery/tag`);
};

export const getVideoById = (videoId) => {
  console.log('get video by id in api.js')
  return axios.get(`${base_URL}/video/${videoId}`);
};

export const searchVideos = (videoName) => {
  console.log('search videos')
  return axios.get(`${base_URL}/searchVideo`, {
    params: {
      videoName,
    },
  });
};

export const getFavoriteVideo = (userId) => {
  return axios.get(`${base_URL}/user/${userId}/favoriteVideo`);
};

export const addFavoriteVideo = (userId, videoId) => {
  return axios.post(`${base_URL}/user/${userId}/favoriteVideo`, {
    videoId,
  });
};

export const removeFavoriteVideo = (userId, videoId) => {
  return axios.delete(`${base_URL}/user/${userId}/favoriteVideo/${videoId}`);
};

export const getFavoriteTag = (userId) => {
  return axios.get(`${base_URL}/user/${userId}/favoriteTag`);
};

export const addFavoriteTag = (userId, tagId) => {
  return axios.post(`${base_URL}/user/${userId}/favoriteTag`, {
    tagId,
  });
};

export const removeFavoriteTag = (userId, tagId) => {
  return axios.delete(`${base_URL}/user/${userId}/favoriteTag/${tagId}`);
};


export const getGlobalFavorite = () => {
  return axios.get(`${base_URL}/getGlobalFavorite`);
}