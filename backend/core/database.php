<?php
class Database
{
    private $instance = null;
    private $pdo;

    private $host = 'localhost';
    private $db = 'lcmtr';
    private $user = 'db_username';
    private $pass = 'db_password';
    private $charset = 'utf8mb4';

    public $database_instance;

    public function __construct()
    {
        $dsn = "mysql:host=$this->host;dbname=$this->db;charset=$this->charset";

        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => false,
        ];

        try {
            $this->pdo = new PDO($dsn, $this->user, $this->pass, $options);
        } catch (PDOException $e) {
            die(derror("Database connection failed: " . $e->getMessage()));
        }
    }

    private function __destruct()
    {
        $this->pdo = null;
    }

    #select
    public function select($sql, $params = [])
    {
        $r = new StdClass();
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            $r->success = true;
            $r->data = $stmt->fetchAll();
            return $r;
        } catch (PDOException $e) {
            $r->success = false;
            $r->errorMsg = $e->getMessage();
            return $r;
        }
    }

    #int,del,upd
    public function query($sql, $params = [])
    {
        $r = new StdClass();
        try {
            $stmt = $this->pdo->prepare($sql);
            $r->success = true;
            $r->data = $stmt->execute($params);
            return $r;
        } catch (PDOException $e) {
            $r->success = false;
            $r->errorMsg = $e->getMessage();
            return $r;
        }
    }

    public function lastInsertId()
    {
        try {
            return $this->pdo->lastInsertId();
        } catch (PDOException $e) {
        }
    }
}