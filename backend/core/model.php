<?php
class Model extends Database
{
    protected $database;

    private function initDB()
    {
        if (!$this->database) {
            $this->database = new Database();
        }
    }

    public function db_select($sql, $param)
    {
        $this->initDB();
        $results = $this->database->select($sql, $param);
        return $results;
    }

    public function db_insert($sql, $param)
    {
        $this->initDB();
        $results = $this->database->query($sql, $param);
        return $results;
    }

    public function db_lastID()
    {
        $this->initDB();
        $results = $this->database->lastInsertId();
        return $results;
    }
}
