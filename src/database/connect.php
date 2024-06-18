<?php
// $user = "root";
// $pass = "mysql";

define('KEY', 'password');

$user = "user";
$pass = "password";

try {
    $pdo = new PDO('mysql:host=project1-mysql-1;dbname=db', $user, $pass);
} catch (PDOException $error) {
    echo "failed";
    echo $error->getMessage();
}
