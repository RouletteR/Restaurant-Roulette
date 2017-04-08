$(document).ready(function() {
    var map;
    var venues = {};
    var myLocation = {
        latitude: 0,
        longitude: 0
    };


    x = navigator.geolocation;

    x.getCurrentPosition(success, failure);


    function success(position) {
        var myLat = position.coords.latitude;
        var myLong = position.coords.longitude;

        // Google-API-ready latitude and longitude string

        var coords = new google.maps.LatLng(myLat, myLong);

        // Setting up our Google Map

        var mapOptions = {
            zoom: 16,
            center: coords,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        map = new google.maps.Map(document.getElementById("map"), mapOptions);

        // Create a marker

        var marker = new google.maps.Marker({ map: map, position: coords });

        var request = {
            location: coords,
            radius: '500'

        };

        myLocation.latitude = myLat;
        myLocation.longitude = myLong;

    }



    function failure() {
        $('#lat').html("<p>It didnt't work, co-ordinates not available!</p>");
    }

    // google.maps.event.addDomListener(window, 'load', initialize);

   

    // FOURSQUARE API
    $(".spin").on("click", function() {

        var queryURL = "https://api.foursquare.com/v2/venues/search?";
        var clientID = "1FJHV4PFHEKFZBZSQYSMR4HIQROYJQQWBVFJEOOYPK0VHZ4E";
        var clientSecret = "MDXKXS4BVTHR13UBMRLJ35PENUSFUDDFZXMHN2IZCDCDBVEZ";
        var searchURL = queryURL + "categoryId=4d4b7105d754a06374d81259&ll=" + myLocation.latitude + "," + myLocation.longitude + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20181231";


        $.ajax({
                url: searchURL,
                method: "GET",
                dataType: "json",
            })
            .done(function(response) {
                console.log(response);
                var venues = response.response.venues;
                //window.eqfeed_callback = function(results) {
                for (i = 0; i < venues.length; i++) {
                    var location = venues[i].location.lat;
                    var latLng = google.maps.LatLng(venues[i].location.lat, venues[i].location.long);
                    var marker = new google.maps.Marker({
                        position: latLng,
                        map: map
                    });

                    console.log(location);
                    //}
                }


            });

    });
});

 //ROULETTE WHEEL

    // Diplays Roulette SVG
    var rouletteSvg = $(".svg").removeClass("hidden");

    $("#wheel").prepend(rouletteSvg);

    $('.dropdown-button').dropdown('closed');
    $(".svg-container").prepend(rouletteSvg);

    //Spin Wheel
    $(".spin").on("click", function() {
        var rotation = Math.floor(Math.random() * (1440 - 360) + 360);
        $("#Layer_1").velocity({ rotateZ: "+=" + rotation }, { duration: 3000, easing: "linear", loop: false });
    });
