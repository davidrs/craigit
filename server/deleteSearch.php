<?php
header('Access-Control-Allow-Origin: *');
require 'config.php'; //makes connection to database

$email = '';
$id = 0;
if(isset( $_GET['email'])  && isset( $_GET['id'])){
    $email = $_GET['email'];
    $id = $_GET['id'];
} else{
    echo json_encode(array("status"=>"error"));
    $pdo = null;
}


$response = deleteSearch($id, $email);
echo json_encode($response);
$pdo = null;

function deleteSearch($id, $email){
    global $pdo;
    $response = array();
    try{

        $stmt = $pdo->prepare('DELETE FROM searches WHERE email=:email AND id=:id');
        $stmt->execute(array(':id' => $id,':email' => $email));
        return (array("status"=>"success"));

    } catch(PDOException $ex) {
        echo json_encode(array("status"=>"error"));
    }
};
?>