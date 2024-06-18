<?php
require_once('../../vendor/autoload.php');

header('Content-type: application/json; charset=utf-8');

$artistName = isset($_GET['artistName']) ? $_GET['artistName'] : "";

$session = new SpotifyWebAPI\Session(
    '37b4e8c07e064cadaf42305b97bfc643',
    'b7c6cfbe31b5467fb7c8245a1146e930'
);
$api = new SpotifyWebAPI\SpotifyWebAPI();

$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();
$api->setAccessToken($accessToken);

$result = $api->search($artistName, 'artist');
$artistId = $result->{'artists'}->{'items'}[0]->{'id'};
$result = $api->getArtistAlbums($artistId, ['album_type' => 'album', 'country' => 'JP']);

echo json_encode($result);
exit;
