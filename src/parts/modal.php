<?php
?>
<div class="modal-container">
    <div class="modal-body">
        <div class="modal-close"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-content">
            <div class="l-searchForm ta-left m-bottom-1em">
                <div class="l-selectType">
                    <input type="text" name="artist" id="artistName" placeholder="アーティスト名" data-artist_id="">
                    <div class="clear"><i class="fa-solid fa-xmark"></i></div>
                </div>
                <div class="l-autocomplete"></div>
                <button class="l-buttonSearch txt-white bg-turquoise search action">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
            <div class="ta-left m-bottom-1em">
                <!-- <p>あと<span id="choiceCounter" class="counterText txt-orange">10</span><span class="counterText  txt-orange">枚</span>！</p> -->
                <input type="radio" name=typeLabel id="typeAlbum" value="album" checked>
                <label for="typeAlbum" class="l-subButton bg-gray">アルバム</label>
                <input type="radio" name=typeLabel id="typeSingleEP" value="single">
                <label for="typeSingleEP" class="l-subButton bg-gray">シングルとEP</label>
                <input type="radio" name=typeLabel id="typeAll" value="all">
                <label for="typeAll" class="l-subButton bg-gray">すべて</label>
            </div>
        </div>
    </div>
</div>