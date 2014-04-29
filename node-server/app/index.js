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

		this.deleteSearch('*',email);


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
	}
};

app.test();