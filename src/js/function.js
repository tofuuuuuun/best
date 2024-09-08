$(function () {
    $(document).on("click", ".startButton", function () {
        $('.startText').toggleClass('fadeIn fadeOut');
        setTimeout(() => {
            $('.startText').toggleClass('disp-block disp-none');
            $('.l-albumList').toggleClass('disp-none disp-block');
        }, 1000);
    });

    var addButton = $('.addButton');
    var close = $('.modal-close');
    var container = $('.modal-container');
    var artistName = $('#artistName');
    var reset = $('.reset');
    var count = 10;

    // モーダルオープン
    addButton.on('click', function () {
        container.addClass('active');
        $('.modalList').remove();
        $('.autocompleteList').remove();
        artistName.val('');
        artistName.attr('data-artist_id', '');
        $('#choiceCounter').text(count);
        return false;
    });
    close.on('click', function () {
        container.removeClass('active');
    });

    let timer;
    const time = 300;
    // 検索候補
    artistName.on('input', function () {
        $('.autocompleteList').remove();
        let data_artistName = artistName.val();
        clearTimeout(timer);
        timer = setTimeout(() => {
            $.ajax({
                url: "./js/ajax/searchArtists.php",
                cache: false,
                type: "GET",
                dataType: "json",
                data: {
                    artistName: data_artistName,
                }
            }).done(function (result) {
                $('.modalList').remove();
                artistAutocomplete(result);
            }).fail(function () {
                $('.autocompleteList').append('<li class="artistItems">アーティストが見つかりませんでした</li>');
            });
        }, time);
    });

    function artistAutocomplete(result) {
        if ($('.autocompleteList').val() === "") {
            $('.autocompleteList').remove();
            $('.modalList').remove();
            return;
        } else if (!$('.autocompleteList').length) {
            $('.l-autocomplete').append('<ul class="autocompleteList padding-all-1em"></ul>');
        }

        let listItems = '';
        result['items'].map(item => {
            let searchArtistName = item.name;
            let searchArtistId = item.id;
            let image = item.images;
            let list;
            if (!image.length) {
                list = `
                <li class="artistItems action" data-artist_id="${searchArtistId}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="l-searchArtistImage artistImage"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7l388.6 0c3.9 0 7.6-.7 11-2.1l-261-205.6z"/></svg><div class="l-artistInfo"><span class="searchArtistName font-wb">${searchArtistName}</span></div></li>`;
            } else {
                let imageItems = image[1].url;
                list = `<li class="artistItems action" data-artist_id="${searchArtistId}"><image class="l-searchArtistImage artistImage" src="${imageItems}"><div class="l-artistInfo"><span class="searchArtistName font-wb">${searchArtistName}</span></div></li>`;
            }
            listItems += list;
        });
        $('.autocompleteList').append(listItems);
    }

    $(document).on("click", ".artistItems", function () {
        const $this = $(this);
        artistName.val($this.text());
        artistName.attr('data-artist_id', $this.attr('data-artist_id'));
        $('.autocompleteList').remove();
        $('.search').trigger('click');
    });

    // 検索
    $('.search').on('click', function () {
        $('.autocompleteList').remove();
        $('.modalList').remove();
        $('.modalList').children().remove();
        let search_artistName = artistName.val();
        let type = $('[name=typeLabel]:checked').val();
        let artistId = artistName.attr('data-artist_id');
        $.ajax({
            url: "./js/ajax/searchSpotify.php",
            cache: false,
            type: "GET",
            dataType: "json",
            data: {
                artistName: search_artistName,
                type: type,
                artistId: artistId
            }
        }).done(function (result) {
            console.log(result);
            $('modalList').remove();
            $('searchForm').addClass('m-bottom-2em');
            albumArt(result);
        }).fail(function () {
            $('.modalList').append('<li class="albumItems">データの取得に失敗しました</li>');
        });
    });
    $('[name=typeLabel]').on('click', function () { $('.search').trigger('click'); });
    $('.clear').on('click', function () {
        artistName.val('');
        artistName.attr('data-artist_id', '');
    })

    function albumArt(result) {
        let allList = $('.albumArtList').find('li');
        var listArray = [];
        allList.each(function () { listArray.push($(this).attr('id')); })

        if (!$('.modal-content').hasClass('modalList')) {
            $('.modal-content').append('<ul class="modalList"></ul >');
        }
        let items = '';
        result['items'].map(item => {
            let imageItems = item.images[1].url;
            let albumName = item.name;
            let release = item.release_date.substring(0, 4);
            let albumId = item.id;
            let artistsName = item.artists.map(artist => artist.name).join(", ");

            // albumIdがlistArrayに含まれているかチェック
            let isSelected = listArray.includes(albumId);
            let buttonClass = isSelected ? 'bg-orange' : 'bg-turquoise';
            let selectClass = isSelected ? 'selected' : 'select';
            let buttonText = isSelected ? '選択中' : '選択';

            items += `
                <li class="albumItems" id="${albumId}" data-name="${albumName}" data-artist="${artistsName}">
                    <img class="albumImage" src="${imageItems}">
                        <div class="l-albumInfo">
                            <span class="albumName">${albumName} (${release})</span>
                            <span class="artistsName">${artistsName}</span>
                        </div>
                        <button class="l-button txt-white ${buttonClass} ${selectClass} action">${buttonText}</button>
                    </li>`;
        });
        $('.modalList').append(items);
    }

    $(document).on("click", ".select", function () {
        count--;
        $('#choiceCounter').text(count);

        let $parent = $(this).parent();
        let id = $parent.attr('id');
        let name = $parent.attr('data-name');
        let artist = $parent.attr('data-artist');
        let selectAlbum = $parent.find('img').attr('src');
        let $this = $(this);

        $this.text('選択中');
        $this.toggleClass('select selected');
        $this.toggleClass('bg-turquoise bg-orange');

        $('.albumArtList').append(`
            <li class="albumListItem action" id="${id}">
            <image class="l-albumArt m-bottom-05em" src="${selectAlbum}">
            <span class="selectName">${name}</span><span>${artist}</span>
            </li>`
        );

        if ($('.albumListItem').length === 10) {
            addButton.toggleClass('disp-block disp-none');
            container.removeClass('active');
            if (!$('.resetWrapper').length == 1) {
                $('.resetArea').append(`
                    <div class="ta-center resetWrapper">
                        <button class="l-button action m-right-1em txt-white bg-turquoise reset action">
                            <i class="fa-solid fa-rotate-right"></i>
                        </button>
                        <button class="l-button txt-white bg-turquoise capture action">
                            <i class="fa-solid fa-camera"></i>
                        </button>
                    </div>`);
                $('.modal-container').removeClass('active');
            }
        }
    });

    $(document).on({
        'mouseenter': function () {
            $(this).append('<span class="albumRemove"><i class="fa-solid fa-xmark"></i></span>');
        },
        'mouseleave': function () {
            $(this).find('.albumRemove').remove();
        }
    }, '.albumListItem');

    $(document).on("click", ".albumRemove", function () {
        $(this).parent().remove();
        const albumCount = $('.albumListItem').length;
        if ($('.albumListItem').length < 10) {
            addButton.toggleClass('disp-block disp-none', albumCount === 9);
        }
        count++;
        $('#choiceCounter').text(count);
        reset.removeClass('disp-none');
    })

    $(document).on("click", ".selected", function () {
        const $this = $(this);
        count++;
        $('#choiceCounter').text(count);
        $this.text('選択');
        $this.toggleClass('select selected');
        $this.toggleClass('bg-turquoise bg-orange');
        let id = $this.parent().attr('id');
        $('#' + id).remove();
    })

    $(document).on("click", ".reset", function () {
        count = 10;
        $('#choiceCounter').text('10');
        $('.albumArtList').empty();
        if (addButton.hasClass('disp-none')) {
            addButton.toggleClass('disp-none disp-block');
        }
        $('.resetWrapper').remove();
    })

    $(document).on("click", ".capture", function () {
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
    });
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
    };
});