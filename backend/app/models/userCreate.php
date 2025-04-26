<?php

class userCreate extends Model
{

    private $userID;
    private $email;
    private $password;

    public function __construct($userID, $email, $password)
    {
        $this->userID = $userID;
        $this->email = $email;
        $this->password = password_hash($password, PASSWORD_DEFAULT);
    }

    public function createAccount()
    {

        $account = $this->db_insert(
            "INSERT INTO `usersList` (`username`, `email`, `password`) VALUES (:username, :email, :password)",
            [
                ":username" => $this->userID,
                ":email" => $this->email,
                ":password" => $this->password,
            ]
        );


        #Account created
        if ($account->success == TRUE) {
            return dsuccess("Account created successfully!");
        } else {
            #we got db error
            #pharse error message
            switch (true) {
                case strpos($account->errorMsg, "username") !== false:
                    return derror("Username already exists. Please choose another username!");
                case strpos($account->errorMsg, "email") !== false:
                    return derror('Email address already registered with another account, please choose another email!');
                default:
                    return derror("We have encountered an Unknown error while trying to create your account, please try again later!");
            }
        }
    }

}