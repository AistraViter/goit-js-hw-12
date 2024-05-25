import { perPage, fetchImages } from './js/pixabay-api';

import {
  backgroundColor,
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
          updateGallery(gallery, elements);
          let lightbox = initializeLightbox();
          lightbox.refresh();
          const galleryItem = document.querySelector('.gallery-item');
          if (galleryItem) {
            const scroll = galleryItem.getBoundingClientRect();
            const scrollHeight = scroll.height * 2;
  
            window.scrollBy({
              top: scrollHeight,
              left: 0,
              behavior: 'smooth',
            });
          }
  
          console.log(galleryItem.getBoundingClientRect());

          if (hitsToShow - perPage >= 1) {
            loadMoreBtn.style.display = 'block';
          } else {
            showErrorToast(
              "We're sorry, but you've reached the end of search results.",
              'blue'
            );
          }
        } else {
          showErrorToast(
            'Sorry, there are no images matching your search query. Please try again!',
            'red'
          );
        }
      })
      .catch(error => {
        showErrorToast(
          'An error occurred while fetching the images. Please try again!',
          'red'
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
      loadMoreBtn.style.display = 'none';

      if (hitsToShow >= 1) {
        const elements = createImageElements(data.hits);
        gallery.append(...elements);
        let lightbox = initializeLightbox();
        lightbox.refresh();
        const galleryItem = document.querySelector('.gallery-item');
        if (galleryItem) {
          const scroll = galleryItem.getBoundingClientRect();
          const scrollHeight = scroll.height * 2;

          window.scrollBy({
            top: 500,
            left: 0,
            behavior: 'smooth',
          });
        }

        if (hitsToShow - perPage >= 1) {
          setTimeout(() => {
            loadMoreBtn.style.display = 'block';
          }, 2000);
        } else {
          showErrorToast(
            "We're sorry, but you've reached the end of search results.",
            'blue'
          );
        }
      }
    })
    .catch(error => {
      showErrorToast(
        'An error occurred while fetching the images. Please try again!',
        'red'
      );
      console.log(error);
    })
    .finally(() => {
      // Затримка для тестування
      setTimeout(() => {
        hideLoader();
        searchForm.reset();
      }, 5000); // Затримка у мілісекундах (тут 2000 мс = 2 сек)
    });
});
