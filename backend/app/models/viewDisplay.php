<?php
require_once __DIR__ . '/../services/leetcode.php';
require_once __DIR__ . '/../services/cacher.php';

class viewDisplay extends Model
{
    private $cacher;
    private $leetcode;
    private $viewID;
    private $userID;

    public function __construct($viewID, $userID)
    {
        #init viewID
        $this->viewID = $viewID;

        #init userID
        $this->userID = $userID;

        #init leetcode service
        $this->leetcode = new Leetcode();

        #init cache service
        $this->cacher = new Cacher($this->viewID, $this->userID);
    }

    public function fetch()
    {
        #check if viewID has cache
        $cache_data = $this->cacher->getcache(3600);
        if ($cache_data) {
            // sleep(1);
            return $cache_data;
        }

        #no cache => get data from db
        $results = $this->db_select(
            'SELECT `viewName`, `viewID`, `usersList` FROM viewsList WHERE `viewID` = :viewID AND `userID` = :userID',
            [
                ":viewID" => $this->viewID,
                ":userID" => $this->userID,
            ]
        );

        #Check for db errors
        if ($results->success !== true) {
            return derror("We are having a database issue please try again later!");
        }

        #No results found for target viewID
        if (count($results->data) === 0) {
            return derror("This monitor you are trying to watch doesn't exist!");
        }

        #Get data from db
        $viewName = htmlspecialchars($results->data[0]["viewName"], ENT_QUOTES, "UTF-8");
        $usersList = json_decode($results->data[0]["usersList"], true);

        //get data from api
        $apiData = $this->leetcode->initRequest($usersList);
        $final_response = [
            "viewID" => $this->viewID,
            "viewName" => $viewName,
            "data" => $apiData,
        ];
        $final_response = dsuccess($final_response);

        #store cache
        $this->cacher->setcache($final_response);
        return $final_response;
    }

}