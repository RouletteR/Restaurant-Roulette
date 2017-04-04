$(document).ready(function() {
    // Diplays Roulette SVG
    var rouletteSvg = $(".svg").removeClass("hidden");
    $(".s12").prepend(rouletteSvg);

    //Spin Wheel
    $("#spin").on("click", function() {
        var rotation = Math.floor(Math.random() * (1440 - 360) + 360);
        $('.svg').velocity({ rotateZ: "+=" + rotation }, { duration: 3000, easing: "linear", loop: false });
    });
});
