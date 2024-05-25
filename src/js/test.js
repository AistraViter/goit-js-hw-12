import axios from 'axios';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export async function fetchPosts(page = 1, perPage = 25) {
  try {
    const response = await axios.get('/posts', {
      params: {
        _page: page,
        _per_page: perPage,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
}
