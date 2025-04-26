<?php
require_once __DIR__ . "/../models/userData.php";
require_once __DIR__ . "/../models/userSession.php";

$sessionID = validateSessionID();

#Auth_User
$session = new UserSession($sessionID);
$sessionAuth = $session->auth();
if ($sessionAuth !== true) {
    die(dauth());
} else {
    $userID = $session->userID;
}

$model = new userData($userID);
echo $model->listAll();