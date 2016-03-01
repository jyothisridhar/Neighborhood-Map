'use strict';

var initialLocations = ['Bangalore Palace',
                        'Bangalore Golf club',
                        'Alliance Francaise, Bangalore',
						'Bowring institute, bangalore',
						'Church street Social, bangalore',
						'Chutney chang, museum road, bangalore',
						'Hard rock cafe, bangalore',
						'High court of karnataka, bangalore',
						'M Chinnaswamy stadium, bangalore',
						'Indian Institute of Science, Bangalore'];
var markers = [];

var Place = function(placeName){
	this.locationName = placeName;
	this.placeServiceData = null;
	this.marker = null;
	this.infoWindow = null;
};

//To-do: 3rd party API for more info
var ViewModel = function(mapView){
	var self = this;
	this.allLocations = [];
	this.visibleLocations = ko.observableArray();
	this.userInput = ko.observable('');
	this.searchText = ko.observable('');

	initialLocations.forEach(function(place) {
    	self.allLocations.push(new Place(place));
    });

    this.hideEmptyDiv = function(){
    	console.log("step 8");
    	$('#locations:empty').hide();
    }

    //get marker and infowindow data from map view
    this.pinMap = function(place){
    	console.log("step2 in pinMap");
    	var setGoogleData = function(data) {
    		console.log("step 5");
    		place.placeServiceData = data;
    		mapView.createMapMarker(place.placeServiceData, setMarkerData);
    	};

    	var setMarkerData = function(mData, infoData){
    		console.log("step 7");
    		place.marker = mData;
    		place.infoWindow = infoData;
    		console.log("marker: ",place.marker, "info:", place.infoWindow);
    	};

    	mapView.googlePlaceSearch(place, setGoogleData);
    };

    this.allLocations.forEach(function(place) {
    	self.visibleLocations.push(place);
    	self.pinMap(place);
    });

    this.showInfoWindowContent = function(location) {
    	console.log("step 9");
    	location.infoWindow.setContent(location.locationName);
  		location.infoWindow.open(map, location.marker);
    }

	this.searchLocation = function(formElement) {
		self.clearMarkers();
		console.log(self.searchText(), "step 1");
  		var placeObj = new Place(self.searchText());
  		//console.log(placeObj);
  		self.pinMap(placeObj);
  		//console.log("name:", placeObj.locationName, "info:", placeObj.infoWindow);
  		self.hideEmptyDiv();
  		if(placeObj.infoWindow !== null){
  			self.showInfoWindowContent(placeObj);
  		}
  	};

  	//search for locations from the list
    this.filterMarkers = function(){
    	if(screen.width >= 450) {
        	$("#locations").show();
    	}
  		
  		var searchInput = self.userInput().toLowerCase();
  		self.visibleLocations.removeAll();

  		self.allLocations.forEach(function(place) {
  			place.marker.setVisible(false);

  			if(place.locationName.toLowerCase().indexOf(searchInput) !== -1){
  				self.visibleLocations.push(place);
  			}
  		});
  		
  		self.visibleLocations().forEach(function(place) {
  			place.marker.setVisible(true);
  		});
  		self.hideEmptyDiv();
  	};

  	this.clearMarkers = function(){
  		for (var i = 0; i < markers.length; i++) {
    		markers[i].setVisible(false);
    	}
  	};

  	this.animateMarker = function(clickedLocation){
  		clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
	    setTimeout(function() {
	      	clickedLocation.marker.setAnimation(null);
	    }, 1000);
  	};

  	this.showLocation = function(clickedLocation) {
  		self.showInfoWindowContent(clickedLocation);
  		self.animateMarker(clickedLocation);
  	};
};

function startApp(){
	var mapView = new initMap();
	ko.applyBindings(new ViewModel(mapView));
};

function googleError(){
	alert("Error! Google maps not loaded. Try again!");
}