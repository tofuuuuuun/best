<?php
?>
<div class="modal-container">
    <div class="modal-body">
        <div class="modal-close"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-content">
            <div class="l-searchForm ta-left">
                <div class="l-selectType">
                    <select class="selectWrapper" name="typeLabel">
                        <option class="typeLabel padding-all-05em" value="single">シングル</option>
                        <option class="typeLabel padding-all-05em" value="album">アルバム</option>
                    </select>
                    <input type="text" name="artist" id="artistName" placeholder="アーティスト名" data-artist_id="">
                </div>
                <div class="l-autocomplete"></div>
                <button class="l-buttonSearch txt-white bg-turquoise search">
                    <i class="fa-solid fa-magnifying-glass"></i>
                </button>
            </div>
        </div>
    </div>
</div>