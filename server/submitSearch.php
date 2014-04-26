<?php
header('Access-Control-Allow-Origin: *');
require 'config.php'; //makes connection to database

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


submitSearch($email, $query, $filter, $baseurl);
$pdo = null;

function submitSearch($email, $query, $filter, $baseurl){
    global $pdo;
    try{

        $stmt = $pdo->prepare('INSERT INTO searches (id, email, filter, query, sentListings, baseurl)
            VALUES (NULL, :email, :filter, :query, :sentListings, :baseurl)');
        $stmt->execute(array(':email' => $email,':filter' => serialize($filter),':query' => serialize($query),':sentListings' => NULL, ':baseurl' => $baseurl));
        echo json_encode(array('status'=>'success'));;

    } catch(PDOException $ex) {
        echo 'error'.$ex;
    }
}


/* ------------------------------------------
* converts a string with a stret address
* into a couple of lat, long coordinates.
* ------------------------------------------*/
function getGPS($address){
    $geocode=file_get_contents('http://maps.google.com/maps/api/geocode/json?address='.rawurlencode($address).'&sensor=false');

    $output= json_decode($geocode);
    $_coords['lat']=0;
    $_coords['lng']=0;

    if($output->status !='ZERO_RESULTS' && $output->status !='INVALID_REQUEST'){
        $_coords['lat'] =$output->results[0]->geometry->location->lat;
        $_coords['lng'] =$output->results[0]->geometry->location->lng;
    } else{
        echo 'No good address results';
        die();
    }

    return $_coords;
}

?>
