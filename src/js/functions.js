const startButton = document.querySelector('.startButton');
const addButton = document.querySelector('.addButton');
const closeButton = document.querySelector('.modal-close');
const container = document.querySelector('.modal-container');
const artistName = document.querySelector('#artistName');
const reset = document.querySelector('.reset');
const autocompleteList = document.querySelector('.autocompleteList');
const modalList = document.querySelector('.modalList');
const search = document.querySelector('.search');

const onStart = () => {
    let classList = ['fadeIn', 'fadeOut', 'disp-none', 'disp-block'];
    toggleClass('.startText', classList, 1);
    classList = ['disp-none', 'disp-block'];
    toggleClass('.l-albumList', classList, 1);
}

const onOpen = () => {
    container.classList.add('active');
    removeElements(['.modalList', '.autocompleteList']);
    artistName.value = '';
    artistName.setAttribute('data-artist_id', '');
}

const onClose = () => { container.classList.remove('active'); }

const onClear = () => {
    artistName.value = '';
    artistName.setAttribute('data-artist_id', '');
    removeElements(['.modalList', '.autocompleteList']);
}

// アーティストの検索候補を表示する
const searchArtist = () => {
    let data_artistName = artistName.value;
    if (autocompleteList) autocompleteList.remove();

    const params = new URLSearchParams({ 'artistName': data_artistName });
    fetch(`./js/ajax/searchArtists.php?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(result => {
            const jsonResult = JSON.parse(result);
            if (modalList) modalList.remove();
            artistAutocomplete(jsonResult);
        })
        .catch(error => {
            console.log(error);
            const autocompleteContainer = document.querySelector('.l-autocomplete');
            const ul = document.createElement('ul');
            ul.classList.add('autocompleteList', 'padding-all-1em');
            autocompleteContainer.appendChild(ul);
            let errorItem = `<li>アーティスト情報の取得に失敗しました。</li>`
            document.querySelector('.autocompleteList').innerHTML = errorItem;
        });
}
const artistAutocomplete = (result) => {
    const autocompleteList = document.querySelector('.autocompleteList');
    const autocompleteContainer = document.querySelector('.l-autocomplete');

    if (autocompleteList && autocompleteList.value === "") {
        removeElements(['.modalList', '.autocompleteList']);
        return;
    }

    if (!autocompleteList) {
        const ul = document.createElement('ul');
        ul.classList.add('autocompleteList', 'padding-all-1em');
        autocompleteContainer.appendChild(ul);
    }

    let listItems = '';
    result['items'].forEach(item => {
        const searchArtistName = item.name;
        const searchArtistId = item.id;
        const image = item.images;
        let list;
        if (!image.length) {
            list = `<li class="artistItems action" data-artist_id="${searchArtistId}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="l-searchArtistImage artistImage">
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7l388.6 0c3.9 0 7.6-.7 11-2.1l-261-205.6z"/>
                </svg>
                <div class="l-artistInfo">
                    <span class="searchArtistName font-wb">${searchArtistName}</span>
                </div>
            </li>`;
        } else {
            const imageItems = image[1].url;
            list = `<li class="artistItems action" data-artist_id="${searchArtistId}">
                <img class="l-searchArtistImage artistImage" src="${imageItems}" loading="lazy">
                <div class="l-artistInfo">
                    <span class="searchArtistName font-wb">${searchArtistName}</span>
                </div>
            </li>`;
        }
        listItems += list;
    });
    document.querySelector('.autocompleteList').innerHTML = listItems;
}

// クリックされたアーティストのアルバムを表示する
const handleSearchAlbum = (e) => {
    artistName.value = e.target.innerText
    let data = e.target.closest('.artistItems');
    artistName.setAttribute('data-artist_id', data.dataset.artist_id);
    searchAlbum();
}

const searchAlbum = () => {
    let artistName = document.querySelector('#artistName');
    removeElements(['.modalList', '.autocompleteList']);
    let data_artistName = artistName.value;
    if (data_artistName === "") { return; }

    let label = document.querySelectorAll('input[name="typeLabel"]');
    let type = '';
    label.forEach(radio => {
        if (radio.checked === true) {
            type = radio.value;
        }
    });

    let artistId = artistName.dataset.artist_id;
    const params = new URLSearchParams({
        'artistName': data_artistName,
        'type': type,
        'artistId': artistId
    })

    fetch(`./js/ajax/searchSpotify.php?${params}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.text())
        .then(result => {
            const jsonResult = JSON.parse(result);
            console.log(result);
            albumArt(jsonResult);
        })
        .catch(error => {
            console.log(error);
            let modalList = document.querySelector('.modalList');
            if (!modalList) {
                let ul = document.createElement('ul');
                ul.classList.add('modalList');
                document.querySelector('.modal-content').appendChild(ul);
            } else {
                modalList.innerHTML = '';
            }
            let item = `<li>データの取得に失敗しました。再検索してください。</li>`
            append(item);
        });
}

const albumArt = async (result) => {
    let allList = document.querySelectorAll('.albumArtList li');
    let listArray = [];
    allList.forEach(li => listArray.push(li.id));

    let modalList = document.querySelector('.modalList');
    if (!modalList) {
        let ul = document.createElement('ul');
        ul.classList.add('modalList');
        document.querySelector('.modal-content').appendChild(ul);
    } else {
        modalList.innerHTML = '';
    }

    let items = '';
    result['items'].forEach(item => {
        let imageItems = item.images[0].url;
        let albumName = item.name;
        let release = item.release_date.substring(0, 4);
        let albumId = item.id;
        let artistsName = item.artists.map(artist => artist.name).join(", ");
        let isSelected = listArray.includes(albumId);
        let buttonClass = isSelected ? 'bg-orange' : 'bg-turquoise';
        let selectClass = isSelected ? 'selected' : 'select';
        let buttonText = isSelected ? '選択中' : '選択';

        items += `<li class="albumItems" id="${albumId}" data-name="${albumName}" data-artist="${artistsName}">
                <img class="albumImage" src="${imageItems}" loading="lazy">
                <div class="l-albumInfo">
                    <span class="albumName">${albumName} (${release})</span>
                    <span class="artistsName">${artistsName}</span>
                </div>
                <button class="l-button txt-white ${buttonClass} ${selectClass} action">${buttonText}</button>
            </li>`;
    });
    await append(items)
}

const append = (items) => { document.querySelector('.modalList').innerHTML += items; }

const handleAddAlbumArt = (e) => {
    let clickedElement = e.target;
    let parentElement = clickedElement.parentElement;
    let id = parentElement.getAttribute('id');
    let name = parentElement.getAttribute('data-name');
    let artist = parentElement.getAttribute('data-artist');
    let selectAlbum = parentElement.querySelector('img').getAttribute('src');

    clickedElement.textContent = '選択中';
    let classList = ['select', 'selected', 'bg-turquoise', 'bg-orange'];
    toggleClass(e, classList, 0);

    let albumArtList = document.querySelector('.albumArtList');
    let listItem = document.createElement('li');
    listItem.classList.add('albumListItem', 'action');
    listItem.setAttribute('id', id);
    listItem.innerHTML = `<img class="l-albumArt m-bottom-05em" src="${selectAlbum}"><span class="selectName">${name}</span><span>${artist}</span><span class="albumRemove"><span class="icon-close"></span></span>`;
    albumArtList.appendChild(listItem);

    if (document.querySelectorAll('.albumListItem').length === 10) {
        let classList = ['disp-block', 'disp-none'];
        toggleClass('.addButton', classList, 1);
        container.classList.remove('active');
        if (!document.querySelector('.resetWrapper')) {
            let resetArea = document.querySelector('.resetArea');
            let resetWrapper = document.createElement('div');
            resetWrapper.classList.add('ta-center', 'resetWrapper');
            resetWrapper.innerHTML = `<button class="l-button action m-right-1em txt-white bg-turquoise reset action">
                        <img src="../images/rotate.png" alt="resetIcon">
                    </button>
                    <button class="l-button txt-white bg-turquoise capture action">
                        <img src="../images/camera.png" alt="cameraIcon">
                    </button>`;
            resetArea.appendChild(resetWrapper);
            document.querySelector('.modal-container').classList.remove('active');
        }
    }
}

const handleAlbumRemove = (e) => {
    const removeButton = e.target.closest('.albumRemove');
    const parentItem = removeButton.parentElement;
    parentItem.remove();
    const albumCount = document.querySelectorAll('.albumListItem').length;
    if (albumCount === 9) {
        addButton.classList.remove('disp-none');
        addButton.classList.add('disp-block');
    }
}

const handleSelected = (e) => {
    const selectedButton = e.target.closest('.selected');
    const parentElement = selectedButton.parentElement;
    selectedButton.textContent = '選択';

    let classList = ['select', 'selected', 'bg-turquoise', 'bg-orange'];
    toggleClass(e, classList, 0);

    let id = parentElement.id;
    let itemToRemove = document.getElementById(id);
    if (itemToRemove) { itemToRemove.remove(); }
}

const handleReset = () => {
    const albumArtList = document.querySelector('.albumArtList');
    if (albumArtList) { albumArtList.innerHTML = ''; }
    const addButton = document.querySelector('.addButton');
    if (addButton.classList.contains('disp-none')) {
        let classList = ['disp-block', 'disp-none'];
        toggleClass('.addButton', classList, 1);
    }
    const resetWrapper = document.querySelector('.resetWrapper');
    if (resetWrapper) {
        resetWrapper.remove();
    }
}

const handleCapture = () => {
    html2canvas(document.querySelector('.l-contentWrapper'), {
        useCORS: true
    }).then(canvas => {
        var dataURL = canvas.toDataURL("image/png");
        const blob = toBlob(dataURL);
        const imageFile = new File([blob], "image.png", {
            type: "image/png",
        });
        navigator.share({
            text: "共有",
            files: [imageFile],
        }).then(() => {
            console.log("success.");
        }).catch((error) => {
            console.log(error);
        });
    });
}

const toBlob = (base64) => {
    const decodedData = atob(base64.replace(/^.*,/, ""));
    const buffers = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
        buffers[i] = decodedData.charCodeAt(i);
    }
    try {
        const blob = new Blob([buffers.buffer], {
            type: "image/png",
        });
        return blob;
    } catch (e) {
        return null;
    }
}

const toggleClass = (toggleTarget, classList, mode) => {
    let toggleElement;
    if (mode === 1) {
        toggleElement = document.querySelector(`${toggleTarget}`);
    } else {
        toggleElement = toggleTarget.target;
    }
    if (toggleElement) {
        classList.map((value) => {
            toggleElement.classList.toggle(`${value}`);
        })
    }
}

const removeElements = (selectors) => {
    selectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.remove();
    });
};

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func(...args);
        }, delay);
    };
};

const debouncedSearchArtist = debounce(searchArtist, 500);
artistName.addEventListener('input', debouncedSearchArtist);

let listener = document.querySelectorAll('input[name="typeLabel"]');
listener.forEach(radio => {
    radio.addEventListener('change', (event) => {
        if (event.target.checked) {
            searchAlbum();
        }
    });
});

document.addEventListener('click', function (e) {
    let target = e.target;
    switch (true) {
        case target.classList.contains('startButton'):
            onStart();
            break;
        case target.classList.contains('modal-close'):
            onClose();
            break;
        case target.classList.contains('addButton'):
            onOpen();
            break;
        case target.classList.contains('clear'):
            onClear();
            break;
        case target.classList.contains('search'):
            searchAlbum();
            break;
        case target.classList.contains('select'):
            handleAddAlbumArt(e);
            break;
        case target.classList.contains('selected'):
            handleSelected(e);
            break;
        case target.classList.contains('albumRemove'):
            handleAlbumRemove(e);
            break;
        case target.classList.contains('reset'):
            handleReset();
            break;
        case target.classList.contains('capture'):
            handleCapture(e);
            break;
    }

    let artistItem = e.target.closest('.artistItems');
    if (artistItem) {
        handleSearchAlbum(e);
    }
});