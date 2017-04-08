$(document).ready(function() {

    var config = {
        apiKey: "AIzaSyCsDQwdx7-Xef36ZuB8RR8muiQhL0TMTEE",
        authDomain: "restaurant-roulette-e48d8.firebaseapp.com",
        databaseURL: "https://restaurant-roulette-e48d8.firebaseio.com",
        projectId: "restaurant-roulette-e48d8",
        storageBucket: "restaurant-roulette-e48d8.appspot.com",
        messagingSenderId: "559745798878"
    };
    firebase.initializeApp(config);




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

        // var request = {
        //     location: coords,
        //     radius: '500'

        // };

        myLocation.latitude = myLat;
        myLocation.longitude = myLong;

    }



    function failure() {
        $('#lat').html("<p>It didnt't work, co-ordinates not available!</p>");
    }



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

   

    function initialize() {
        var latLng = new google.maps.LatLng({ location_latitude }, { location_longitude });
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 16,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    };





    // FOURSQUARE API
    $(".spin").on("click", function(spin) {

        var queryURL = "https://api.foursquare.com/v2/venues/search?";
        var clientID = "1FJHV4PFHEKFZBZSQYSMR4HIQROYJQQWBVFJEOOYPK0VHZ4E";
        var clientSecret = "MDXKXS4BVTHR13UBMRLJ35PENUSFUDDFZXMHN2IZCDCDBVEZ";
        var searchURL = queryURL + "categoryId=4d4b7105d754a06374d81259&ll=" + myLocation.latitude + "," + myLocation.longitude + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20181231" + "&limit=1000";


        $.ajax({
                url: searchURL,
                method: "GET",
                dataType: "json",
            })
            .done(function(response) {
                console.log(response);
                var venues = response.response.venues;





                for (i = 0; i < venues.length; i++) {
                    var location = venues[i].location.lat;

                    var lati = venues[i].location.lat;
                    var longi = venues[i].location.lng;

                    var marker = new google.maps.Marker({
                        position: {lat: lati, lng: longi},
                        map: map,
                        label: i
                    });

                    marker.setMap(map);

                    console.log(marker.setPosition);

                    //}
                }

            });

    });
});
