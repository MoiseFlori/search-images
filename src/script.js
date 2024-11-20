import { searchImages, loadMoreImages, } from './functions.js';

const searchForm = document.getElementById('search-form');
const loadMoreButton = document.querySelector('.load-more');

searchForm.addEventListener('submit', searchImages);
loadMoreButton.addEventListener('click', loadMoreImages);

