'use strict';
var map;
var initialLocations = [{locationName: 'hard rock cafe, bangalore'},
						{locationName: 'Church street Social, bangalore'},
						{locationName: 'chutney chang, museum road, bangalore'},
						{locationName: 'bowring institue, bangalore'},
						{locationName: 'm chinnaswamy stadium, bangalore'},
						{locationName: 'high court of karnataka, bangalore'}];

function initMap() {
	var self = this;

	map = new google.maps.Map(document.getElementById('map-canvas'), {
      center: {lat: 12.978825, lng: 77.599719},
      zoom: 8
    });
    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });

    var bounds = new google.maps.LatLngBounds();

    self.createMapMarker = function(placeData, setMarkerData){
    	var lat = placeData.geometry.location.lat();  // latitude from the place service
      	var lon = placeData.geometry.location.lng();  // longitude from the place service
      	var name = placeData.name;   // name of the place from the place service

      	// marker is an object with additional data about the pin for a single location
      	var marker = new google.maps.Marker({
	        map: map,
	        position: placeData.geometry.location,
	        title: name,
	        animation: google.maps.Animation.DROP,
      	});

      	var infoWindow = new google.maps.InfoWindow({
        	content: name
      	});

      	google.maps.event.addListener(marker, 'click', function() {
	        marker.setAnimation(google.maps.Animation.BOUNCE);
	        infoWindow.open(map, marker);
	        setTimeout(function() {
	        	marker.setAnimation(null)
	        }, 1000);
      	});

      	if(typeof setMarkerData === "function") {
      		setMarkerData(marker);
      	}
      	// this is where the pin actually gets added to the map.
      	// bounds.extend() takes in a map location object
      	bounds.extend(marker.position);
      	// fit the map to the new marker
      	map.fitBounds(bounds);
      	// center the map
      	map.setCenter(bounds.getCenter());
    };

    self.googlePlaceSearch = function(place, setGoogleData) {
    	var service = new google.maps.places.PlacesService(map);

    	var request = {
        	query: place.locationName
      	};
      	// Actually searches the Google Maps API for location data and runs the callback
      	// function with the search results after each search.
      	service.textSearch(request, function(results, status) {
	        if (status == google.maps.places.PlacesServiceStatus.OK) {
	            setGoogleData(results[0]);
	        }
      	});
    };
};

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
    	};

    	mapView.googlePlaceSearch(place, setGoogleData);
    });

    this.allLocations.forEach(function(place) {
    	self.visibleLocations.push(place);
  	});
};

function startApp(){
	var mapView = new initMap();
	ko.applyBindings(new ViewModel(mapView));
};