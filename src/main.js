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
let lightbox = initializeLightbox();

//SEARCH FORM
searchForm.addEventListener('submit', async event => {
  event.preventDefault();
  query = searchField.value.trim();
  if (query !== '') {
    try {
      showLoader(loadMoreAfterSearchform);
      const data = await fetchImages(query, (page = 1));
      hitsToShow = data.totalHits;

      if (hitsToShow >= 1) {
        const elements = createImageElements(data.hits);
        updateGallery(gallery, elements);
        lightbox.refresh();
        if (hitsToShow - perPage >= 1) {
          loadMoreBtn.style.display = 'block';
        } else {
          loadMoreBtn.style.display = 'none';
          showErrorToast(
            "We're sorry, but you've reached the end of search results.",
            'bottomRight',
            'blue'
          ); //помилка потестована
        }
      } else { 
        loadMoreBtn.style.display = 'none';
        showErrorToast(
          'Sorry, there are no images matching your search query. Please try again!',
          'topRight',
          'red'
        );
        gallery.innerHTML = ''; //помилка потестована

      }
    } catch (error) {
      gallery.innerHTML = '';
      showErrorToast(
        'An error occurred while fetching the images. Please try again!',
        'topRight',
        'red'
      );
      console.log(error);
    } finally {
      hideLoader();
      searchForm.reset();
    }
  } else { 
    loadMoreBtn.style.display = 'none';
    showErrorToast('Please enter a search query!', 'topRight', 'red');
    gallery.innerHTML = '';
    hideLoader();
    searchForm.reset(); //помилка потестована

  }
});
//LOAD MORE
loadMoreBtn.addEventListener('click', async event => {
  event.preventDefault();
  showLoader(loadMoreAfterBtn);
  page++;
  const data = await fetchImages(query, page);
  try {
    hitsToShow = data.totalHits - (page - 1) * perPage;
    if (hitsToShow >= 1) {
      const elements = createImageElements(data.hits);
      gallery.append(...elements);
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
        ); //помилка потестована
      }
    }
  } catch {
    showErrorToast(
      'An error occurred while fetching the images. Please try again!',
      'topRight',
      'red'
    );
    console.log(error);
  } finally {
    hideLoader();
    searchForm.reset();
  }
});
