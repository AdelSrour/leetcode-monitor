<?php
#core services
require_once __DIR__ . '/../core/validators.php';
require_once __DIR__ . '/../core/responser.php';
require_once __DIR__ . '/../core/database.php';
require_once __DIR__ . '/../core/model.php';

#json header
header("Content-Type: application/json");

#requested service
$target = $_POST["service"];
switch ($target) {
    case 'userCreate':
        require_once __DIR__ . '/../app/controllers/userCreateController.php';
        break;

    case 'userLogin':
        require_once __DIR__ . '/../app/controllers/userLoginController.php';
        break;

    case 'userLogout':
        require_once __DIR__ . '/../app/controllers/userLogoutController.php';
        break;

    case 'userData':
        require_once __DIR__ . '/../app/controllers/userDataController.php';
        break;

    case 'viewDisplay':
        require_once __DIR__ . '/../app/controllers/viewDisplayController.php';
        break;

    case 'viewCreate':
        require_once __DIR__ . '/../app/controllers/viewCreateController.php';
        break;

    case 'viewDelete':
        require_once __DIR__ . '/../app/controllers/viewDeleteController.php';
        break;


    default:
        echo derror("Requested service doesn't exist");
}