<?php
require_once __DIR__ . "/../models/userLogin.php";

$username = validateUsername($_POST["username"]);
$password = validatePassword($_POST["password"]);

$loginGate = new userLogin($username,  $password);
echo $loginGate->login();