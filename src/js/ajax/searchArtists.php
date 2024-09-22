<?php
require_once('../../common/spotifyToken.php');

header('Content-type: application/json; charset=utf-8');

$artistName = $_GET['artistName'] ?? "";

$result = "";
$result = $api->search($artistName, 'artist');
$result = $result->{'artists'};

$workResult = json_decode(json_encode($result), true);

foreach ($workResult['items'] as $key => $value) {
    if (isset($value['external_urls'])) {
        unset($workResult['items'][$key]['external_urls']);
    }

    if (isset($value['followers'])) {
        unset($workResult['items'][$key]['followers']);
    }

    if (isset($value['genres'])) {
        unset($workResult['items'][$key]['genres']);
    }

    if (isset($value['href'])) {
        unset($workResult['items'][$key]['href']);
    }

    if (isset($value['popularity'])) {
        unset($workResult['items'][$key]['popularity']);
    }

    if (isset($value['type'])) {
        unset($workResult['items'][$key]['type']);
    }

    if (isset($value['uri'])) {
        unset($workResult['items'][$key]['uri']);
    }
}


echo json_encode($result);
exit;
