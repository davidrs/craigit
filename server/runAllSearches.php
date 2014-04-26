<?php
header('Access-Control-Allow-Origin: *');
require 'config.php'; //makes connection to database
require 'runSingleSearch.php'; //makes connection to database

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
    global $pdo, $sentResults, $currentDBID, $SECONDS_DELAY, $REGION_BASE_URL;

    try{
        $stmt = $pdo->prepare('SELECT *
            FROM searches');
        $stmt->execute();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $currentDBID = $row['id'];
            $email = $row['email'];
            $query = unserialize($row['query']);
            $filter = unserialize($row['filter']);
            $sentResults = unserialize($row['sentListings']);
            $REGION_BASE_URL = $row['baseurl'];

            if(!$sentResults){
                $sentResults =array();
            }

            echo '<br/>RUNNING SEARCH: '.$row['query'];
            runSearch($email, $filter, $query);
            sleep($SECONDS_DELAY);
        }

    } catch(PDOException $ex) {
        echo 'error'.$ex;
    }
}

?>
