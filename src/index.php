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
    <div class="l-contentWrapper">
        <div class="l-albumList">
            <ul class="albumArtList" id="target"></ul>
            <div class="albumAddButton">
                <div class="l-albumArt albumAddButton addButton disp-block">
                    <i class="fa-solid fa-plus txt-green"></i>
                </div>
            </div>
        </div>
    </div>
    <div class="resetArea"></div>
</main>
<?php include("./parts/modal.php"); ?>
<script type='text/javascript' defer src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js" integrity="sha512-BNaRQnYJYiPSqHHDb58B0yaPfCu+Wgds8Gp/gU33kqBtgNS4tSPHuGibyoeqMV/TJlSKda6FXzoEyYGjTe+vXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script type='text/javascript' defer src="../js/function.js"></script>
</body>

</html>