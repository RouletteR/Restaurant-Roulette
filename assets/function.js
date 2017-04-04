$(document).ready(function() {
    // Diplays Roulette SVG
    var rouletteSvg = $(".svg").removeClass("hidden");
    $("#wheel").prepend(rouletteSvg);

    $('.dropdown-button').dropdown('open');

    //Spin Wheel
    $("#spin").on("click", function() {
        var rotation = Math.floor(Math.random() * (1440 - 360) + 360);
        $('.svg').velocity({ rotateZ: "+=" + rotation }, { duration: 3000, easing: "linear", loop: false });
    });
});

