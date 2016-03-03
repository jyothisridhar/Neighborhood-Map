var map;
function initMap() {
    var self = this;

	  map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(12.978825,77.599719),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    var bounds = new google.maps.LatLngBounds();

    this.infoWindow = new google.maps.InfoWindow({
        maxWidth: 200
    });

    self.createMapMarker = function(placeData, setMarkerData){
      console.log("step 5 in createMapMarker");

        var lat = placeData.geometry.location.lat();  // latitude from the place service
        var lon = placeData.geometry.location.lng();  // longitude from the place service
        var name = placeData.name;   // name of the place from the place service

        var client_id = '1JM24EFDXPAAABQRAZQD5MBRRNDONBTF1ZBCX0SDPE2P5XND';
        var client_secret = 'S4AYKN2LZIJEGLKXCSWGQAOOBDVAYGPC2HU11DRPSGRBSFQ0';
        var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search?client_id=' + client_id +
                             '&client_secret=' + client_secret + '&v=20130815&ll=' + lat + ',' + lon + 
                             '&query=' + name + '&limit=1';
        var infoContentStr = '';

        // marker is an object with additional data about the pin for a single location
        var marker = new google.maps.Marker({
  	        map: map,
  	        position: placeData.geometry.location,
  	        title: name,
  	        animation: google.maps.Animation.DROP,
        });

        markers.push(marker);

        //get four square data
        $.getJSON(fourSquareUrl, function(data){
          console.log("step 6 in get json createMapMarker");
            var venueDetails = data.response.venues[0];
            infoContentStr = '<div><p><b>' + name +'</b></p><p>' + '<a href="' + venueDetails.url +'">' + venueDetails.url+ '</a></p>' + 
                             '<p>' + venueDetails.location.formattedAddress + '</p>' +
                             '<p>' +venueDetails.photos + '</p>' +
                             '</div>';
        });

        google.maps.event.addListener(marker, 'click', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            self.infoWindow.setContent(infoContentStr);
            self.infoWindow.open(map, marker);
            setTimeout(function() {
                marker.setAnimation(null)
            }, 1000);
        });

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

    self.googlePlaceSearch = function(place, setGoogleData) {
        console.log("step3 in placesearch");
        var bangalore = new google.maps.LatLng(12.978825, 77.599719);
      	var service = new google.maps.places.PlacesService(map);

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
};