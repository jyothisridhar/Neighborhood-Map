var map;
function initMap() {
    var self = this;

	  map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: new google.maps.LatLng(12.978825,77.599719),
        zoom: 14,
        mapTypeId: google.maps.MapTypeId.HYBRID
    });
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    var bounds = new google.maps.LatLngBounds();

    this.infoWindow = new google.maps.InfoWindow();

    self.createMapMarker = function(placeData, setMarkerData){
      //console.log("step 6");
        //var markerSelf = this;
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

        markers.push(marker);

        // this.openInfoWindow = function(){
        //     console.log("infoWindow in create marker");
        //     self.infoWindow.setContent(name);
        //     self.infoWindow.open(map, marker);
        // };

        google.maps.event.addListener(marker, 'click', function() {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            self.infoWindow.setContent(name);
            self.infoWindow.open(map, marker);
            setTimeout(function() {
                marker.setAnimation(null)
            }, 1000);
        });

        if(typeof setMarkerData === "function") {
        		setMarkerData(marker);
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