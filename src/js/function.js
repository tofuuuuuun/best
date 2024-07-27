$(function () {
    var open = $('.addButton'),
        close = $('.modal-close'),
        container = $('.modal-container');
    open.on('click', function () {
        container.addClass('active');
        $('.modalList').remove();
        $('.autocompleteList').remove();
        $('#artistName').val('');
        return false;
    });
    close.on('click', function () {
        container.removeClass('active');
    });

    // 検索候補
    $('#artistName').on('input', function () {
        $('.autocompleteList').remove();
        $('.l-autocomplete').append('<ul class="autocompleteList padding-all-1em"></ul >');

        let artistName;
        artistName = $('#artistName').val();

        $.ajax({
            url: "./js/ajax/searchArtists.php",
            cache: false,
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                artistName: artistName,
            }
        }).done(function (result) {
            $('.modalList').remove();
            artistAutocomplete(result)
        }).fail(function () {
        });
    });

    function artistAutocomplete(result) {
        let resultItemCount;
        resultItemCount = Object.keys(result['items']).length;
        var imageItems;

        for (let i = 0; i <= resultItemCount - 1;) {
            imageItems = result['items'][i]['images'][1]['url'];
            searchArtistName = result['items'][i]['name'];
            searchArtistId = result['items'][i]['id'];
            $('.autocompleteList')
                .append('<li class="artistItems" data-artist_id="' + searchArtistId + '"><image class="l-searchArtistImage artistImage" src="' + imageItems + '"><div class="l-artistInfo"><span class="searchArtistName font-wb">' + searchArtistName + '</span></div></li>');
            i++;
        }
    }

    $(document).on("click", ".artistItems", function () {
        $('#artistName').val($(this).text());
        $('#artistName').attr('data-artist_id', $(this).data('artist_id'));
        $('.autocompleteList').remove();
    });


    $('.search').on('click', function () {
        $('.autocompleteList').remove();
        $('.modalList').children().remove();

        let artistName;
        let type;
        let artistId;

        artistId = $('#artistName').data('artist_id');
        artistName = $('#artistName').val();
        type = $('input:radio[name="type"]:checked').val();
        $.ajax({
            url: "./js/ajax/searchSpotify.php",
            cache: false,
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                artistName: artistName,
                type: type,
                artistId: artistId
            }
        }).done(function (result) {
            $('.modalList').remove();
            $('searchForm').addClass('m-bottom-2em');
            albumArt(result);
        }).fail(function () {
        });
    });

    function albumArt(result) {
        let resultItemCount;
        resultItemCount = Object.keys(result['items']).length;
        var imageItems;
        var albumName;
        var release;

        if ($('.modal-content').hasClass('modalList')) {

        } else {
            $('.modal-content')
                .append('<ul class="modalList"></ul >');
        }
        for (let i = 0; i <= resultItemCount - 1;) {
            imageItems = result['items'][i]['images'][1]['url'];
            albumName = result['items'][i]['name'];
            release = result['items'][i]['release_date'].substring(0, 4);

            var artistsName = new Array();
            var tempArtistsName = new Array();
            tempArtistsName = result['items'][i]['artists'];
            tempArtistsName.forEach(value => {
                artistsName.push(value.name);
            });

            $('.modalList')
                .append('<li class="albumItems"><image class="albumImage" src="' + imageItems + '"><div class="l-albumInfo"><span class="albumName">' + albumName + '(' + release + ')' + '</span><span class="artistsName">' + artistsName.toString() + '</span></div><button class="l-button txt-white bg-turquoise select">選択</button></li>');
            i++;
        }
    }

    let albumCounter = 0;
    let albumFlg = false;
    $(document).on("click", ".select", function () {
        if (albumCounter <= 10) {
            let selectAlbum;
            selectAlbum = $(this).closest('li').children('img').attr('src');
            $('.albumArtList').append('<li class="albumListItem"><image class="l-albumArt" src="' + selectAlbum + '"></li>');
            albumCounter++;
        }

        if (albumCounter == 10) {
            $('.addButton').removeClass('disp-block');
            $('.addButton').addClass('disp-none');
            $('.l-albumList')
                .append('<div class="ta-center"><button class="l-button txt-white bg-turquoise reset"><i class="fa-solid fa-rotate-right"></i></button></div>');
            $('.modal-container').removeClass('active');
        }
        albumFlg = true;
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
    })

    $(document).on("click", ".reset", function () {
        albumCounter = 0;
        $('.albumArtList').children().remove();
        $('.addButton').removeClass('disp-none');
        $('.addButton').addClass('disp-block');
        $('.reset').remove();
    })
});