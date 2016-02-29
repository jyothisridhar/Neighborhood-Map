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

//To-do: bind search button , search other locations apart from hard coded ones
//3rd party API for more info
var ViewModel = function(mapView){
	var self = this;
	this.allLocations = [];
	this.visibleLocations = ko.observableArray();
	this.userInput = ko.observable('');

	initialLocations.forEach(function(place) {
    	self.allLocations.push(new Place(place));
    });

    this.pinMap = function(place){
    	var setGoogleData = function(data) {
    		place.placeServiceData = data;
    		mapView.createMapMarker(place.placeServiceData, setMarkerData);
    	};

    	var setMarkerData = function(mData, infoData){
    		place.marker = mData;
    		place.infoWindow = infoData;
    		console.log("marker: ",place.marker, "info:", place.infoWindow);
    	};

    	mapView.googlePlaceSearch(place, setGoogleData);
    };

    //get marker and infowindow data from map view
    this.allLocations.forEach(function(place) {
    	self.visibleLocations.push(place);
    	self.pinMap(place);
    });

	this.searchLocation = function(formElement) {
  		var inputText = $("#search").val();
  		var placeObj = new Place(inputText);
  		console.log(placeObj);
  		self.clearMarkers();
  		self.pinMap(placeObj);
  	};

  	//search for locations from the list
  	this.filterMarkers = function(){
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
  	};

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
	      	clickedLocation.marker.setAnimation(null);
	    }, 1000);
  	};

  	this.showLocation = function(clickedLocation) {
  		clickedLocation.infoWindow.setContent(clickedLocation.locationName);
  		clickedLocation.infoWindow.open(map, clickedLocation.marker);
  		self.animateMarker(clickedLocation);
  	};
};

function startApp(){
	var mapView = new initMap();
	ko.applyBindings(new ViewModel(mapView));
};