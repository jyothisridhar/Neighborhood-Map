'use strict';

var initialLocations = ['bowring institue, bangalore',
						'Church street Social, bangalore',
						'chutney chang, museum road, bangalore',
						'hard rock cafe, bangalore',
						'high court of karnataka, bangalore',
						'm chinnaswamy stadium, bangalore'];
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
    	$('#locations:empty').hide();
    }

    //get marker and infowindow data from map view
    this.pinMap = function(place){
    	console.log("step2 in pinMap");
    	var setGoogleData = function(data) {
    		console.log("step 4");
    		place.placeServiceData = data;
    		mapView.createMapMarker(place.placeServiceData, setMarkerData);
    	};

    	var setMarkerData = function(mData, infoData){
    		console.log("step 6");
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
    	console.log("step 7");
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
  		self.showInfoWindowContent(placeObj);
  	};

  	//search for locations from the list
  	this.filterMarkers = function(){
  		$("#locations").show();
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