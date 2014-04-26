<?php 
header('Access-Control-Allow-Origin: *');

$dbName='XXXXXXXXXXXXX';
$dbUser='XXXXXXXXXXXXX';
$dbPwd='XXXXXXXXXXXX';


// Create PDO connection
$pdo = new PDO('mysql:host=localhost;charset=utf8;dbname='.$dbName, $dbUser, $dbPwd);

// It was suggested to set to false to force full paramterization.
$pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

// Make catchable exceptions
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);


?>