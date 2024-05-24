import axios from 'axios';

const API_KEY = '44002741-2ff50451c0a1667e01f2d5f97';
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(query) {
  const response = await axios.get('/', {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
    },
  });
  const data = response.data;
  return data;
}
