$(function () {
    var open = $('.addButton'),
        close = $('.modal-close'),
        container = $('.modal-container');
    open.on('click', function () {
        container.addClass('active');
        $('.modalList').remove();
        $('#artistName').val('');
        return false;
    });
    close.on('click', function () {
        container.removeClass('active');
    });

    $('.search').on('click', function () {
        $('.modalList').children().remove();
        let artistName;
        artistName = $('#artistName').val();
        $.ajax({
            url: "./js/ajax/searchSpotify.php",
            cache: false,
            async: false,
            type: "GET",
            dataType: "json",
            data: {
                artistName: artistName
            }
        }).done(function (result) {
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
        if ($('.modal-content').hasClass('modalList')) {

        } else {
            $('.modal-content')
                .append('<ul class="modalList"></ul >');
        }
        for (let i = 0; i <= resultItemCount - 1;) {
            imageItems = result['items'][i]['images'][1]['url'];
            albumName = result['items'][i]['name'];
            $('.modalList')
                .append('<li class="albumItems"><image class="albumImage" src="' + imageItems + '"><span class="albumName">' + albumName + '</span><button class="l-button txt-white bg-orange select">選択</button></li>');
            i++;
        }
    }

    let albumCounter = 0;
    $(document).on("click", ".select", function () {
        let selectAlbum;
        selectAlbum = $(this).closest('li').children('img').attr('src');
        $('.albumArtList').append('<li class=""><image class="l-albumArt" src="' + selectAlbum + '"></li>');
        if (albumCounter == 9) {
            $('.addButton').removeClass('disp-block');
            $('.addButton').addClass('disp-none');
            $('.albumArtList')
                .append('<button class="l-button txt-white bg-orange reset"><i class="fa-solid fa-rotate-right"></i></button>');
        }
        albumCounter++;
    });
    $(document).on("click", ".reset", function () {
        $('.albumArtList').remove();
        $('.addButton').removeClass('disp-none');
        $('.addButton').addClass('disp-block');
        $('reset').remove();
    })
});

