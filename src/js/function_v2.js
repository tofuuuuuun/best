const startButton = document.querySelector('.startButton');
const addButton = document.querySelector('.addButton');
const closeButton = document.querySelector('.modal-close');
const container = document.querySelector('.modal-container');
const artistName = document.querySelector('#artistName');
const reset = document.querySelector('.reset');
const autocompleteList = document.querySelector('.autocompleteList');
const modalList = document.querySelector('.modalList');
const search = document.querySelector('.search');
const count = 10;

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
    if (autocompleteList) autocompleteList.remove();
    if (modalList) modalList.remove();
    artistName.textContent = '';
    artistName.setAttribute('data-artist_id', '');
}
addButton.addEventListener('click', onOpen);


const onClose = () => { container.classList.remove('active'); }
closeButton.addEventListener('click', onClose);


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
        .then(response => response.json())
        .then(result => {
            if (modalList) modalList.remove();
            artistAutocomplete(result);
        })
        .catch(error => {
            console.error('Error:', error);
            let autocompleteList = document.querySelector('.autocompleteList')
            autocompleteList.append('<li class="artistItems">アーティストが見つかりませんでした</li>');
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
            list = `
            <li class="artistItems action" data-artist_id="${searchArtistId}">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="l-searchArtistImage artistImage">
                    <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7l388.6 0c3.9 0 7.6-.7 11-2.1l-261-205.6z"/>
                </svg>
                <div class="l-artistInfo">
                    <span class="searchArtistName font-wb">${searchArtistName}</span>
                </div>
            </li>`;
        } else {
            const imageItems = image[1].url;
            list = `
            <li class="artistItems action" data-artist_id="${searchArtistId}">
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


document.querySelector('.l-autocomplete').addEventListener('click', function (e) {
    if (e.target.classList.contains('artistItems')) {
        console.log(e);
        // アーティストＩＤが押されたときのイベントを取らないといけない
        artistName.value = e.target.innerText
        artistName.setAttribute('data-artist_id', e.target.dataset.artist_id);
        if (autocompleteList) autocompleteList.remove();
        searchAlbum();
    }

});

const searchAlbum = () => {
    let artistName = document.querySelector('#artistName');

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
        .then(response => response.json())
        .then(result => {
            document.querySelector('.l-autocomplete').remove();
            // document.querySelector('.searchForm').classList.add('m-bottom-2em');
            albumArt(result);
        })
        .catch(error => {
            console.log('Error');
            // let autocompleteList = document.querySelector('.autocompleteList')
            // autocompleteList.append('<li class="artistItems">アーティストが見つかりませんでした</li>');
        });
}

const albumArt = async (result) => {
    // 全てのli要素を取得
    let allList = document.querySelectorAll('.albumArtList li');
    let listArray = [];

    allList.forEach(li => listArray.push(li.id));

    // .modalListが存在しない場合、新しく作成して追加
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

        items += `
            <li class="albumItems" id="${albumId}" data-name="${albumName}" data-artist="${artistsName}">
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
    // let modalList = document.querySelector('.modalList');
    // modalList.parentNod.removeChild;
    document.querySelector('.modalList').innerHTML += items;
}
search.addEventListener('click', searchAlbum);

document.querySelector('.modal-content').addEventListener('click', function (e) {
    if (e.target.classList.contains('select')) {
        // count--;

        // カウンターを更新
        // document.querySelector('#choiceCounter').textContent = count;

        let clickedElement = e.target;
        let parentElement = clickedElement.parentElement;
        let id = parentElement.getAttribute('id');
        let name = parentElement.getAttribute('data-name');
        let artist = parentElement.getAttribute('data-artist');
        let selectAlbum = parentElement.querySelector('img').getAttribute('src');
        // テキスト変更およびクラスの切り替え
        clickedElement.textContent = '選択中';
        clickedElement.classList.toggle('select');
        clickedElement.classList.toggle('selected');
        clickedElement.classList.toggle('bg-turquoise');
        clickedElement.classList.toggle('bg-orange');

        // アルバムリストに追加
        let albumArtList = document.querySelector('.albumArtList');
        let listItem = document.createElement('li');
        listItem.classList.add('albumListItem', 'action');
        listItem.setAttribute('id', id);
        listItem.innerHTML = `<img class="l-albumArt m-bottom-05em" src="${selectAlbum}"><span class="selectName">${name}</span><span>${artist}</span>`;
        albumArtList.appendChild(listItem);

        // アルバムが10個選択されたときの処理
        if (document.querySelectorAll('.albumListItem').length === 10) {
            let addButton = document.querySelector('.addButton');
            addButton.classList.toggle('disp-block');
            addButton.classList.toggle('disp-none');
            container.classList.remove('active');

            if (!document.querySelector('.resetWrapper')) {
                let resetArea = document.querySelector('.resetArea');
                let resetWrapper = document.createElement('div');
                resetWrapper.classList.add('ta-center', 'resetWrapper');
                resetWrapper.innerHTML = `
                    <button class="l-button action m-right-1em txt-white bg-turquoise reset action">
                        <i class="fa-solid fa-rotate-right"></i>
                    </button>
                    <button class="l-button txt-white bg-turquoise capture action">
                        <i class="fa-solid fa-c amera"></i>
                    </button>
                `;
                resetArea.appendChild(resetWrapper);

                document.querySelector('.modal-container').classList.remove('active');
            }
        }
    }
});

document.addEventListener('mouseover', function (e) {
    // .albumListItem要素にホバーしているかを確認
    if (e.target.closest('.albumListItem')) {
        const albumListItem = e.target.closest('.albumListItem');
        const span = document.createElement('span');
        span.classList.add('albumRemove');
        span.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        albumListItem.appendChild(span);
    }
});

document.addEventListener('mouseout', function (e) {
    // .albumListItem要素からマウスが離れた時
    if (e.target.closest('.albumListItem')) {
        const albumListItem = e.target.closest('.albumListItem');
        const albumRemove = albumListItem.querySelector('.albumRemove');
        if (albumRemove) {
            albumListItem.removeChild(albumRemove);
        }
    }
});
