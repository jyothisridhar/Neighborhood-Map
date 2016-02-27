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
	this.infoWindow = null;
};

var ViewModel = function(mapView){
	var self = this;
	this.allLocations = [];
	this.visibleLocations = ko.observableArray();
	this.userInput = ko.observable('');

	initialLocations.forEach(function(place) {
    	self.allLocations.push(new Place(place));
    });

    //get marker and infowindow data from map view
    this.allLocations.forEach(function(place) {
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
    });

    this.allLocations.forEach(function(place) {
    	self.visibleLocations.push(place);
  	});

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

  	// this.setMapOnAll = function(map) {
	  //   for (var i = 0; i < markers.length; i++) {
	  //     markers[i].setMap(map);
	  //   }
  	// };

  	// this.clearMarkers = function(){
   //  	self.setMapOnAll(null);
  	// };

  	this.animateMarker = function(clickedLocation){
  		clickedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
	    setTimeout(function() {
	      	clickedLocation.marker.setAnimation(null);
	    }, 1000);
  	};

  	this.showLocation = function(clickedLocation) {
  		//self.clearMarkers();
  		//mapView.createMapMarker(clickedLocation.placeServiceData);
  		clickedLocation.infoWindow.setContent(clickedLocation.locationName);
  		clickedLocation.infoWindow.open(map, clickedLocation.marker);
  		self.animateMarker(clickedLocation);
  	};
};

function startApp(){
	var mapView = new initMap();
	ko.applyBindings(new ViewModel(mapView));
};