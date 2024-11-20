import { fetchImages } from './api.js';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchInput = document.querySelector('input[name="searchQuery"]');
const gallery = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.load-more');

let currentPage = 1;
let currentQuery = '';

export async function searchImages(event) {
  event.preventDefault();

  const query = searchInput.value.trim();
  if (!query) {
    Notiflix.Notify.failure('Please enter a search query.');
    return;
  }

  currentQuery = query;
  currentPage = 1;
  resetGallery();

  try {
    const data = await fetchImages(currentQuery, currentPage);
    if (data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    renderGallery(data.hits);
    Notiflix.Notify.success(`Hooray! Found ${data.totalHits} images.`);

    if (data.totalHits > 40) {
      loadMoreButton.style.display = 'block';
    }
    searchInput.value = '';
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}

function renderGallery(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
          <a href="${largeImageURL}">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b> ${downloads}
            </p>
          </div>
        </div>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionsData: 'alt',
    captionDelay: 250,
  });

  lightbox.refresh();
}

function resetGallery() {
  gallery.innerHTML = '';
  loadMoreButton.style.display = 'none';
}

export async function loadMoreImages() {
  try {
    currentPage++;
    const data = await fetchImages(currentQuery, currentPage);

    renderGallery(data.hits);

    const totalImages = data.totalHits;

    if (totalImages <= currentPage * 40) {
      loadMoreButton.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }

    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();
  } catch (error) {
    Notiflix.Notify.failure('Something went wrong. Please try again later.');
  }
}
