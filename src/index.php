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
            <ul class="albumArtList"></ul>
            <div class="albumAddButton">
                <div class="l-albumArt albumAddButton addButton disp-block">
                    <i class="fa-solid fa-plus txt-green"></i>
                </div>
            </div>
        </div>
    </div>
</main>
<?php include("./parts/modal.php"); ?>
<script type='text/javascript' defer src="https://code.jquery.com/jquery-3.7.1.js" integrity="sha256-eKhayi8LEQwp4NKxN+CfCh+3qOVUtJn3QNZ0TciWLP4=" crossorigin="anonymous"></script>
<script type='text/javascript' defer src="../js/function.js"></script>
</body>

</html>