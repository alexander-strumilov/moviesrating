const api_key = '44b1cadf661754120ef6b948c12f62d8';
let totalPages = 0;

const header = document.getElementById('header');

const videoList = document.querySelector('.video-list'),
    searchList = document.querySelector('.search-result'),
    searchResultWrap = document.querySelector('.search-result-wrap');

const searchBtn = document.querySelector('.btn-search'),
    searchField = document.querySelector('#search');

const searchQueryString = document.querySelector('.search-querystring');

const preloader = document.getElementById('preloader');
const pagination = document.getElementById('pagination')

const overlay = document.querySelector('.overlay'),
    modal = document.querySelector('.modal'),
    close = document.querySelector('.close-modal');

const getJSON = async (data) => {
    const response = await fetch(data);
    return await response.json();
}

const searchVideos = async function (query, id = 1) {

    const data = await getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&page=${id}`);
    console.log(data);
    let idList = [];
    try {
        for (let i = 0; i < data.results.length; i++) {
            idList.push(data.results[i].id);
        }
        if (totalPages == 0) {
            totalPages = data.total_pages;
            createPagination(totalPages, query);
        }
        searchQueryString.textContent = totalPages > 1 ? `${query} – Page ${id}` : `${query}`;
    } catch (error) {
        alert(error)
        searchQueryString.innerHTML = 'ERROR, TRY AGAIN...';
        return false;
    }
    idList.forEach(id => {
        createMovie(id);
    });
    setTimeout(() => {
        changeRatingColor();
    }, 2000);
}



const createMovie = async function (id) {
    const data = await getJSON(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`);
    let videoItem = document.createElement('div');
    videoItem.classList.add('video-list__item', 'col-md-6');
    let imageSrc = `https://image.tmdb.org/t/p/w500${data.backdrop_path}`;
    if (data.backdrop_path === null) {
        imageSrc = '/images/test.jpg';
    }
    let overview = data.overview.length > 200 ? data.overview.substring(0, 200) + "..." : data.overview;
    videoItem.innerHTML = `
    <a href="#" data-id="${id}" class="video-link">
        <h4>${data.original_title}</h4>
        <p>${overview}</p>
        <img src='${imageSrc}' />
        <p class="video-rating"><span class="video-rating__name">Rating:</span> <span class="video-rating__value" data-rating="${data.vote_average}">${data.vote_average}/10</span> </p>
    </a>
    `;
    searchList.appendChild(videoItem);
    // changeRatingColor(videoItem, data.vote_average);
}

const showFilmInfo = async function (id) {
    const data = await getJSON(`https://api.themoviedb.org/3/movie/${id}?api_key=${api_key}`);
    console.log(data);
    modal.innerHTML = `
    <div class="modal-item">
    <h2>${data.title}</h2>
        <div class="container">
            <div class="row">
   
                    <div class="modai-item-info_left col-md-6">
                        <p><span class="modal-item_descr">Release date: </span>${data.release_date}</p>
                        <p><span class="modal-item_descr"></span>${data.overview}</p>
                        <p><span class="modal-item_descr">Budget: </span>${data.budget == 0 ? '<i>no info</i>' : `${data.budget} $$`}</p>
                        <p><span class="modal-item_descr">Vote average: </span>${data.vote_average}</p>
                        <p><span class="modal-item_descr">Vote count: </span>${data.vote_count}</p>
                    </div>
                    <div class="modai-item-info_right col-md-6">
                        <img src='https://image.tmdb.org/t/p/w500${data.poster_path}' />
                    </div>
            </div>
        </div>
    </div>
    `
}

function createPagination(navCount, query) {
    pagination.innerHTML = '';
    if (totalPages > 1) {
        for (let i = 0; i < navCount; i++) {
            let navLink = document.createElement('a');
            navLink.setAttribute('data-href', `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&query=${query}&page=${i}`);
            navLink.setAttribute('data-query', query);
            navLink.setAttribute('data-id', i + 1);

            navLink.textContent = i + 1;
            pagination.appendChild(navLink);
        }
    }
}

function changeRatingColor() {
    let items = document.getElementsByClassName('video-rating__value');
    Array.from(items).forEach(item => {
        let itemValue = item.getAttribute('data-rating');
        if (itemValue < 1) {
            item.style.color = '#a83232'
        } else if (itemValue > 1 && itemValue <= 2) {
            item.style.color = '#a84832'
        } else if (itemValue > 2 && itemValue <= 3) {
            item.style.color = '#a85b32'
        } else if (itemValue > 3 && itemValue <= 4) {
            item.style.color = '#a87f32'
        } else if (itemValue > 4 && itemValue <= 5) {
            item.style.color = '#a89832'
        } else if (itemValue > 5 && itemValue <= 6) {
            item.style.color = '#a0a832'
        } else if (itemValue > 6 && itemValue <= 7) {
            item.style.color = '#8ca832'
        } else if (itemValue > 7 && itemValue <= 8) {
            item.style.color = '#79a832'
        } else if (itemValue > 8 && itemValue <= 9) {
            item.style.color = '#61a832'
        } else if (itemValue > 9 && itemValue <= 10) {
            item.style.color = '#32a834'
        }
    });
}

function animateHeader() {
    header.style.top = 50 + '%';
    let top = header.style.top;
    let timerId = setTimeout(function tick() {
        top = +top - 1;
        console.log(top);
        timerId = setTimeout(tick, 1000); // (*)
    }, 2000);
}
animateHeader()
searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    searchList.innerHTML = '';
    header.classList.remove('header_center');
    videoListItems = [];
    preloader.classList.remove('hide');
    searchResultWrap.classList.add('hide');
    totalPages = 0;
    searchVideos(searchField.value);
    setTimeout(() => {
        searchResultWrap.classList.remove('hide');
        searchResultWrap.classList.add('show');
        preloader.classList.add('hide');
    }, 2000);
});

searchList.addEventListener('click', (e) => {
    e.preventDefault();
    let target = e.target.closest('a');
    if (target.matches('a.video-link')) {
        console.log(target.getAttribute('data-id'));
    }
    overlay.classList.add('show');
    showFilmInfo(target.getAttribute('data-id'));
});

close.addEventListener('click', () => {
    overlay.classList.remove('show');
});

pagination.addEventListener('click', (e) => {
    let target = e.target;
    e.preventDefault();
    searchList.innerHTML = '';
    videoListItems = [];
    preloader.classList.remove('hide');
    searchResultWrap.classList.add('hide');
    searchVideos(target.getAttribute('data-query'), target.getAttribute('data-id'));
    setTimeout(() => {
        searchResultWrap.classList.remove('hide');
        searchResultWrap.classList.add('show');
        preloader.classList.add('hide');
    }, 2000);
})