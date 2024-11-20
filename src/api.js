import axios from 'axios';

const API_KEY = '47183054-e1a59e68b6a36ed457abdd105';

export async function fetchImages(query, page) {
  const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safeSearch=true&page=${page}&per_page=40`;

  const response = await axios.get(BASE_URL);
  return response.data;
}
