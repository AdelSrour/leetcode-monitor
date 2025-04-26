<?php
require_once __DIR__ . "/../models/viewCreate.php";
require_once __DIR__ . "/../models/userSession.php";

$viewName = validateViewName($_POST["viewName"]);
$usersList = validateUsers($_POST["usersList"]);
$sessionID = validateSessionID();

#Auth_User
$session = new UserSession($sessionID);
$sessionAuth = $session->auth();
if ($sessionAuth !== true) {
    die(dauth());
} else {
    $userID = $session->userID;
}

$model = new viewCreate($viewName, $usersList, $userID);
echo $model->generate();