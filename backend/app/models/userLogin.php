<?php

class userLogin extends Model
{

    private $username;
    private $password;
    private $expiry_date;

    public function __construct($username, $password)
    {
        $this->username = $username;
        $this->password = $password;
        $this->expiry_date = time() + 3600 * 24;
    }

    public function login()
    {
        $login = $this->db_select(
            'SELECT * FROM lcmtr.usersList WHERE `username` = :username',
            [
                ":username" => $this->username
            ]
        );

        if ($login->success) {
            if (count($login->data) > 0 && password_verify($this->password, $login->data[0]["password"])) {
                return $this->createSession($login->data[0]["userID"]);
            } else {
                return derror("Username or Password are incorrect!");
            }
        } else {
            return derror("We are encountered an unknown error, please try again later!");
        }
    }


    private function createSession($userID)
    {

        $sessionID = $this->generateID();
        $session = $this->db_insert(
            "INSERT INTO `lcmtr`.`usersSessions` (`sessionID`, `userID`, `ipAddress`, `userAgent`, `creationDate`, `expireDate`)
             VALUES (:sessionID, :userID, :ipAddress, :userAgent, NOW(), DATE_ADD(NOW(), INTERVAL :expireDate SECOND))",
            [
                ":sessionID" => $sessionID,
                ":userID" => $userID,
                ":ipAddress" => $_SERVER['REMOTE_ADDR'],
                ":userAgent" => $_SERVER['HTTP_USER_AGENT'],
                ":expireDate" => (3600 * 24),
            ]
        );

        if ($session->success) {
            // setcookie('sessionID', $sessionID, [
            //     'expires' => $this->expiry_date,
            //     'path' => '/',
            //     'domain' => $_SERVER['REMOTE_HOST'],
            //     'secure' => true,
            //     'httponly' => true,
            //     'samesite' => 'Strict'
            // ]);
            return dsuccess($sessionID);
        } else {
            return derror("We were unable to login you in at this time, please try again later!" . $session->errorMsg);
        }
    }

    private function generateID()
    {
        return bin2hex(random_bytes(32)); // 64-character secure token
    }

}