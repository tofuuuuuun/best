$(function () {
    var addButton = $('.addButton');
    var close = $('.modal-close');
    var container = $('.modal-container');
    var artistName = $('#artistName');
    var modalList = $('.modalList');
    var autocompleteList = $('.autocompleteList');
    var reset = $('.reset');

    addButton.on('click', function () {
        container.addClass('active');
        $('.modalList').remove();
        autocompleteList.remove();
        artistName.val('');
        artistName.attr('data-artist_id', '');
        return false;
    });
    close.on('click', function () {
        container.removeClass('active');
    });

    artistName.on('input', function () {
        $('.autocompleteList').remove();
        if ($('.autocompleteList').val() == "") {
            $('.autocompleteList').remove();
            modalList.remove();
        } else {
            $('.l-autocomplete').append('<ul class="autocompleteList padding-all-1em"></ul>');
        }
        let data_artistName = artistName.val();
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
            $('.autocompleteList').append('<li class="artistItems">データの取得に失敗しました</li>');
        });
    });

    function artistAutocomplete(result) {
        let resultItemCount = Object.keys(result['items']).length;
        let imageItems;
        for (let i = 0; i <= resultItemCount - 1;) {
            imageItems = result['items'][i]['images'][1]['url'];
            searchArtistName = result['items'][i]['name'];
            searchArtistId = result['items'][i]['id'];
            $('.autocompleteList').append('<li class="artistItems" data-artist_id="' + searchArtistId + '"><image class="l-searchArtistImage artistImage" src="' + imageItems + '"><div class="l-artistInfo"><span class="searchArtistName font-wb">' + searchArtistName + '</span></div></li>');
            i++;
        }
    }

    $(document).on("click", ".artistItems", function () {
        artistName.val($(this).text());
        let temp = document.getElementById("artistName")
        artistName.attr('data-artist_id', $(this).attr('data-artist_id'));
        $('.autocompleteList').remove();
        $('.search').trigger('click');
    });

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
        let imageItems;
        let albumName;
        let release;
        if (!$('.modal-content').hasClass('modalList')) {
            $('.modal-content').append('<ul class="modalList"></ul >');
        }
        for (let i = 0; i <= resultItemCount - 1;) {
            let artistsName = new Array();
            let tempArtistsName = new Array();

            imageItems = result['items'][i]['images'][1]['url'];
            albumName = result['items'][i]['name'];
            release = result['items'][i]['release_date'].substring(0, 4);

            tempArtistsName = result['items'][i]['artists'];
            tempArtistsName.forEach(value => {
                artistsName.push(value.name);
            });
            $('.modalList').append('<li class="albumItems"><image class="albumImage" src="' + imageItems + '"><div class="l-albumInfo"><span class="albumName">' + albumName + '(' + release + ')' + '</span><span class="artistsName">' + artistsName.toString() + '</span></div><button class="l-button txt-white bg-turquoise select">選択</button></li>');
            i++;
        }
    }

    let albumCounter = 0;
    $(document).on("click", ".select", function () {
        albumCounter++;
        if (albumCounter == 10) {
            addButton.removeClass('disp-block');
            addButton.addClass('disp-none');
            $('.l-albumList').append('<div class="ta-center"><button class="l-button txt-white bg-turquoise reset"><i class="fa-solid fa-rotate-right"></i></button></div>');
            $('.modal-container').removeClass('active');
        }
        if (albumCounter <= 10) {
            let selectAlbum;
            selectAlbum = $(this).closest('li').children('img').attr('src');
            $('.albumArtList').append('<li class="albumListItem"><image class="l-albumArt" src="' + selectAlbum + '"></li>');
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
        albumCounter--;
        if (albumCounter <= 10) {
            addButton.removeClass('disp-none');
            addButton.addClass('disp-block');
            reset.removeClass('disp-none');
        }
    })

    $(document).on("click", ".reset", function () {
        albumCounter = 0;
        $('.albumArtList').children().remove();
        addButton.removeClass('disp-none');
        addButton.addClass('disp-block');
        $('.reset').remove();
    })
});