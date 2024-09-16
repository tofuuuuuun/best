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
    const startText = document.querySelector('.startText');
    const l_albumList = document.querySelector('.l-albumList');

    startText.classList.toggle('fadeIn');
    startText.classList.toggle('fadeOut');
    startText.classList.toggle('disp-none');
    startText.classList.toggle('disp-block');
    l_albumList.classList.toggle('disp-none');
    l_albumList.classList.toggle('disp-block');
}
startButton.addEventListener('click', onStart);

const onOpen = () => {
    container.classList.add('active');
    let modalList = document.querySelector('.modalList');
    if (modalList) modalList.remove();
    if (autocompleteList) autocompleteList.remove();
    artistName.value = '';
    artistName.setAttribute('data-artist_id', '');
}
addButton.addEventListener('click', onOpen);

const onClose = () => { container.classList.remove('active'); }
closeButton.addEventListener('click', onClose);

const onClear = () => {
    artistName.value = '';
    artistName.setAttribute('data-artist_id', '');
    let autocompleteList = document.querySelector('.autocompleteList');
    if (autocompleteList) autocompleteList.remove();
}
document.querySelector('.clear').addEventListener('click', onClear);

// アーティストの検索候補を表示する
const searchArtist = () => {
    let data_artistName = artistName.value;
    if (autocompleteList) autocompleteList.remove();
    const params = new URLSearchParams({
        'artistName': data_artistName
    })

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
            console.error('Error:' + error);
            let errorMessage = `<li class="artistItems">アーティストが見つかりませんでした</li>`;
            document.querySelector('.autocompleteList').innerHTML = errorMessage;
        });
}
const artistAutocomplete = (result) => {
    const autocompleteList = document.querySelector('.autocompleteList');
    const modalList = document.querySelector('.modalList');
    const autocompleteContainer = document.querySelector('.l-autocomplete');

    if (document.querySelector('.autocompleteList') && document.querySelector('.autocompleteList').value === "") {
        if (autocompleteList) autocompleteList.remove();
        if (modalList) modalList.remove();
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
artistName.addEventListener('input', searchArtist);

// クリックされたアーティストのアルバムを表示する
const handleSearchAlbum = (e) => {
    console.log(e);
    // アーティストＩＤが押されたときのイベントを取らないといけない
    artistName.value = e.target.innerText
    artistName.setAttribute('data-artist_id', e.target.dataset.artist_id);
    // if (autocompleteList) autocompleteList.remove();
    searchAlbum();
}

const searchAlbum = () => {
    let artistName = document.querySelector('#artistName');
    let autocompleteList = document.querySelector('.autocompleteList');
    if (autocompleteList) autocompleteList.remove();
    if (modalList) modalList.remove();
    let data_artistName = artistName.value;
    let type = document.querySelector('#type').typeLabel.value;
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
            albumArt(jsonResult);
        })
        .catch(error => {
            console.error('Error' + error);
            let errorMessage = `<li class="artistItems">アーティストが見つかりませんでした</li>`;
            document.querySelector('.modalList').innerHTML += errorMessage;
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
        let imageItems = item.images[1].url;
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
    // 
    await append(items)
}

function append(items) {
    let modalList = document.querySelector('.modalList');
    // if (modalList) modalList.parentNode.removeChild(modalList.firstChild);
    document.querySelector('.modalList').innerHTML += items;
}
search.addEventListener('click', searchAlbum);

const handleAddAlbumArt = (e) => {
    let clickedElement = e.target;
    let parentElement = clickedElement.parentElement;
    let id = parentElement.getAttribute('id');
    let name = parentElement.getAttribute('data-name');
    let artist = parentElement.getAttribute('data-artist');
    let selectAlbum = parentElement.querySelector('img').getAttribute('src');

    clickedElement.textContent = '選択中';
    clickedElement.classList.toggle('select');
    clickedElement.classList.toggle('selected');
    clickedElement.classList.toggle('bg-turquoise');
    clickedElement.classList.toggle('bg-orange');

    let albumArtList = document.querySelector('.albumArtList');
    let listItem = document.createElement('li');
    listItem.classList.add('albumListItem', 'action');
    listItem.setAttribute('id', id);
    listItem.innerHTML = `<img class="l-albumArt m-bottom-05em" src="${selectAlbum}"><span class="selectName">${name}</span><span>${artist}</span>`;
    albumArtList.appendChild(listItem);

    if (document.querySelectorAll('.albumListItem').length === 10) {
        let addButton = document.querySelector('.addButton');
        addButton.classList.toggle('disp-block');
        addButton.classList.toggle('disp-none');
        container.classList.remove('active');

        if (!document.querySelector('.resetWrapper')) {
            let resetArea = document.querySelector('.resetArea');
            let resetWrapper = document.createElement('div');
            resetWrapper.classList.add('ta-center', 'resetWrapper');
            resetWrapper.innerHTML = `<button class="l-button action m-right-1em txt-white bg-turquoise reset action">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <button class="l-button txt-white bg-turquoise capture action">
                        <i class="fa-solid fa-camera"></i>
                    </button>`;
            resetArea.appendChild(resetWrapper);
            document.querySelector('.modal-container').classList.remove('active');
        }
    }
}

document.addEventListener('mouseenter', function (e) {
    if (e.target.contains('.albumListItem')) {
        const albumListItem = e.target.closest('.albumListItem');
        const span = document.createElement('span');
        span.classList.add('albumRemove');
        span.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        albumListItem.appendChild(span);
    }
});

document.addEventListener('mouseleave', function (e) {
    if (e.target.contains('.albumListItem')) {
        const albumListItem = e.target.closest('.albumListItem');
        const albumRemove = albumListItem.querySelector('.albumRemove');
        if (albumRemove) {
            albumListItem.removeChild(albumRemove);
        }
    }
});

const handleAlbumRemove = (e) => {
    const removeButton = e.target.closest('.albumRemove');
    const parentItem = removeButton.parentElement;
    parentItem.remove();
    const albumCount = document.querySelectorAll('.albumListItem').length;

    if (albumCount === 9) {
        addButton.classList.remove('disp-none');
        addButton.classList.add('disp-block');
    }
    reset.classList.remove('disp-none');
}

const handleSelected = (e) => {
    const selectedButton = e.target.closest('.selected');
    const parentElement = selectedButton.parentElement;
    selectedButton.textContent = '選択';
    selectedButton.classList.toggle('select');
    selectedButton.classList.toggle('selected');
    selectedButton.classList.toggle('bg-turquoise');
    selectedButton.classList.toggle('bg-orange');
    let id = parentElement.id;
    let itemToRemove = document.getElementById(id);
    if (itemToRemove) {
        itemToRemove.remove();
    }
}

const handleReset = () => {
    const albumArtList = document.querySelector('.albumArtList');
    if (albumArtList) {
        albumArtList.innerHTML = '';
    }
    const addButton = document.querySelector('.addButton');
    if (addButton.classList.contains('disp-none')) {
        addButton.classList.toggle('disp-none');
        addButton.classList.toggle('disp-block');
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

document.addEventListener('click', function (e) {
    if (e.target.closest('.artistItems')) {
        handleSearchAlbum(e);
    } else if (e.target.closest('.select')) {
        handleAddAlbumArt(e);
    } else if (e.target.closest('.selected')) {
        handleSelected(e);
    } else if (e.target.closest('.albumRemove')) {
        handleAlbumRemove(e);
    } else if (e.target.closest('.reset')) {
        handleReset();
    } else if (e.target.closest('.capture')) {
        handleCapture(e);
    }
});
