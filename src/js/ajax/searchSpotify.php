<?php
require_once('../../vendor/autoload.php');
require_once('../../common/spotifyToken.php');

header('Content-type: application/json; charset=utf-8');

$artistName = isset($_GET['artistName']) ? $_GET['artistName'] : "";
$type = isset($_GET['type']) ? $_GET['type'] : "";

$result = "";
$result = $api->search($artistName, 'artist');
$artistId = $result->{'artists'}->{'items'}[0]->{'id'};

if ($type == "album") {
    $result = $api->getArtistAlbums($artistId, ['album_type' => 'album', 'limit' => 50, 'country' => 'JP']);
} elseif ($type == "single") {
    $result = $api->getArtistAlbums($artistId, ['album_type' => 'single', 'limit' => 50, 'country' => 'JP']);
}

echo json_encode($result);
exit;
