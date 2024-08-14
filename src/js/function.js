$(function () {
    var addButton = $('.addButton');
    var close = $('.modal-close');
    var container = $('.modal-container');
    var artistName = $('#artistName');
    var modalList = $('.modalList');
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
    const time = 1000;
    // 検索候補
    artistName.on('input', function () {
        $('.autocompleteList').remove();
        let data_artistName = artistName.val();
        clearTimeout(timer);
        timer = setTimeout(() => {
            $.ajax({
                url: "./js/ajax/searchArtists.php",
                cache: false,
                async: false,
                type: "GET",
                dataType: "json",
                data: {
                    artistName: data_artistName,
                }
            }).done(function (result) {
                modalList.remove();
                artistAutocomplete(result);
            }).fail(function () {
                $('.autocompleteList').append('<li class="artistItems">アーティストが見つかりませんでした</li>');
            });
        }, time);
    });
    function artistAutocomplete(result) {
        let resultItemCount = Object.keys(result['items']).length;
        let imageItems;
        if ($('.autocompleteList').val() == "") {
            $('.autocompleteList').remove();
            modalList.remove();
        } else {
            $('.l-autocomplete').append('<ul class="autocompleteList padding-all-1em"></ul>');
        }
        for (let i = 0; i <= resultItemCount - 1;) {
            let searchArtistName = result['items'][i]['name'];
            let searchArtistId = result['items'][i]['id'];
            if (!result['items'][i]['images'].length) {
                $('.autocompleteList').append('<li class="artistItems" data-artist_id="' + searchArtistId + '"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="l-searchArtistImage artistImage"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L353.3 251.6C407.9 237 448 187.2 448 128C448 57.3 390.7 0 320 0C250.2 0 193.5 55.8 192 125.2L38.8 5.1zM264.3 304.3C170.5 309.4 96 387.2 96 482.3c0 16.4 13.3 29.7 29.7 29.7l388.6 0c3.9 0 7.6-.7 11-2.1l-261-205.6z"/></svg><div class="l-artistInfo"><span class="searchArtistName font-wb">' + searchArtistName + '</span></div></li>');
            } else {
                imageItems = result['items'][i]['images'][1]['url'];
                $('.autocompleteList').append('<li class="artistItems" data-artist_id="' + searchArtistId + '"><image class="l-searchArtistImage artistImage" src="' + imageItems + '"><div class="l-artistInfo"><span class="searchArtistName font-wb">' + searchArtistName + '</span></div></li>');
            }
            i++;
        }
    }
    $(document).on("click", ".artistItems", function () {
        artistName.val($(this).text());
        artistName.attr('data-artist_id', $(this).attr('data-artist_id'));
        $('.autocompleteList').remove();
        $('.search').trigger('click');
    });

    // 検索
    $('.search').on('click', function () {
        $('.autocompleteList').remove();
        $('.modalList').remove();
        $('.modalList').children().remove();
        let search_artistName = artistName.val();
        let type = $('[name=typeLabel]').val();
        let artistId = artistName.attr('data-artist_id');
        $.ajax({
            url: "./js/ajax/searchSpotify.php",
            cache: false,
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                artistName: search_artistName,
                type: type,
                artistId: artistId
            }
        }).done(function (result) {
            $('modalList').remove();
            $('searchForm').addClass('m-bottom-2em');
            albumArt(result);
        }).fail(function () {
            $('.modalList').append('<li class="albumItems">データの取得に失敗しました</li>');
        });
    });

    function albumArt(result) {
        let resultItemCount = Object.keys(result['items']).length;
        let allList = $('.albumArtList').find('li');
        var listArray = [];
        allList.each(function () {
            listArray.push($(this).attr('id'));
        })

        if (!$('.modal-content').hasClass('modalList')) {
            $('.modal-content').append('<ul class="modalList"></ul >');
        }
        for (let i = 0; i <= resultItemCount - 1;) {
            let artistsName = new Array();
            let tempArtistsName = new Array();

            let imageItems = result['items'][i]['images'][1]['url'];
            let albumName = result['items'][i]['name'];
            let release = result['items'][i]['release_date'].substring(0, 4);
            let albumId = result['items'][i]['id'];

            tempArtistsName = result['items'][i]['artists'];
            tempArtistsName.forEach(value => {
                artistsName.push(value.name);
            });
            if ($.inArray(albumId, listArray) != -1) {
                $('.modalList').append('<li class="albumItems" id="' + albumId + '" data-name="' + albumName + '" data-artist="' + artistsName.toString() + '"><image class="albumImage" src="' + imageItems + '"><div class="l-albumInfo"><span class="albumName">' + albumName + '(' + release + ')' + '</span><span class="artistsName">' + artistsName.toString() + '</span></div><button class="l-button txt-white bg-orange select" disabled>選択中</button></li>');
            } else {
                $('.modalList').append('<li class="albumItems" id="' + albumId + '" data-name="' + albumName + '" data-artist="' + artistsName.toString() + '"><image class="albumImage" src="' + imageItems + '"><div class="l-albumInfo"><span class="albumName">' + albumName + '(' + release + ')' + '</span><span class="artistsName">' + artistsName.toString() + '</span></div><button class="l-button txt-white bg-turquoise select">選択</button></li>');
            }
            i++;
        }
    }

    $(document).on("click", ".select", function () {
        count--;
        $('#choiceCounter').text(count);
        let id = $(this).parent().attr('id');
        let name = $(this).parent().attr('data-name');
        let artist = $(this).parent().attr('data-artist');
        let selectAlbum = $(this).closest('li').children('img').attr('src');

        $(this).text('選択中');
        $(this).addClass('selected');
        $(this).removeClass('select');
        $(this).removeClass('bg-turquoise');
        $(this).addClass('bg-orange');
        $('.albumArtList').append('<li class="albumListItem" id="' + id + '"><image class="l-albumArt m-bottom-05em" src="' + selectAlbum + '"><span class="selectName">' + name + '</span><span>' + artist + '</span></li>');

        if ($('.albumListItem').length === 10) {
            addButton.removeClass('disp-block');
            addButton.addClass('disp-none');
            container.removeClass('active');
            if (!$('.resetWrapper').length == 1) {
                $('.resetArea').append('<div class="ta-center resetWrapper"><button class="l-button m-right-1em txt-white bg-turquoise reset"><i class="fa-solid fa-rotate-right"></i></button><button class="l-button txt-white bg-turquoise capture"><i class="fa-solid fa-camera"></i></button></div>');
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
        count++;
        $('#choiceCounter').text(count);
        $(this).parent().remove();
        if ($('.albumListItem').length < 10) {
            addButton.removeClass('disp-none');
            addButton.addClass('disp-block');
            reset.removeClass('disp-none');
        }
    })

    $(document).on("click", ".selected", function () {
        count++;
        $('#choiceCounter').text(count);
        $(this).text('選択');
        $(this).addClass('select');
        $(this).addClass('bg-turquoise');
        $(this).removeClass('selected');
        $(this).removeClass('bg-orange');
        let id = $(this).parent().attr('id');
        $('#' + id).remove();
    })

    $(document).on("click", ".reset", function () {
        count = 10;
        $('#choiceCounter').text('10');
        $('.albumArtList').children().remove();
        addButton.removeClass('disp-none');
        addButton.addClass('disp-block');
        $('.resetWrapper').remove();
    })


    $(document).on("click", ".capture", function () {
        html2canvas(document.querySelector('.l-contentWrapper'), {
            logging: true,
            letterRendering: 1,
            useCORS: true
        }).then(canvas => {
            var dataURL = canvas.toDataURL();
            var link = document.createElement("a");
            link.href = dataURL;
            link.download = "download.png";
            link.click();
        });
    });

});