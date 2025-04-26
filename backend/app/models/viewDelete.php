<?php

class viewDelete extends Model
{

    private $viewID;
    private $userID;
    public function __construct($viewID, $userID)
    {
        $this->viewID = $viewID;
        $this->userID = $userID;
    }

    public function delete()
    {
        $delete = $this->db_insert(
            "DELETE From `viewsList` WHERE `viewID` = :viewID AND `userID` = :userID",
            [
                ":viewID" => $this->viewID,
                ":userID" => $this->userID,
            ]
        );

        if ($delete->success) {
            return dsuccess("Monitor removed successfully");
        }

        return derror("Couldn't remove your monitor at the moment, please try again later!");

    }
}