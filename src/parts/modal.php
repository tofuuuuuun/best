<?php
?>
<div class="modal-container">
    <div class="modal-body">
        <div class="modal-close"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-content padding-all-1em">
            <div class="l-searchForm ta-left">
                <input type="text" name="artist" id="artistName" placeholder="アーティスト名">
                <div class="l-selectType">
                    <input type="radio" name="type" id="single" value="single" /><label for="single" class="typeLabel padding-all-05em" id="singleLabel">シングル</label>
                    <input type="radio" name="type" id="album" value="album" /><label for="album" class="typeLabel padding-all-05em" id="albumLabel">アルバム</label>
                </div>
                <button class="l-button txt-white bg-turquoise search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    </div>
</div>