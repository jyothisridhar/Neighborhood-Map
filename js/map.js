//Global map variable
var map;

//Create map view generate custom google map
function initMap() {
    var self = this;

    map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(12.978825,77.599719),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });

    // Listen for resizing of the window and adjust map bounds
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    // Sets the boundaries of the map based on pin locations
    var bounds = new google.maps.LatLngBounds();

    // Instance of infowindow to display more info about a location.
    this.infoWindow = new google.maps.InfoWindow({
        maxWidth: 300
    });

    /**
      * @desc createMapMarker reads Google Places search results to create markers
      * about a single location.
      * @param placeData - object returned from search results containing information
      * @param setMarkerData - optional callback function to pass map data to the view model
    */
    self.createMapMarker = function(placeData, setMarkerData){
        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lon = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.name;                    // name of the place from the place service
        var photos = placeData.photos;                // photos of the place from place service
        var photoUrl = '';                            // Url of place photo
        if(!photos) {
            photoUrl = 'not found';
        }
        else {
            photoUrl = photos[0].getUrl({'maxWidth': 200, 'maxHeight': 200});
        }

        //Client Id and Client secret for foursquare API
        var client_id = '1JM24EFDXPAAABQRAZQD5MBRRNDONBTF1ZBCX0SDPE2P5XND';
        var client_secret = 'S4AYKN2LZIJEGLKXCSWGQAOOBDVAYGPC2HU11DRPSGRBSFQ0';

        //foursquare Url variable for ajax request.
        var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id +
                             '&client_secret=' + client_secret + '&v=20130815&ll=' + lat + ',' + lon + 
                             '&query=' + name + '&limit=1';

        var infoContentStr = '';     //Formatted string for info window content

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
            map: map,
            position: placeData.geometry.location,
            title: name,
            animation: google.maps.Animation.DROP,
        });

        //Add marker into markers array
        markers.push(marker);

        //get JSON encoded data from foursquare
        var jqxhr = $.getJSON(fourSquareUrl, function(data){
            var venueDetails = data.response.venues[0];

            //set the content of infoContentStr for info windows
            if(!venueDetails) {
                infoContentStr = name;
            }
            else {
                if(photoUrl === 'not found') {
                    infoContentStr = '<div><p><b>' + name +'</b></p><p>' + '<a href="' + venueDetails.url +'">' + venueDetails.url+ '</a></p>' + 
                                     '<p>' + venueDetails.location.formattedAddress + '</p>' +
                                     '<p><i>Photo not found</i></p>' +
                                     '</div>';
                }
                else {
                    infoContentStr = '<div><p><b>' + name +'</b></p><p>' + '<a href="' + venueDetails.url +'">' + venueDetails.url+ '</a></p>' + 
                                     '<p>' + venueDetails.location.formattedAddress + '</p>' +
                                     '<img src="' + photoUrl + '">' +
                                     '</div>';
                }
            }
        }).fail(function(jqxhr, textStatus, error) {
            var err = textStatus + "," + error;
            alert("Foursquare request failed: " + err);
        });

        // Listen for marker click
        google.maps.event.addListener(marker, 'click', function() {
            // Bounce marker on click
            marker.setAnimation(google.maps.Animation.BOUNCE);

            // Set the content of infowindow and open it on click.
            self.infoWindow.setContent(infoContentStr);
            self.infoWindow.open(map, marker);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 1000);
        });

        // Callback function to pass marker data to view model
        if(typeof setMarkerData === "function") {
            setMarkerData(marker, name);
        }

        self.infoWindow.setContent(name);
        self.infoWindow.open(map, marker);

        bounds.extend(marker.position);
        // fit the map to the new marker
        map.fitBounds(bounds);
        // center the map
        map.setCenter(bounds.getCenter());
    };

    /**
      * @desc Search maps API for location details
      * @param place - location object
      * @param setGoogleData - callback function
    */
    self.googlePlaceSearch = function(place, setGoogleData) {
        var bangalore = new google.maps.LatLng(12.978825, 77.599719);
        //creates a Google place search service object. PlaceService searches actual location data
        var service = new google.maps.places.PlacesService(map);

        // the search request object
        var request = {
            location: bangalore,
            radius: '5000',
            query: place.locationName
        };

        // Actually searches the Google Maps API for location data and runs the callback
        // function with the search results after each search.
        service.textSearch(request, function(results, status) {
            if (status == google.maps.places.PlacesServiceStatus.OK) {
                if(typeof setGoogleData === "function") {
                    for(var i = 0; i < results.length; i++){
                        setGoogleData(results[i]);
                    }
                }
            }
            else
              console.log("place not found");
        });
    };
}