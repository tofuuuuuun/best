<?php
// session_start();
// if (isset($_SESSION["logion_session"]) && $_SESSION["logion_session"] == false) {
//     header('Location:http://localhost:8080/');
// }
$title = "test";
// include("./database/connect.php");


include("./common/header.php");
?>
<main>

    <div class="l-albumList">
        <div>
            <div class="l-albumArt addButton disp-block">
                <i class="fa-solid fa-plus"></i>
            </div>
            <ul class="albumArtList">
            </ul>
        </div>
    </div>
</main>
<?php include("./parts/modal.php"); ?>
</body>

</html>