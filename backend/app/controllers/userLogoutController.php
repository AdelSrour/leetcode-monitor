<?php
require_once __DIR__ . "/../models/userLogout.php";
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

$sessionDestroy = new UserLogout($sessionID , $userID);
echo $sessionDestroy->logout();