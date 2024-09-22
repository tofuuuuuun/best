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
    $tmpResult = "";
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

$workResult = json_decode(json_encode($result), true);

foreach ($workResult['items'] as $key => $value) {
    if (isset($value['images']) && is_array($value['images'])) {
        $value['images'] = array_filter($value['images'], function ($image) {
            return $image['width'] >= 300 && $image['width'] < 640;
        });
        $value['images'] = array_values($value['images']);
    }

    $delArr = ['release_date_precision', 'total_tracks', 'available_markets', 'external_urls', 'href', 'uri', 'album_type', 'album_group'];
    foreach ($delArr as $delKey => $delValue) {
        unset($workResult['items'][$key][$delValue]);
    }
}

apcu_store($cacheKey, $workResult, 300);

echo json_encode($workResult);
exit;
