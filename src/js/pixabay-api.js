import axios from 'axios';

const API_KEY = '44002741-2ff50451c0a1667e01f2d5f97';
const PER_PAGE = 15;

axios.defaults.baseURL = "https://pixabay.com/api/";
const paginate =`?per_page=${PER_PAGE}`


export async function fetchImages(query) {
  const response = await axios.get(paginate, {
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
