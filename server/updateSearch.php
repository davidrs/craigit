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


$baseurl = 'https://washingtondc.craigslist.org';
$email = 'davidrustsmith@gmail.com';
$queryString ='';
$address='';

//base filter object
$filter =  array();

//base query object
$query =  array(
    "catAbb" =>'sss',
    "sort" =>'rel'
);


if(isset($_GET['email']) && isset($_GET['query']) 
    && isset($_GET['address']) && isset($_GET['distance']) 
    &&  isset($_GET['baseurl'])){
    $email  =  $_GET['email'];
    $address = $_GET['address'];
    $query['query']  =  urlencode($_GET['query']);
    $filter['distance']  =  $_GET['distance'];
    $baseurl =  $_GET['baseurl'];
} else{
    echo 'Missing params';
    return;
}

//Set min and max prices if applicable.
if(isset( $_GET['minAsk'])){
    $query['minAsk'] = $_GET['minAsk'];
}
if(isset( $_GET['maxAsk'])){
    $query['maxAsk'] = $_GET['maxAsk'];
}

// GeoCode the given address
$coords = getGPS($address);
$filter['lat'] = $coords['lat'];
$filter['lng'] = $coords['lng'];


$response = updateSearch($id, $email, $query, $filter, $baseurl);
echo json_encode($response);
$pdo = null;

function updateSearch($id, $email, $query, $filter, $baseurl)){
    global $pdo;
    $response = array();
    try{

        $stmt = $pdo->prepare('UPDATE searches 
            SET filter=:filter, query=:query, baseurl = :baseurl
            WHERE email=:email AND id=:id');
        $stmt->execute(array(':id' => $id,':email' => $email,':filter' => serialize($filter),':query' => serialize($query),':baseurl' => $baseurl));
        return (array("status"=>"success"));

    } catch(PDOException $ex) {
        echo json_encode(array("status"=>"error"));
    }
};
?>