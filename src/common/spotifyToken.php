<?
require_once('../../vendor/autoload.php');
$session = new SpotifyWebAPI\Session(
    '37b4e8c07e064cadaf42305b97bfc643',
    'b7c6cfbe31b5467fb7c8245a1146e930'
);
$api = new SpotifyWebAPI\SpotifyWebAPI();

$session->requestCredentialsToken();
$accessToken = $session->getAccessToken();
$api->setAccessToken($accessToken);
