console.log("STARTING APP");
var geocoderProvider = 'google';
var httpAdapter = 'http';
var geocoder = require('node-geocoder').getGeocoder(geocoderProvider, httpAdapter);

var databaseUrl = "craigit"; // "username:password@example.com/mydb"
var collections = ["searches"];
var db = require("mongojs").connect(databaseUrl, collections);

var app = {
	test: function(){
		console.log("RUNNNING TEST");
		var email = 'davidrustsmith@gmail.com';

		this.saveSearch(
			{email: email,
			query:{
				query:'desk',
				catAbb: 'sss',
				sort: 'rel'
			},
			address: '2950 van ness st, dc',
			filter:{
				distance:0.5
			},
			baseurl: 'https://washingtondc.craigslist.org'
		});

		this.getSearches(email);

		this.deleteSearch('{the _id of entry}',email);

		this.runAllSearches();
	},


	runAllSearches: function(){
		console.log("running all searches");
		db.searches.find({}, function(err, searches) {
			if( err || !searches) console.log("No searches found");
			else{
				console.log("GOT ALL SEARCHES ");
				searches.forEach( function(search) {
					this.runSearch(search);
				});
			}
		});
	},

	//Run a specific search object.
	runSearch: function(search){
		searchURL = this.buildURL(searh.query);
		getCraigsListContent(searchURL, search, this.sendEmail);

	},

	buildURL: function(queryOptions){
	$jsonurl = $REGION_BASE_URL . $SEARCH_PATH;

	$jsonurl .= getParamsString($options);

	echo $jsonurl;

	if($DEBUG_MODE){
		return 'sampleData.txt';
	}
	return $jsonurl;
	},
	getCraigsListContent: function(searchURL, search, callback){

		/*
foreach(array_keys($results) as $key2){

			$distanceAway = distance($results[$key2]["Latitude"], $results[$key2]["Longitude"], $filter['lat'], $filter['lng'],"M");

			// Make sure it's close enough
			if($results[$key2] && $distanceAway < $filter['distance']){

				// Make sure it's an individual point and hasn't been sent before.
				if(isset($results[$key2]['PostingURL'])
					&& !in_array($results[$key2]['PostingID'], $sentResults)){
					$EMAIL_BODY .= '<br/><a href="' . $REGION_BASE_URL . $results[$key2]['PostingURL'].'">'.$results[$key2]['PostingTitle'];
					$EMAIL_BODY .= '<br/>' . round($distanceAway,2) .' miles away';
					$EMAIL_BODY .= 'Asking:  $'.$results[$key2]['Ask'].' </a>';
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
		*/

	},
	sendEmail: function(search, emailTxt){
		if(emailTxt != ''){
			
			//TODO send the email
			//

			this.updateDatabase();
		}
	},
	updateDatabase: function(){
		// TODO: append 'sent results ' to search.sentResults
	},
	getSearches: function(email){
		console.log("getting searches");
		db.searches.find({email: email}, function(err, searches) {
			if( err || !searches) console.log("No searches found for user:"+email);
			else{
				searches.forEach( function(search) {
					console.log(search);
				});
			}
		});
	},

	saveSearch: function(newSearch){
		console.log("saving search");
		if(!newSearch.email || !newSearch.query || !newSearch.address){
			console.log("missing params");
			return;
		}

		geocoder.geocode(newSearch.address)
			.then(function(res) {
				console.log('geocoding response', res);
				if(res.length>0){
					newSearch.filter.lat = res[0].latitude;
					newSearch.filter.lng = res[0].longitude;

					db.searches.save(newSearch, function(err, saved) {
							if( err || !saved ){
								console.log("Search not saved");
							} else{
								console.log("Search saved", saved);
							}
						});
				}else{
					console.log('NO GEOCODING RESULTS');
					return;
				}
			});
	},

	deleteSearch: function(searchID, email){
		console.log("deleting search");
		db.searches.remove( { _id: searchID, email: email }, function(err, res){
			if(err) {
				console.log('err',err);
				throw err;
			}
		});
	},

	// unit: M for miles, K is kilometers
	distance: function(lat1, lon1, lat2, lon2, unit) {

		theta = lon1 - lon2;
		dist = sin(deg2rad(lat1)) * sin(deg2rad(lat2)) +  cos(deg2rad(lat1)) * cos(deg2rad(lat2)) * cos(deg2rad(theta));
		dist = acos(dist);
		dist = rad2deg(dist);
		miles = dist * 60 * 1.1515;
		unit = strtoupper(unit);

		if (unit == "K") {
			return (miles * 1.609344);
		} else if (unit == "N") {
			return (miles * 0.8684);
		} else {
			return miles;
		}
	}

};

app.test();