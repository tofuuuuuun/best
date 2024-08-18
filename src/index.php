<?php
// session_start();
// if (isset($_SESSION["logion_session"]) && $_SESSION["logion_session"] == false) {
//     header('Location:http://localhost:8080/');
// }
$title = "BEST";
// include("./database/connect.php");
include("./common/header.php");
?>
<main>
    <div class="contentWrapper">
        <div class="l-contentWrapper">
            <div class="startText m-bottom-3em ta-center disp-block fadeIn">
                <h2 class="txt-white">あなたの音楽、あなたのベストアルバム</h2>
                <p class="txt-white m-bottom-1em">今まで聴いてきた音楽の中から、<br>あなたのベスト10枚を選んでみませんか？</p>
                <p class="txt-white m-bottom-2em">お気に入りのアルバムを選ぶだけで、<br>あなたの音楽遍歴が一目でわかる一覧が完成します。</p>

                <h3 class="txt-white">あなたの音楽の歴史を振り返る</h3>
                <p class="txt-white m-bottom-1em">シンプルに、そして直感的に、あなたの好きなアルバムを選択。</p>
                <p class="txt-white m-bottom-2em">アルバムアートを一覧で表示して<br>「このアルバム、懐かしい！」なんて話題も広がるはず。</p>

                <h3 class="txt-white">みんなにシェアしよう</h3>
                <p class="txt-white m-bottom-1em">作ったリストは、みんなにシェアして<br>「このアルバム超オススメ！」って自慢しよう。</p>
                <p class="txt-white m-bottom-2em">音楽の話題で盛り上がれること間違いなし！</p>

                <button class="startButton bg-turquoise txt-white font-wb">さあ、始めよう！</button>
            </div>
            <div class="l-albumList l-common disp-none">
                <ul class="albumArtList" id="target"></ul>
                <div class="albumAddButton">
                    <div class="l-albumArt albumAddButton addButton action disp-block">
                        <i class="fa-solid fa-plus txt-green"></i>
                    </div>
                </div>
            </div>
        </div>
        <div class="resetArea m-top-1em"></div>
    </div>
</main>
<?php include("./parts/modal.php"); ?>
<script type='text/javascript' defer src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script type='text/javascript' src="../js/function.js" defer></script>
</body>

</html>