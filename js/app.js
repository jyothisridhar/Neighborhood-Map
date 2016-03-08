"use strict";

//Default locations when page is loaded
var initialLocations = ['Bangalore Palace',
                        'Bangalore Golf club',
                        'Smally\'s resto cafe',
                        'B Flat, bangalore',
                        'Church street Social, bangalore',
                        'Chutney chang, museum road, bangalore',
                        'Hard rock cafe, bangalore',
                        'The humming Tree, Bangalore',
                        'Toit, bangalore',
                        'Windmills craftworks'];

//Array of markers
var markers = [];

//Place constructor for each location
var Place = function(placeName){
    this.locationName = placeName;
    this.placeServiceData = null;
    this.marker = null;
    this.infoWindowContent = '';
};

/**
  * @desc Knockout viewmodel handling operations on UI
  * @param mapView - map object
*/
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
        $('.locations:empty').hide();
    };

    //get marker and infowindow data from map view
    this.pinMap = function(place){
        var setGoogleData = function(data) {
            place.placeServiceData = data;
            mapView.createMapMarker(place.placeServiceData, setMarkerData);
        };

        var setMarkerData = function(mData, infoData){
            place.marker = mData;
            place.infoWindowContent = infoData;
        };

        mapView.googlePlaceSearch(place, setGoogleData);
    };

    //Generate map markers for each location in the array
    this.allLocations.forEach(function(place) {
        self.visibleLocations.push(place);
        self.pinMap(place);
    });

    this.showInfoWindowContent = function(location) {
        mapView.infoWindow.setContent(location.infoWindowContent);
        mapView.infoWindow.open(map, location.marker);
    };

    //Search location and create markers for locations not in the list
    this.searchLocation = function(formElement) {
        self.clearMarkers();
        var placeObj = new Place(self.searchText());
        self.pinMap(placeObj);
        self.hideEmptyDiv();  //hide div if list is empty
    };

    //Search for locations from the list
    this.filterMarkers = function(){
        // if(screen.width >= 450) {
        //     $(".locations").show();
        // }

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
        //stop animation after 2 bounces
        setTimeout(function() {
            clickedLocation.marker.setAnimation(null);
        }, 1400);
    };

    //Show marker and info window for location selected from the list
    this.showLocation = function(clickedLocation) {
        self.showInfoWindowContent(clickedLocation);
        self.animateMarker(clickedLocation);
    };
};

//startApp is called when page is loaded
function startApp(){
    var mapView = new initMap();
    //Activates knockout.js
    ko.applyBindings(new ViewModel(mapView));
}

function googleError(){
    alert("Error! Google maps not loaded. Try again!");
}