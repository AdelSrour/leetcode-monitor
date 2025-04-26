<?php
require_once __DIR__ . "/../models/viewDelete.php";
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

$viewDelete = new viewDelete($viewID, $userID);
echo $viewDelete->delete();