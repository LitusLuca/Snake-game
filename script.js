
var GameSettings = {
    width: 20,
    height: 20,
    solidWalls: false,
}

function sliderInput(input, outputId){
    document.getElementById(outputId).innerHTML = input;
    
}
function applySettings(settings){
    settings.width = document.getElementById(`i-width`).value;
    settings.height = document.getElementById(`i-height`).value;
    settings.solidWalls = document.getElementById("i-solid").checked;

    console.log(settings);
}
