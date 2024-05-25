import { perPage, fetchImages } from './js/pixabay-api';

import {
  createImageElements,
  updateGallery,
  initializeLightbox,
  showErrorToast,
  showLoader,
  hideLoader,
  scrollByHeight,
} from './js/render-functions';

//querySelectors
const searchForm = document.querySelector('.search-form');
const searchField = document.querySelector('#input-search');
const gallery = document.querySelector('ul.gallery');
const loadMoreBtn = document.querySelector('#btn-load-more');
const loadMoreAfterSearchform = document.querySelector(
  '.loadmore-after-searchform-container'
);
const loadMoreAfterBtn = document.querySelector(
  '.loadmore-after-btn-container'
);

let page;
let query;
let hitsToShow;

//SEARCH FORM
searchForm.addEventListener('submit', event => {
  event.preventDefault();
  query = searchField.value.trim();
  showLoader(loadMoreAfterSearchform);
  if (query !== '') {
    fetchImages(query, (page = 1))
      .then(data => {
        hitsToShow = data.totalHits;
        if (hitsToShow >= 1) {
          const elements = createImageElements(data.hits);
          updateGallery(gallery, elements);
          let lightbox = initializeLightbox();
          lightbox.refresh();
          scrollByHeight();
          if (hitsToShow - perPage >= 1) {
            loadMoreBtn.style.display = 'block';
          } else {
            loadMoreBtn.style.display = 'none';
            showErrorToast(
              "We're sorry, but you've reached the end of search results.",
              'bottomRight',
              'blue'
            );
          }
        } else {
          showErrorToast(
            'Sorry, there are no images matching your search query. Please try again!',
            'topRight',
            'red'
          );
        }
      })
      .catch(error => {
        showErrorToast(
          'An error occurred while fetching the images. Please try again!',
          'topRight',
          'red'
        );
        console.log(error);
      })
      .finally(() => {
        hideLoader();
        searchForm.reset();
      });
  }
});

//LOAD MORE
loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  loadMoreBtn.style.display = 'none';
  showLoader(loadMoreAfterBtn);
  page++;
  fetchImages(query, page)
    .then(data => {
      hitsToShow = data.totalHits - (page - 1) * perPage;
      if (hitsToShow >= 1) {
        const elements = createImageElements(data.hits);
        gallery.append(...elements);
        let lightbox = initializeLightbox();
        lightbox.refresh();
        scrollByHeight();
        if (hitsToShow - perPage >= 1) {
          loadMoreBtn.style.display = 'block';
        } else {
          loadMoreBtn.style.display = 'none';
          showErrorToast(
            "We're sorry, but you've reached the end of search results.",
            'bottomRight',
            'blue'
          );
        }
      }
    })
    .catch(error => {
      showErrorToast(
        'An error occurred while fetching the images. Please try again!',
        'topRight',
        'red'
      );
      console.log(error);
    })
    .finally(() => {
      hideLoader();
      searchForm.reset();
    });
});
