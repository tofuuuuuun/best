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
            console.log(result);
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

            var artistsName = new Array();
            var tempArtistsName = new Array();
            tempArtistsName = result['items'][i]['artists'];
            tempArtistsName.forEach(value => {
                artistsName.push(value.name);
            });

            $('.modalList')
                .append('<li class="albumItems"><image class="albumImage" src="' + imageItems + '"><div class="l-albumInfo"><span class="albumName">' + albumName + '</span><span class="artistsName">' + artistsName.toString() + '</span></div><button class="l-button txt-white bg-turquoise select">選択</button></li>');
            i++;
        }
    }

    let albumCounter = 0;
    let albumFlg = false;
    $(document).on("click", ".select", function () {
        if (albumCounter == 0) {

        }
        if (albumCounter <= 10) {
            let selectAlbum;
            selectAlbum = $(this).closest('li').children('img').attr('src');
            $('.albumArtList').append('<li class=""><image class="l-albumArt" src="' + selectAlbum + '"></li>');
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


    $(document).on("click", ".reset", function () {
        albumCounter = 0;
        console.log(albumCounter);
        $('.albumArtList').children().remove();
        $('.addButton').removeClass('disp-none');
        $('.addButton').addClass('disp-block');
        $('.reset').remove();
    })
});

