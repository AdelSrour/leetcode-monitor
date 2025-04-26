<?php

function validateViewID($viewID)
{
    #must be a valid md5 hash
    $viewID = trim($viewID);
    if (!is_numeric($viewID)) {
        die(derror('The view you are trying to watch is not a valid view, Please double check the link!'));
    }
    return $viewID;
}

function validateViewName($viewName)
{
    $viewName = trim($viewName);
    #lets make sure to encode any html tags to prevent XSS
    $viewName = htmlspecialchars($viewName, ENT_QUOTES, 'UTF-8');
    #get only first 50 characters
    $viewName = mb_substr($viewName, 0, 20, 'UTF-8');
    if (mb_strlen($viewName, 'UTF-8') >= 20) {
        $viewName .= '...';
    }
    // $viewName = base64_encode($viewName);
    return $viewName;
}

function validateUsers($users)
{
    $users = trim($users);
    #store vaild users
    $filtered_users = [];

    #Extract users list
    $users = explode("{:}", $users);

    #limit to 50 users
    if (count($users) > 50) {
        die(derror("You have too many leetcode users in your list! Max users per view is 50 users."));
    }

    #go through every user and validate
    foreach ($users as $user) {
        $user = explode(",", $user);
        $userID = trim($user[0]);
        $userID = preg_match("#leetcode\.com/u/([^/]+)/?#", $userID, $m) ? $m[1] : $userID;
        $userTitle = trim($user[1]);
        $userTitle = mb_substr($userTitle, 0, 50, 'UTF-8');
        $userTitle = htmlspecialchars($userTitle, ENT_QUOTES, 'UTF-8');
        if (preg_match('/^[A-Za-z0-9_-]{3,20}$/', $userID) === 1) {
            $filtered_users[] = [$userID, $userTitle];
        }
    }

    #if no valid user found return error
    if ((count($users) == 0) || (count($filtered_users) == 0)) {
        die(derror("There is no leetcode users found in your list!"));
    }

    #Remove the extra ,
    $filtered_users = json_encode($filtered_users);
    return $filtered_users;
}

function validateUsername($username)
{
    $username = trim($username);
    $username = strtolower($username);
    if (!preg_match('/^[a-zA-Z0-9]{2,32}$/', $username)) {
        die(derror('Invalid username. It must be 2-32 characters long and contain only English letters and numbers.'));
    }
    return $username;
}

function validateEmail($email)
{
    $email = trim($email);
    $email = strtolower($email);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        die(derror('Email is invalid. Please enter a valid email address.'));
    }
    return $email;
}

function validatePassword($password)
{
    if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,64}$/', $password)) {
        die(derror('Password must be 8-64 characters and include at least 1 number, 1 special character, 1 uppercase letter, and 1 lowercase letter.'));
    }
    return $password;
}

function validateSessionID()
{
    $SessionID = trim($_POST["sessionID"]);
    if (!preg_match('/^[a-f0-9]{64}$/', $SessionID)) {
        die(dauth());
    }
    return $SessionID;
}