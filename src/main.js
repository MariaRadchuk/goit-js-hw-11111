import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');

loader.style.display = 'none';

const API_KEY = '42200022-9c7e7676f0f903944c054771a';

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
    event.preventDefault();
    const inputValue = event.target.elements.input.value.trim();
    if (!inputValue) return;
    
    loader.style.display = 'block';
    
    searchPhotos(inputValue)
        .then(displayPhotos)
        .catch(handleError);
    
    event.target.reset();
}

function searchPhotos(query) {
    const url = `https://pixabay.com/api/?key=${API_KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${encodeURIComponent(query)}`;
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
            return response.json();
        });
}

function displayPhotos(data) {
    if (data.hits.length === 0) {
        showErrorToast('Sorry, there are no images matching your search query. Please try again!');
        gallery.innerHTML = '';
        return;
    }
    
    const imagesHTML = data.hits.map(image => `
        <a class="gallery-link" href="${image.largeImageURL}">
            <img class="gallery-image" src="${image.webformatURL}" alt="${image.tags}">
        </a>
        <div class="img-content">
            <div>
                <h3>Likes</h3>
                <p>${image.likes}</p>
            </div>
            <div>
                <h3>Views</h3>
                <p>${image.views}</p>
            </div>
            <div>
                <h3>Comments</h3>
                <p>${image.comments}</p>
            </div>
            <div>
                <h3>Downloads</h3>
                <p>${image.downloads}</p>
            </div>
        </div>
    `).join('');
    
    gallery.innerHTML = imagesHTML;
    
    const lightbox = new SimpleLightbox('.gallery-link');
    lightbox.refresh();
    
    loader.style.display = 'none';
}

function showErrorToast(message) {
    iziToast.show({
        message: message,
        messageColor: '#FFFFFF',
        backgroundColor: '#EF4040',
        position: 'topRight',
        messageSize: '16px',
        messageLineHeight: '24px',
        maxWidth: '432px',
    });
}

function handleError(error) {
    console.error('Error occurred:', error);
    showErrorToast('An error occurred. Please try again later.');
    loader.style.display = 'none';
}
