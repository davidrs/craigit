<?php
header('Access-Control-Allow-Origin: *');
require_once  'config.php'; //makes connection to database
//require_once  'local-config.php'; //makes connection to database
require 'runSingleSearch.php';

//https://washingtondc.craigslist.org/jsonsearch/sss/?zoomToPosting=&catAbb=sss&query=desk&minAsk=10&maxAsk=100&sort=rel&excats=
$REGION_BASE_URL = 'https://washingtondc.craigslist.org';
$SEARCH_PATH = '/jsonsearch/sss/?';
$DEBUG_MODE = false;
$SECONDS_DELAY = 1;
$EMAIL_BODY = '';
$currentDBID = -1;


getAllSearches();
$pdo = null;

function getAllSearches(){
    global $pdo, $lastSent, $newLastSent, $currentDBID, $SECONDS_DELAY, $REGION_BASE_URL;

    try{
        $stmt = $pdo->prepare('SELECT *
            FROM searches');
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $currentDBID = $row['id'];
            $email = $row['email'];
            $query = unserialize($row['query']);
            $filter = unserialize($row['filter']);
            $lastSent = intval($row['sentListings']);
            $REGION_BASE_URL = $row['baseurl'];

            if(!$lastSent){
                $lastSent = 0 ;
            }
            $newLastSent = $lastSent;

            echo '<br/>RUNNING SEARCH: '.$row['query'];
            runSearch($email, $filter, $query);
            sleep($SECONDS_DELAY);
        }

    } catch(PDOException $ex) {
        echo 'error'.$ex;
    }
}

?>
