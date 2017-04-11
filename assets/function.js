$(document).ready(function() {


// function onSignIn(googleUser) {
//   var profile = googleUser.getBasicProfile();
//   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
//   console.log('Name: ' + profile.getName());
//   console.log('Image URL: ' + profile.getImageUrl());
//   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
// }

// function signOut() {
//     var auth2 = gapi.auth2.getAuthInstance();
//     auth2.signOut().then(function () {
//       console.log('User signed out.');
//     });
//   }


// function renderButton() {

//  gapi.signin2.render('my-signin2', {
//  'scope': 'profile email',
//   'width': 240,
//   'height': 50,
//     'longtitle': true,
//   'theme': 'dark',
//    'onsuccess': onSuccess,
//    'onfailure': onFailure
// });

// var auth2; // The Sign-In object.
// var googleUser; // The current user.

// /**
//  * Calls startAuth after Sign in V2 finishes setting up.
//  */
// var appStart = function() {
//   gapi.load('auth2', initSigninV2);
// };

// /**
//  * Initializes Signin v2 and sets up listeners.
//  */
// var initSigninV2 = function() {
//   auth2 = gapi.auth2.init({
//       client_id: '1096863395822-vafo1gdin0ml7q70hrerlirdtn4g178u.apps.googleusercontent.com',
//       scope: 'profile'
//   });

//   // Listen for sign-in state changes.
//   auth2.isSignedIn.listen(signinChanged);

//   // Listen for changes to current user.
//   auth2.currentUser.listen(userChanged);

//   // Sign in the user if they are currently signed in.
//   if (auth2.isSignedIn.get() == true) {
//     auth2.signIn();
//   }

//   // Start with the current live values.
//   refreshValues();
// };

// *
//  * Listener method for sign-out live value.
//  *
//  * @param {boolean} val the updated signed out state.
 
// var signinChanged = function (val) {
//   console.log('Signin state changed to ', val);
//   document.getElementById('signed-in-cell').innerText = val;
// };

// /**
//  * Listener method for when the user changes.
//  *
//  * @param {GoogleUser} user the updated user.
//  */
// var userChanged = function (user) {
//   console.log('User now: ', user);
//   googleUser = user;
//   updateGoogleUser();
//   document.getElementById('curr-user-cell').innerText =
//     JSON.stringify(user, undefined, 2);
// };

// /**
//  * Updates the properties in the Google User table using the current user.
//  */
// var updateGoogleUser = function () {
//   if (googleUser) {
//     document.getElementById('user-id').innerText = googleUser.getId();
//     document.getElementById('user-scopes').innerText =
//       googleUser.getGrantedScopes();
//     document.getElementById('auth-response').innerText =
//       JSON.stringify(googleUser.getAuthResponse(), undefined, 2);
//   } else {
//     document.getElementById('user-id').innerText = '--';
//     document.getElementById('user-scopes').innerText = '--';
//     document.getElementById('auth-response').innerText = '--';
//   }
// };

// /**
//  * Retrieves the current user and signed in states from the GoogleAuth
//  * object.
//  */
// var refreshValues = function() {
//   if (auth2){
//     console.log('Refreshing values...');

//     googleUser = auth2.currentUser.get();

//     document.getElementById('curr-user-cell').innerText =
//       JSON.stringify(googleUser, undefined, 2);
//     document.getElementById('signed-in-cell').innerText =
//       auth2.isSignedIn.get();

//     updateGoogleUser();
//   }
// }
  

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

<<<<<<< HEAD
=======

>>>>>>> fd353429c52832cc3f848e8d5aa81897ac4b771c
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





    // ZOMATO API
    $(".spin").on("click", function(spin) {

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

                console.log(venues[i].restaurant);

                var marker = new google.maps.Marker({
                    position: { lat: lati, lng: longi },
                    map: map,
                    title: venues[i].restaurant.name,
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

      
