<?php
class Cacher
{
    private $cache_path;

    public function __construct($viewID, $userID){
        $this->cache_path = sys_get_temp_dir() . DIRECTORY_SEPARATOR . $viewID . "_" . $userID . "_lcmtr.tmp";
    }

    public function setcache($data)
    {
        file_put_contents($this->cache_path, $data);
    }

    public function getcache($maxAge){
        if (file_exists($this->cache_path) && (filemtime($this->cache_path) >= (time() - $maxAge))) {
            return file_get_contents($this->cache_path);
        }
        return false;
    }

    public function delcache(){
        unlink($this->cache_path);
    }
}