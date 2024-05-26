import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// Функції що стосуються завантаження та видалення loader

export function showLoader(formWhereShow) {
  const loader = document.createElement('p');
  loader.classList.add('loader');
  loader.textContent = 'Loading images, please wait';
  loader.style.display = 'block';
  return formWhereShow.append(loader);
}
export function hideLoader() {
  const loader = document.querySelector('.loader');
    loader.style.display = 'none';
    loader.remove();
}

//Функція створює структуру для галереї зображень
export function createImageElements(images) {
  return images.map(image => {
    const li = document.createElement('li');
    li.classList.add('gallery-item');
    const link = document.createElement('a');
    link.classList.add('gallery-link');
    link.href = image.largeImageURL;
    const img = document.createElement('img');
    img.classList.add('gallery-image');
    img.src = image.webformatURL;
    img.dataset.source = image.largeImageURL;
    img.alt = image.tags;

    const caption = document.createElement('ul');
    caption.classList.add('image-caption');
    const captionItem1 = document.createElement('li');
    captionItem1.classList.add('caption-item');
    const captionItemLikes = document.createElement('p');
    captionItemLikes.textContent = `Likes: \n${image.likes}`;

    const captionItem2 = document.createElement('li');
    captionItem2.classList.add('caption-item');
    const captionItemViewses = document.createElement('p');
    captionItemViewses.textContent = `Views: \n${image.views}`;

    const captionItem3 = document.createElement('li');
    captionItem3.classList.add('caption-item');
    const captionItemComments = document.createElement('p');
    captionItemComments.textContent = `Comments: \n${image.comments}`;

    const captionItem4 = document.createElement('li');
    captionItem4.classList.add('caption-item');
    const captionItemDownloads = document.createElement('p');
    captionItemDownloads.textContent = `Downloads: \n${image.downloads}`;

    link.append(img);
    captionItem1.append(captionItemLikes);
    captionItem2.append(captionItemViewses);
    captionItem3.append(captionItemComments);
    captionItem4.append(captionItemDownloads);
    caption.append(captionItem1, captionItem2, captionItem3, captionItem4);
    li.append(link);
    li.append(caption);

    return li;
  });
}

//Функція очищує галерею та створює нові елементи згідно раніше створеної структури
export function updateGallery(gallery, elements) {
  gallery.innerHTML = '';
  gallery.append(...elements);
}

//Функція для збільшення зображення з бібліотекою SimpleLightbox
export function initializeLightbox() {
  return new SimpleLightbox('.gallery a', {
    captions: true, // Увімкнути підписи
    captionSelector: 'img', // Селектор для елемента, з якого брати підпис
    captionType: 'attr', // Тип отримання підпису: 'attr', 'data' або 'text'
    captionsData: 'alt', // Атрибут або data-атрибут, який використовується для отримання підпису
    captionPosition: 'bottom', // Позиція підпису: 'top' або 'bottom'
    captionDelay: 250, // Затримка перед показом підпису
  });
}

//Функція для створення повідомлень з бібліотекою iziToast
export function showErrorToast(message, position, backgroundColor) {
  iziToast.show({
    class: 'promise-message',
    iconUrl: '/goit-js-hw-12/cancel-circle.svg',
    iconColor: 'whte',
    message: message,
    messageColor: 'white',
    messageSize: '18',
    backgroundColor: backgroundColor,
    position: position,
    class: 'custom-toast',
    icon: 'iziToast-icon',
  });
}

//  Функція для скролу
export function scrollByHeight() {
  const galleryItem = document.querySelector('.gallery-item');
  if (galleryItem) {
    const scroll = galleryItem.getBoundingClientRect();
    const scrollHeight = scroll.height *2;
    window.scrollBy({
      top: scrollHeight,
      left: 0,
      behavior: 'smooth',
    });
  }
}
