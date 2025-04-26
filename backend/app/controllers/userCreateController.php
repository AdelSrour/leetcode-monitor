<?php
require_once __DIR__ . "/../models/userCreate.php";

$username = validateUsername($_POST["username"]);
$email = validateEmail($_POST["email"]);
$password = validatePassword($_POST["password"]);

$createAccount = new userCreate($username, $email, $password);
echo $createAccount->createAccount();