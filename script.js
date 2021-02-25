
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
    fieldLoad(document.getElementById(`field`), GameSettings)

}
function fieldLoad(field, settings = {}){
    var size = 20
    console.log("loading");
    console.log(field);
    style = field.style;
    style.width = `${size * settings.width}px`;
    style.height = `${size*settings.height}px`;
    if (settings.solidWalls) {
        style.border = `double white 6px`
    }
    else{
        style.border = `none`
    }
}
function updateMaxSize() {
    console.log("oui");
    var width = document.getElementById("i-width");
    var height = document.getElementById("i-height");
    var game = document.getElementById("game");
    width.max = Math.floor((game.offsetWidth - 40) / 20);
    height.max = Math.floor((game.offsetHeight - 40) / 20);
}
function onLoad() {
    fieldLoad(document.getElementById(`field`), GameSettings);
    updateMaxSize()
}
function onResize() {
    updateMaxSize()
}