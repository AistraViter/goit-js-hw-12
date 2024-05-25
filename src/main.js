import { perPage, fetchImages } from './js/pixabay-api';

import {
  backgroundColor,
  createImageElements,
  updateGallery,
  initializeLightbox,
  showErrorToast,
  showLoader,
  hideLoader,
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

  if (query !== '') {
    showLoader(loadMoreAfterSearchform);
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
        hideLoader();
        searchForm.reset();
      });
  }
});

//LOAD MORE
loadMoreBtn.addEventListener('click', event => {
  event.preventDefault();
  showLoader(loadMoreAfterBtn);
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
      hideLoader();
      searchForm.reset();
    });
});
