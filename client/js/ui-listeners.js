//UI Listeners

$('#get-started').click(function(evt){
	$('#intro').hide();
	$('#search-container').show();
	ga('send', 'event', 'button', 'click', 'getStarted');
});

$('#submit-search').click(function(evt){
	evt.preventDefault();
	ga('send', 'event', 'button', 'click', 'submitSearch');
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

	if($('#minAsk').val().length>0){
		searchObj.minAsk = $('#minAsk').val();
	}
	if($('#maxAsk').val().length>0){
		searchObj.maxAsk = $('#maxAsk').val();
	}

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
	ga('send', 'event', 'button', 'click', 'getSearches');
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

