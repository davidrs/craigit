//var API_BASE =  '../server/'; // <- this is for if hosted on same localhost.
var API_BASE = 'http://davidrs.com/craigit/server/';
var userEmail = '';

var app ={
	//start app
	load: function(){
		if(localStorage){
			// Retrieve Email if found
			userEmail = localStorage.getItem("email");
			if(userEmail && userEmail.length>0){
				app.getSearches(userEmail);
				$('#emailSearch').val(userEmail);
			}
		}
	},
	submitSearch: function(newSearch){
		newSearch.email = userEmail;

		$.ajax(API_BASE+'submitSearch.php',{
			data:newSearch,
			success:function(data){
				console.log("search response",data);
				data = JSON.parse(data);
				if(data.status == "success"){
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

	printSearchResults: function(data){
		$('#search-results').html('');
		for(var key in data){
			var html = '<div class="col-md-4 search-listing">'+
	  					'<h3>'+decodeURIComponent(data[key].query.query)+'</h3>'+
	  					'<p>'+
	  					'Search Radius:'+data[key].filter.distance +' miles'+
	  					(data[key].query.minAsk? 'Min: $'+data[key].query.minAsk:'') +
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

	// Gets searches for a user
	getSearches: function(userEmail){
		if(userEmail != ''){
			console.log('getSearches hide');
			$('#login-section').hide();
			$('.active-user').text(userEmail);
			$('#logout-section').show();
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

//UI Listeners
$('#get-started').click(function(evt){
	$('#intro').hide();
	$('#search-container').show();
});

$('#submit-search').click(function(evt){
	evt.preventDefault();
	userEmail = $('#emailSearch').val();
	if(localStorage){
		localStorage.setItem("email", userEmail);
	}

	var searchObj = {
		query: $('#query').val(),
		address: $('#address').val(),
		distance: $('#distance').val(),
		baseurl:$('#baseurl').val()
	};
	if(searchObj.query == ''){
		alert("Missing search term");
	} else if(searchObj.address == ''){
		alert("Missing search address");
	} else{
		app.submitSearch(searchObj);
	}
});

$('.get-searches').click(function(evt){
	evt.preventDefault();
	userEmail = $('#email-account').val();
	if(localStorage){
		localStorage.setItem("email", userEmail);
	}
	app.getSearches(userEmail);
});

$('.logout').click(function(evt){
	evt.preventDefault();
	if(localStorage){
		localStorage.setItem("email", '');
	}

	$('#login-section').show();
	$('active-user').text('');
	$('#logout-section').hide();
});


app.load();