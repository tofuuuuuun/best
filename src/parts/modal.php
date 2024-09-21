<?php
?>
<div class="modal-container">
    <div class="modal-body">
        <div class="modal-close"><span class="icon-close"></span></div>
        <div class="modal-content">
            <div class="l-searchForm ta-left m-bottom-1em">
                <div class="l-selectType">
                    <input type="text" name="artist" id="artistName" placeholder="アーティスト名" data-artist_id="">
                    <div class="clear"><span class="icon-close"></span></div>
                </div>
                <div class="l-autocomplete"></div>
                <button class="l-buttonSearch txt-white bg-turquoise search action">
                    <img src="../images/search.png" alt="searchIcon" width="15">
                </button>
            </div>
            <div class="ta-left m-bottom-1em">
                <form id="type">
                    <input type="radio" name=typeLabel id="typeAlbum" value="album" checked>
                    <label for="typeAlbum" class="l-subButton bg-gray typeAlbum">アルバム</label>
                    <input type="radio" name=typeLabel id="typeSingleEP" value="single">
                    <label for="typeSingleEP" class="l-subButton bg-gray typeSingleEP">シングルとEP</label>
                    <input type="radio" name=typeLabel id="typeAll" value="all">
                    <label for="typeAll" class="l-subButton bg-gray typeAll">すべて</label>
                </form>
                <!-- <p>あと<span id="choiceCounter" class="counterText txt-orange">10</span><span class="counterText  txt-orange">枚</span>！</p> -->

            </div>
        </div>
    </div>
</div>