<?php
class viewCreate extends Model
{

    private $viewName;
    private $usersList;
    private $userID;

    public function __construct($viewName, $usersList, $userID)
    {
        $this->viewName = $viewName;
        $this->usersList = $usersList;
        $this->userID = $userID;
    }

    public function generate()
    {
        $results = $this->db_insert(
            "INSERT INTO `viewsList` (`userID`, `viewName`, `usersList`, `lastUpdate`) 
            VALUES (:userID, :viewName, :usersList, now());",
            [

                ":userID" => $this->userID,
                ":viewName" => $this->viewName,
                ":usersList" => $this->usersList,
            ]
        );

        if ($results->success) {
            return dsuccess($this->db_lastID());
        } else {
            return derror($results->errorMsg);
        }
    }

    private function generateID()
    {
        return md5(uniqid(mt_rand(), true));
    }
}