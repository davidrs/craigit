<?php
header('Access-Control-Allow-Origin: *');
require 'config.php'; //makes connection to database



function runSearch($email, $filterOptions,$queryOptions){
    global $EMAIL_BODY, $sentResults;
    $EMAIL_BODY = '';

    $searchURL = buildURL($queryOptions);
    searchURL($searchURL, $filterOptions, $queryOptions);

    echo "<br /><br /><br />";
    echo $EMAIL_BODY;
    echo "<br /><br /><br />";

    if($EMAIL_BODY != ''){
        sendEmail($email, $queryOptions);
        updateDatabase();
    }
}

function searchURL($searchURL, $filterOptions, $queryOptions){
    //Get json response
    $jsonText = file_get_contents($searchURL);
    $json = json_decode($jsonText, true);

    parseResults($json, $filterOptions, $queryOptions);
}

function sendEmail($email, $queryOptions){
    global $EMAIL_BODY;
    // The message
    $message='';
    $message .= "\r\nMessage: ".$EMAIL_BODY;

    // In case any of our lines are larger than 70 characters, we should use wordwrap()
    $message = wordwrap($message, 70, "\r\n");
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers .= "From: david@smewebsites.com\r\nReply-To: david@smewebsites.com";


    // Send
    if ( mail($email, 'Craigslist: '.$queryOptions['query'], $message, $headers)){
        echo '<br/>Successful Email to '.substr($email,0,4);
    }
    else{
        echo '<br/>email failed';
        //die();
    }
}

function updateDatabase(){
    global $pdo, $sentResults, $currentDBID;
    try{
        $stmt = $pdo->prepare('UPDATE searches
            SET sentListings=:sent
            WHERE id = :id');
        $stmt->execute(array(':id' => $currentDBID,':sent' => serialize($sentResults)));
    } catch(PDOException $ex) {
        echo 'error'.$ex;
    }
}

function parseResults($json, $filter, $queryOptions){
    global $DEBUG_MODE, $REGION_BASE_URL, $EMAIL_BODY, $SECONDS_DELAY, $sentResults;

     foreach(array_keys($json) as $key){
        $results = $json[$key];
        foreach(array_keys($results) as $key2){

            $distanceAway = distance($results[$key2]["Latitude"], $results[$key2]["Longitude"], $filter['lat'], $filter['lng'],"M");

            // Make sure it's close enough
            if($results[$key2] && $distanceAway < $filter['distance']){

                // Make sure it's an individual point and hasn't been sent before.
                if(isset($results[$key2]['PostingURL'])
                    && !in_array($results[$key2]['PostingID'], $sentResults)){
                    $EMAIL_BODY .= '<br/><a href="' . $REGION_BASE_URL . $results[$key2]['PostingURL'].'">'.$results[$key2]['PostingTitle'];
                    $EMAIL_BODY .= '<br/>' . $distanceAway .' miles away';
                    $EMAIL_BODY .= '  $'.$results[$key2]['Ask'].' </a>';
                    $EMAIL_BODY .=  (isset($results[$key2]['ImageThumb'])?'<img src="'.$results[$key2]['ImageThumb'].'"' :''). '<br/><br/>';

                    array_push($sentResults,$results[$key2]['PostingID']);
                }
                elseif(isset($results[$key2]['NumPosts'])){
                    // This is a cluster, recure on it.
                    $clusterURL = $REGION_BASE_URL .$results[$key2]['url'] . getParamsString($queryOptions, false);
                    sleep($SECONDS_DELAY);
                    //Run it
                    searchURL($clusterURL,$filter, $queryOptions);
                }
            }
        }
     }
}


function buildURL($options){
    global $DEBUG_MODE, $REGION_BASE_URL, $SEARCH_PATH;
    $jsonurl = $REGION_BASE_URL . $SEARCH_PATH;

    $jsonurl .= getParamsString($options);

    echo $jsonurl;

    if($DEBUG_MODE){
        return 'sampleData.txt';
    }
    return $jsonurl;
}

function getParamsString($queryParams, $isFirstParam = true){
    $paramsString='';
    foreach(array_keys($queryParams) as $key){
        $paramsString .= (!$isFirstParam?'&':'').$key .'='.$queryParams[$key];
        $isFirstParam = false;
    }
    return $paramsString;
}

function
<?php

// unit: M for miles, K is kilometers
function distance($lat1, $lon1, $lat2, $lon2, $unit) {

  $theta = $lon1 - $lon2;
  $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
  $dist = acos($dist);
  $dist = rad2deg($dist);
  $miles = $dist * 60 * 1.1515;
  $unit = strtoupper($unit);

  if ($unit == "K") {
    return ($miles * 1.609344);
  } else if ($unit == "N") {
      return ($miles * 0.8684);
    } else {
        return $miles;
      }
}




function isValidJson($strJson) {
    json_decode($strJson);
    return (json_last_error() === JSON_ERROR_NONE);
}

?>
