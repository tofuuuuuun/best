<?php
require_once('../../common/spotifyToken.php');

header('Content-type: application/json; charset=utf-8');

$artistName = $_GET['artistName'] ?? "";

$result = $api->search($artistName, 'artist');
$result = $result->{'artists'};

$workResult = json_decode(json_encode($result), true);

foreach ($workResult['items'] as $key => $value) {
    $delArr = ['external_urls', 'followers', 'genres', 'href', 'popularity', 'type', 'uri'];
    foreach ($delArr as $delKey => $delValue) {
        unset($workResult['items'][$key][$delValue]);
    }
}

echo json_encode($workResult);
exit;
