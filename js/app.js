'use strict';

var initialLocations = [{locationName: 'bowring institue, bangalore'},
						{locationName: 'Church street Social, bangalore'},
						{locationName: 'chutney chang, museum road, bangalore'},
						{locationName: 'hard rock cafe, bangalore'},
						{locationName: 'high court of karnataka, bangalore'},
						{locationName: 'm chinnaswamy stadium, bangalore'}];
var markers = [];

var Place = function(placeObj){
	this.locationName = placeObj.locationName;
	this.placeServiceData = null;
	this.marker = null;
};

var ViewModel = function(mapView){
	var self = this;
	this.allLocations = [];
	this.visibleLocations = ko.observableArray();

	initialLocations.forEach(function(place) {
    	self.allLocations.push(new Place(place));
    });

    this.allLocations.forEach(function(place) {
    	var setGoogleData = function(data) {
    		place.placeServiceData = data;
    		mapView.createMapMarker(place.placeServiceData, setMarkerData);
    	};

    	var setMarkerData = function(data){
    		place.marker = data;
    		console.log(place.marker);
    	};

    	mapView.googlePlaceSearch(place, setGoogleData);
    });

    this.allLocations.forEach(function(place) {
    	self.visibleLocations.push(place);
  	});

  	this.setMapOnAll = function(map) {
	    for (var i = 0; i < markers.length; i++) {
	      markers[i].setMap(map);
	    }
  	};

  	this.clearMarkers = function(){
    	self.setMapOnAll(null);
  	};

  	this.animateMarker = function(clickedLocation){
  		clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
	    setTimeout(function() {
	      	marker.setAnimation(null)
	    }, 1000);
  	};

  	this.showLocation = function(clickedLocation) {
  		self.clearMarkers();
  		mapView.createMapMarker(clickedLocation.placeServiceData);
  		self.animateMarker(clickedLocation);
  	};
};

function startApp(){
	var mapView = new initMap();
	ko.applyBindings(new ViewModel(mapView));
};