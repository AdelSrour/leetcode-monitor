<?php

function derror($msg)
{
    return json_encode(["success" => false, "message" => $msg]);
}

function dsuccess($msg)
{
    return json_encode(["success" => true, "message" => $msg]);
}

function dauth(){
    return json_encode(["success"=> false,"message"=> "AUTH_ERROR"]);
}