<?php
header('Access-Control-Allow-Origin: *');
require 'config.php'; //makes connection to database

$email = '';
if(isset( $_GET['email'] )){
    $email = $_GET['email'];
}


$response = getSearches($email);
echo json_encode($response);
$pdo = null;

function getSearches($email){
    global $pdo;
    $response = array();
    try{

        $stmt = $pdo->prepare('SELECT * FROM searches WHERE email=:email');
        $stmt->execute(array(':email' => $email));
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $row["query"] = unserialize($row["query"]);
            $row["filter"] = unserialize($row["filter"]);
            $row["sentListings"] = unserialize($row["sentListings"]);
            array_push($response, $row);
        }
        return $response;

    } catch(PDOException $ex) {
        echo 'error'.$ex;
    }
}

?>
