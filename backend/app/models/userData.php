<?php

class userData extends Model
{

    private $userID;

    public function __construct($userID)
    {
        $this->userID = $userID;
    }

    public function listAll()
    {

        $userData = $this->db_select(
            'SELECT `username`, `email` FROM usersList WHERE `userID` = :userID',
            [
                ":userID" => $this->userID,
            ]
        );

        $viewList = $this->db_select(
            'SELECT `viewName`, `viewID` FROM viewsList WHERE `userID` = :userID order by `lastUpdate` desc LIMIT 10',
            [
                ":userID" => $this->userID,
            ]
        );


        if ($userData->success === true) {

            if (count($userData->data) > 0) {

                $userInfo = [
                    "username" => $userData->data[0]["username"],
                    "email" => $userData->data[0]["email"],
                    "views" => json_encode($viewList->data),
                ];

                return dsuccess(json_encode($userInfo));
            }

        } else {
            return derror("We are unable to display your views at the moment, please try again later!");
        }

        return dsuccess(NULL);
    }
}