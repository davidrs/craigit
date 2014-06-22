//var API_BASE =  '../server/'; // <- this is for if hosted on same localhost.
var API_BASE = 'http://davidrs.com/craigit/server/';
var userEmail = '';
var preferredCraigslist ='http://washingtondc.craigslist.org';

var app = {
	//start app
	load: function(){
		if(localStorage){
			// Retrieve Email if found
			userEmail = localStorage.getItem("email");
			if(userEmail && userEmail.length>0){
				app.getSearches(userEmail);
				$('#emailSearch').val(userEmail);
			}

			preferredCraigslist = localStorage.getItem("preferredCraigslist");
			if(preferredCraigslist){
				console.log('preferredCraigslist',preferredCraigslist);
				$('#baseurl').val(preferredCraigslist);
			}
		}
		this.createRoutes();
	},
	
	createRoutes: function(){
		var self = this;
		Finch.route('user/:email', function(res){
			self.getSearches(res.email);
		});

		Finch.listen();

	},

	// Send a search to the server
	submitSearch: function(newSearch){
		newSearch.email = userEmail;

		$.ajax(API_BASE+'submitSearch.php',{
			data:newSearch,
			success:function(data){
				console.log("search response",data);
				data = JSON.parse(data);
				if(data.status == "success"){
					$('#search-container').hide();
					$('#success-message').show();
					app.resetForm();
				} else{
					alert("Error submitting search, "+data);
					console.warn("Error submitting search, ", data);
				}
					//Run getSearches to show latest
					app.getSearches(userEmail);
			}
		});

	},

	// Print html
	//TODO add templating engine and use templates
	printSearchResults: function(data){
		$('#search-results').html('');

		//TODO group into 3s and add to a row DOM, then append it to search results.
		for(var key in data){
			var html = '<div class="col-md-4 search-listing">'+
	  					'<h3>'+decodeURIComponent(data[key].query.query)+'</h3>'+
	  					'<p>'+
	  					'Search Radius:'+data[key].filter.distance +' miles'+
	  					(data[key].query.minAsk? '<br />Min: $'+data[key].query.minAsk:'') +
	  					(data[key].query.maxAsk? '<br />Max: $'+data[key].query.maxAsk:'') +
	  					'</p>'+
	  					//TODO print all results that have been sent.
	  					'<p><a class="btn btn-danger" href="#" role="button" data-id="'+data[key].id+'">Delete</a></p>'+
						'</div>';
			$('#search-results').append(html);
		}

		$('#search-results a.btn-danger').click(function(evt){
			evt.preventDefault();
			var clickedId = $(evt.currentTarget).data('id');
			app.deleteSearch(clickedId, evt);
		});
	},

	resetForm: function(){
		$('#query').val('');
		//$('#search-container').hide();
	},

	// delete the search with this id
	deleteSearch: function(clickedId, evt){
		console.log('About to Delete: ', clickedId);
		$.ajax(API_BASE+'deleteSearch.php',{
			data:{id:clickedId, email:userEmail},
			success:function(data){
				data = JSON.parse(data);
				if(data.status == "success"){
					$(evt.currentTarget).parents('.search-listing').remove();
				} else{
					alert('delete failed');
					console.error('delete failed:',data);
				}
			}
		});
	},

	// Gets all searches for a user
	getSearches: function(userEmail){
		if(userEmail != ''){
			$('#login-section').hide();
			$('.active-user').text(userEmail);
			$('#logout-section').show();
			$('#emailSearch').val(userEmail);
		}


		$.ajax(API_BASE+'getSearches.php',{
			data:{email:userEmail},
			success:function(data){
				console.log('getSearches: ',data);
				data = JSON.parse(data);
				if(data.length>0){
					app.printSearchResults(data);
				} else{
					//TODO prettier info feedback.
					alert("no listings found for this user.");
				}
			}
		});
	}
};
