<?php
?>
<div class="modal-container">
    <div class="modal-body">
        <div class="modal-close"><i class="fa-solid fa-xmark"></i></div>
        <div class="modal-content">
            <div class="searchForm p-left-1em ta-left">
                <div class="inputArtist m-bottom-1em">
                    <p class="artistName font-wb">アーティスト</p>
                    <input type="text" name="artist" id="artistName">
                </div>
                <div class="ta-center">
                    <button class="l-button txt-white bg-orange search">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </div>
            </div>
            <div>
                <ul class="modalList">
                    <?php /*検索結果の一覧が表示される */ ?>
                </ul>
            </div>
        </div>
    </div>
</div>