$(document).ready(function() {

    // function initMap() {
    //     var map = new google.maps.Map(document.getElementById('map'), {
    //         center: { lat: -34.397, lng: 150.644 },
    //         zoom: 6
    //     });
    //     var infoWindow = new google.maps.InfoWindow({ map: map });

    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(function(position) {
    //             var pos = {
    //                 lat: position.coords.latitude,
    //                 lng: position.coords.longitude
    //             };

    //             infoWindow.setPosition(pos);
    //             infoWindow.setContent('Location found.');
    //             map.setCenter(pos);
    //         }, function() {
    //             handleLocationError(true, infoWindow, map.getCenter());
    //         });
    //     } else {
    //         handleLocationError(false, infoWindow, map.getCenter());
    //     }
    // }

    // function handleLocationError(browserhasGeolocation, infoWindow, pos) {
    //     infoWindow.setPosition(pos);
    //     infoWindow.setContent(browserhasGeolocation ?
    //         'Error: The Geolocation service failed.' :
    //         'Error: Your browser doesn\'t support geolocation.');
    // }


    x = navigator.geolocation;

    x.getCurrentPosition(success, failure);

    function success(position) {
        var mylat = position.coords.latitude;
        var mylong = position.coords.longitude;

        // Google-API-ready latitude and longitude string

        var coords = new google.maps.LatLng(mylat, mylong);

        // Setting up our Google Map

        var mapOptions = {
            zoom: 16,
            center: coords,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Create a marker

        var marker = new google.maps.Marker({ map: map, position: coords });

        var request = {
            location: coords,
            radius: '500'
                // types: ['restaurant']
        };

    }



    // var service = new google.maps.places.PlacesService(map);
    // service.nearbySearch(request, function(results, status) {
    //     if (status == google.maps.places.PlacesServiceStatus.OK) {
    //         for (var i = 0; i < results.length; i++) {
    //             var place = results[i];

    //             var markerResults = new google.maps.Marker({
    //                 map: map,
    //                 position: place.geometry.location
    //             });

    //         }
    //     }
    // });


    function failure() {
        $('#lat').html("<p>It didnt't work, co-ordinates not available!</p>");
    }

    // google.maps.event.addDomListener(window, 'load', initialize);

//ROULETTE WHEEL

    // Diplays Roulette SVG
    var rouletteSvg = $(".svg").removeClass("hidden");

    $("#wheel").prepend(rouletteSvg);

    $('.dropdown-button').dropdown('open');
    $(".svg-container").prepend(rouletteSvg);

    //Spin Wheel
    $("#spin").on("click", function() {
        var rotation = Math.floor(Math.random() * (1440 - 360) + 360);
        $('.svg').velocity({ rotateZ: "+=" + rotation }, { duration: 3000, easing: "linear", loop: false });
    });

// YELP API
var term = $(".dropdown-content").val();
var userLocation = $(".location").val();
var userLat;
var userLong;
var queryURL = "https://api.yelp.com/v2/search?" + term + "=food&location=" + userLocation; //+ "&ll=" + userLat + "," + userLong;
});
