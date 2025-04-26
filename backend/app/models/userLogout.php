<?php

class UserLogout extends Model
{

    private $sessionID;
    private $userID;

    public function __construct($sessionID, $userID)
    {
        $this->sessionID = $sessionID;
        $this->userID = $userID;
    }

    public function logout()
    {

        $logout = $this->db_insert(
            "DELETE From usersSessions WHERE `sessionID` = :sessionID AND `userID` = :userID",
            [
                ":sessionID" => $this->sessionID,
                ":userID" => $this->userID,
            ]
        );

        if ($logout->success){
            return dsuccess("Logged out successfully");
        }

        return derror("Couldn't log you out at the moment, please try again later!");
    }

}