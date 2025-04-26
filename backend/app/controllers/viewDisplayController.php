<?php
require_once __DIR__ . "/../models/viewDisplay.php";
require_once __DIR__ . "/../models/userSession.php";

$viewID = validateViewID($_POST["viewID"]);
$sessionID = validateSessionID();

#Auth_User
$session = new UserSession($sessionID);
$sessionAuth = $session->auth();
if ($sessionAuth !== true) {
    die(dauth());
} else {
    $userID = $session->userID;
}

$model = new viewDisplay($viewID, $userID);
echo $model->fetch();