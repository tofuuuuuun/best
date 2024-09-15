<?php
require_once('../../common/spotifyToken.php');

header('Content-type: application/json; charset=utf-8;');

$artistName = $_GET['artistName'] ?? "";
$type = $_GET['type'] ?? "";
$artistId = $_GET['artistId'] ?? "";
$cacheKey = "";
$cachedResult = "";


$cacheKey = "artist_albums_" . ($artistId ?: md5($artistName)) . "_" . ($type ?: 'all');

// キャッシュに一致するデータが有れば返す
$cachedResult = apcu_fetch($cacheKey);
if ($cachedResult) {
    echo json_encode($cachedResult);
    exit;
}

$result = "";
if (empty($artistId)) {
    $result = $api->search($artistName, 'artist');
    if (!empty($result->{'artists'}->{'items'})) {
        $artistId = $result->{'artists'}->{'items'}[0]->{'id'};
    } else {
        echo json_encode(['error' => 'Artist not found']);
        exit;
    }
}

if ($type != "all") {
    $result = $api->getArtistAlbums($artistId, ['include_groups' => $type, 'limit' => 50, 'country' => 'JP']);
} else {
    $result = $api->getArtistAlbums($artistId, ['limit' => 50, 'country' => 'JP']);
}

if ($result->next) {
    $tmpResult;
    $resultFlg = true;
    for ($i = 1; $resultFlg == true;) {
        $offset = 50;
        if ($type != "all") {
            $tmpResult = $api->getArtistAlbums($artistId, ['include_groups' => $type, 'offset' => $offset * $i, 'limit' => 50, 'country' => 'JP']);
        } else {
            $tmpResult = $api->getArtistAlbums($artistId, ['offset' => $offset * $i, 'limit' => 50, 'country' => 'JP']);
        }

        foreach ($tmpResult->items as $key => $value) {
            $result->items[] = $tmpResult->items[$key];
        }
        if (!$tmpResult->next) {
            $resultFlg = false;
        }
        $i++;
    }
}

apcu_store($cacheKey, $result, 300);

echo json_encode($result);
exit;
