<?php

class UserSession extends Model
{

    private $sessionID;
    public $userID;

    public function __construct($sessionID)
    {
        $this->sessionID = $sessionID;
    }

    public function auth()
    {

        $auth = $this->db_select(
            'SELECT * FROM usersSessions 
            WHERE `sessionID` = :sessionID AND `userAgent` = :userAgent AND `expireDate` > NOW()',
            [
                ":sessionID" => $this->sessionID,
                ":userAgent" => $_SERVER["HTTP_USER_AGENT"],
            ]
        );

        if ($auth->success) {
            if (count($auth->data) > 0) {
                $this->userID = $auth->data[0]["userID"];
                return true;
            }
        }

        return false;
    }


}