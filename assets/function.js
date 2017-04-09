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
    var supportsNav = true;

    //var cuisine = document.getElementById("cuisine-topics")

    //create object for navigator if its enabled for this user
    if(navigator.geolocation){
        var userCoordinates = navigator.geolocation.getCurrentPosition(success, failure);
    } else {
        //if its not enabled keep track so we can do sensible things like ask their zipcode
        //and... we might want their zipcode anyway if they are trying to establish results for some other place
        supportsNav = false;
    }

    var zomatoToken = "d42b7e77b526d7fac0fbd3cdb6d93ab6";
    var zCities = "";
    var zCuisines = "";

    function getCities(){
        $.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("user-key", zomatoToken);
            },
            url: "https://api.zomato.com/v2.1/cities",
            processData: false,
            success: function(msg) {
                zCities = JSON.parse(msg);
            }
        });
    }

    function getCuisines(position){
        console.log(position);
        $.ajax({
            beforeSend: function(request) {
                 request.setRequestHeader("user-key", zomatoToken);
            },
            method: "GET",
            dataType: "json",
            url: "https://api.zomato.com/v2.1/cuisines?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude,
            dataType: "jsonp",
        })
        .done(function(msg) {
            zCuisines = JSON.parse(msg);
            console.log(zCuisines);
            for (i = 0; i < zCuisines.cuisines.length; i++) {
                var cID = zCuisines[i].cuisine_id;
                var cName = zCuisines[i].cuisine_name;
                var newCatDiv  = "<div class=\"catClass\">";
                    newCatDiv += "  <input type=\"checkbox\" ";
                    newCatDiv += "  name=\"" + cName + "\" id=\"" + cName + "\" value=\"" + cID + "\"></input>";
                    newCatDiv += "  <label for=\"" + cName + "\">" + cName + "</label>";
                    newCatDiv += "</div>";
                $("div#cuisine-cats").children.clone.appendTo("div#cuisine-cats");
                console.log("from zCuisines we found: Cid: " + cID + " CName: " + cName);
            }
        });
    }

    function success(position) {
        var myLat = position.coords.latitude;
        var myLong = position.coords.longitude;

        getCuisines(position);

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

        var marker = new google.maps.Marker({
            map: map,
            position: coords,
            animation: google.maps.Animation.DROP
        });
        marker.addListener('load', toggleBounce);

        function toggleBounce() {
            if (marker.getAnimation() !==null) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }

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

        var zQueryUrl  = "https://developers.zomato.com/api/v2.1/search?";
            zQueryUrl += "count=20&lat=myLocation.latitude&lon=myLocation.longitude&cuisines=1%2C6&sort=cost&order=desc";

        var queryURL = "https://api.foursquare.com/v2/venues/search?";
        var clientID = "1FJHV4PFHEKFZBZSQYSMR4HIQROYJQQWBVFJEOOYPK0VHZ4E";
        var clientSecret = "MDXKXS4BVTHR13UBMRLJ35PENUSFUDDFZXMHN2IZCDCDBVEZ";

        var searchURL = queryURL + "categoryId=4d4b7105d754a06374d81259&ll=" + myLocation.latitude + "," + myLocation.longitude + "&client_id=" + clientID + "&client_secret=" + clientSecret + "&v=20181231" + "&limit=10" + "&radius=16093.4";



        $.ajax({
                url: zQueryURL,
                beforeSend: function(request) {
                    request.setRequestHeader("user-key", zomatoToken);
                },
                method: "GET",
                dataType: "json",
            })
            .done(function(response) {
                console.log(response);
                var venues = response.restaurants;
                //window.eqfeed_callback = function(results) {




                for (i = 0; i < venues.length; i++) {
                    var location = venues[i].location.latitude;

                    var lati = venues[i].location.latitude;
                    var longi = venues[i].location.longitude;

                    var marker = new google.maps.Marker({
                        position: { lat: lati, lng: longi },
                        map: map
                    });

                    marker.setMap(map);

                    console.log(marker.setPosition);

                    //}
                }
                // google.maps.event.addDomListener(window, 'load', initialize);

            });

    });
});
