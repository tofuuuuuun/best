<?php
require_once('../../common/spotifyToken.php');

header('Content-type: application/json; charset=utf-8');

$artistName = $_GET['artistName'] ?? "";

$result = "";
$result = $api->search($artistName, 'artist');
$result = $result->{'artists'};

echo json_encode($result);
exit;
