import { fetchImages } from './js/pixabay-api';
import { perPage } from './js/pixabay-api';

import {
  createImageElements,
  updateGallery,
  initializeLightbox,
  showErrorToast,
} from './js/render-functions';

//querySelectors
const searchForm = document.querySelector('.search-form');
const searchField = document.querySelector('#input-search');
const gallery = document.querySelector('ul.gallery');
const loadMoreBtn = document.querySelector('#btn-load-more');
const loadMoreContainer = document.querySelector('.load-more-container');


let page;
let query;
let hitsToShow;

// loader is created
const loader = document.createElement('div');
loader.classList.add('loader');
const loaderText = document.createElement('p');
loaderText.classList.add('loader-text');
loaderText.textContent = 'Loads images, please wait';
loader.append(loaderText);

function showLoaderFirst() {
  loader.classList.add('loader-below-form');
  searchForm.append(loader);
  loader.style.display = 'block';
}

function showLoaderSecond() {
  loader.classList.add('loader-below-loadMoreBtn');
  loadMoreContainer.append(loader);
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
  loader.classList.remove('loader-below-form');
  loader.classList.remove('loader-below-loadMoreBtn');
  loader.remove();
}

//SEARCH FORM
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  query = searchField.value.trim();

  if (query !== '') {
    showLoaderFirst();
    page = 1;
    fetchImages(query, page)
      .then(data => {
        hitsToShow = data.totalHits;
        if (hitsToShow >= 1) {
          const elements = createImageElements(data.hits);
          console.log(elements.length);
          updateGallery(gallery, elements);
          let lightbox = initializeLightbox();
          lightbox.refresh();
          loadMoreBtn.style.display = 'block';
        } else {
          showErrorToast(
            'Sorry, there are no images matching your search query. Please try again!'
          );
        }
      })
      .catch(error => {
        showErrorToast(
          'An error occurred while fetching the images. Please try again!'
        );
        console.log(error);
      })
      .finally(() => {
        // Затримка для тестування
        setTimeout(() => {
          hideLoader();
          searchForm.reset();
        }, 2000); // Затримка у мілісекундах (тут 2000 мс = 2 сек)
      });
  }
});

//LOAD MORE
loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  showLoaderSecond();
  page++;
  fetchImages(query, page)
    .then(data => {
      hitsToShow = data.totalHits - (page - 1) * perPage;

      if (hitsToShow >= 1) {
        const elements = createImageElements(data.hits);
        gallery.append(...elements);
        let lightbox = initializeLightbox();
        lightbox.refresh();
        loadMoreBtn.style.display = 'block';
      } else {
        showErrorToast(
          'Sorry, there are no images matching your search query. Please try again!'
        );
      }
    })
    .catch(error => {
      showErrorToast(
        'An error occurred while fetching the images. Please try again!'
      );
      console.log(error);
    })
    .finally(() => {
      // Затримка для тестування
      setTimeout(() => {
        hideLoader();
        searchForm.reset();
      }, 10000); // Затримка у мілісекундах (тут 2000 мс = 2 сек)
    });
});
