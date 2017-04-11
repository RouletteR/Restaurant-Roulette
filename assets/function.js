$(document).ready(function() {
   
   // Initialize Firebase
  var config = {
    apiKey: "AIzaSyCEHf6cYW1NSDcoZ2Jpgv4qv7yzG07LHIE",
    authDomain: "restaurantroulet-1491174705978.firebaseapp.com",
    databaseURL: "https://restaurantroulet-1491174705978.firebaseio.com",
    projectId: "restaurantroulet-1491174705978",
    storageBucket: "restaurantroulet-1491174705978.appspot.com",
    messagingSenderId: "1096863395822"
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
    if (navigator.geolocation) {
        console.log("Executing coordinate fetch");
        navigator.geolocation.getCurrentPosition(success, failure, { maximumAge: 600000, timeout: 5000, enableHighAccuracy: true });
        console.log("Mylocation: " + myLocation.latitude + " ++ " + myLocation.longitude);
    } else {
        //if its not enabled keep track so we can do sensible things like ask their zipcode
        //and... we might want their zipcode anyway if they are trying to establish results for some other place
        console.log("No support for nav coord");
        supportsNav = false;
    }


    // ZOMATO API TOKEN
    var zomatoToken = "d42b7e77b526d7fac0fbd3cdb6d93ab6";
    var zCities = "";
    var zCuisines = "";

    function getCities() {
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

    function getCuisines(position) {
        //setup remote call to get cuisines from zomato, this requires
        //our user token as a header for authentication
        $.ajax({
                beforeSend: function(request) {
                    request.setRequestHeader("user-key", zomatoToken);
                },
                method: "GET",
                dataType: "json",
                url: "https://developers.zomato.com/api/v2.1/cuisines?lat=" + position.coords.latitude + "&lon=" + position.coords.longitude,

            })
            .done(function(msg) {
                //Assign the return object array of cuisines to zCuisines for readability
                zCuisines = msg.cuisines;
                //iterate through the returned cuisines
                for (i = 0; i < zCuisines.length; i++) {
                    //set names for vars so we dont have to constantly make long calls
                    var cID = zCuisines[i].cuisine.cuisine_id;
                    var cName = zCuisines[i].cuisine.cuisine_name;
                    //create a new div for selection using the values returned from cuisine
                    var newCatDiv = "<div id=\"catClass\">";
                    newCatDiv += "  <input type=\"checkbox\" ";
                    newCatDiv += "  name=\"cuisinelist\" id=\"" + cName + "\" value=\"" + cID + "\"></input>";
                    newCatDiv += "  <label for=\"" + cName + "\">" + cName + "</label>";
                    newCatDiv += "</div>";
                    console.log(newCatDiv);
                    //Append our new cuisine category to the existing div
                    $(newCatDiv).appendTo("div.cuisine-cats");
                }
            });
    }

    function success(position) {
        console.log("Position: " + position);
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
            if (marker.getAnimation() !== null) {
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

        console.log("Failed to get location");

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
            zoom: 4,
            center: latLng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

    };

    // SPINNG THE WHEEL FUNCTIONS
    $(".spin").on("click", function(spin) {

        var zQueryUrl = "https://developers.zomato.com/api/v2.1/search?";
        zQueryUrl += "count=20&lat=myLocation.latitude&lon=myLocation.longitude&cuisines=1%2C6&sort=cost&order=desc";

        //setup our remote url with appropriate arguments for long and lat
        var zQueryUrl = "https://developers.zomato.com/api/v2.1/search?";
        zQueryUrl += "count=20&lat=" + myLocation.latitude + "&lon=" + myLocation.longitude + "&sort=cost&order=desc";
        /*We also need to determine if any categories have been clicked and assign
         * them to the search get parameter in a comma seperated list
         */
        var cSelections = [];
        var hasCuisines = false;
        $("div#catClass input:checked").each(function() {
            cSelections.push($(this).attr('value'));
            hasCuisines = true;
        });
        var checkCuisineCats = "";
        //Only modify the remote url if we have checkboxes checked
        if (hasCuisines) {
            for (i = 0; i < cSelections.length; i++) {
                if (i == 0) {
                    //because these need to be comma seperated values we need a way to distinguish the start query param
                    checkCuisineCats = "&cuisines=" + cSelections[i];
                } else {
                    checkCuisineCats += "," + cSelections[i];
                }
            }
            //And add the new cuisine categories to the zQueryUrl for the remote zomato call
            zQueryUrl += checkCuisineCats;
        }

        console.log("printing cselections");
        console.log(cSelections);


        console.log("location long: " + myLocation.longitude);
        console.log("location lat: " + myLocation.latitude);

        console.log(zQueryUrl);
        $.ajax({
                url: zQueryUrl,
                beforeSend: function(request) {
                    request.setRequestHeader("user-key", zomatoToken);
                },
                method: "GET",
                dataType: "json",
            })
            .done(function(response) {
                //Assign reponse restaurants array to venues to simplify naming
                var venues = response.restaurants;


                //iterate venues array for individual restaurants
                //ok iteration with a for loop was awesome for showing all the location...
                //but... we want to pick just one... at random even. so...

                var i = Math.floor((Math.random() * venues.length));


                //for (i = 0; i < venues.length; i++) {
                //console.log(venues[i].restaurant.location);
                //var location = venues[i].restaurant.location;

                var lati = parseFloat(venues[i].restaurant.location.latitude);
                var longi = parseFloat(venues[i].restaurant.location.longitude);


                var resTitle = "<a href=\"" + venues[i].restaurant.url + "\">";
                    resTitle += venues[i].restaurant.name;
                    resTitle += "</a>";

                var resAddress = "<a href=\"" + venues[i].restaurant.url + "\"";
                    resAddress += venues[i].restaurant.location.address;
                    resAddress += "</a>";

                var resPhone = "<a href=\"" + venues[i].restaurant.phone_numbers + "\"";
                    resPhone += venues[i].restaurant.phone_numbers;
                    resPhone += "</a>";

                var resRating = "<a href=\"" + venues[i].restaurant.user_rating.aggregate_rating + "\"";
                    resRating += venues[i].restaurant.user_rating.aggregate_rating;
                    resRating += "</a>";

                var resCost = "<a href=\"" + venues[i].restaurant.url + "\"";
                    resCost += venues[i].restaurant.average_cost_for_two;
                    resCost += "</a>";

                console.log(venues[i].restaurant);
                console.log(venues[i].restaurant.phone_numbers);

                // this string is designed to populate the balloon over the google maps marker
                var contentString = '<div id="content">' +
                    '<div id="siteNotice">' +
                    '</div>' +
                    '<div id="bodyContent">' +
                    venues[i].restaurant.name + '<br>' +
                    venues[i].restaurant.location.address + '<br>' +
                    venues[i].restaurant.phone_numbers + '<br>' +
                    'Average user rating on a 1 to 5 scale ' + venues[i].restaurant.user_rating.aggregate_rating + '<br>' +
                    'Average cost for two $' + venues[i].restaurant.average_cost_for_two + 
                    '</div>';

                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                });


                var marker = new google.maps.Marker({
                    position: { lat: lati, lng: longi },
                    map: map,
                    title: venues[i].restaurant.name,
                });
                marker.addListener('click', function() {
                    infowindow.open(map, marker);
                });

                //push thumbtack to google map... we prob should recenter
                //the map view to the new location.
                marker.setMap(map);

                //recenter to include the new location
                if (!map.getBounds().contains(marker.getPosition())) {
                    map.panTo(marker.getPosition());
                }

                //where did we put it?
                console.log(marker.setPosition);
                //}
                //}
                // google.maps.event.addDomListener(window, 'load', initialize);




                //}




            });
    });
});
