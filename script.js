
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

//Game:
function gameInputs(e,gameloop, direction) {
    console.log(e);
    if (e.key == "Escape" || e.key == `q`) {
        window.clearInterval(gameloop);
    }
    if (e.key == `w` || e.key == `ArrowUp`) {
        if (direction.top != 1) {
            direction.top = -1;
            direction.left = 0;
        }
    }
    if (e.key == `a` || e.key == `ArrowLeft`) {
        if (direction.left != 1) {
            direction.top = 0;
            direction.left = -1;
        }
    }
    if (e.key == `s` || e.key == `ArrowDown`) {
        if (direction.top != -1) {
            direction.top = 1;
            direction.left = 0;
        }
    }
    if (e.key == `d` || e.key == `ArrowRight`) {
        if (direction.left != -1) {
            direction.top = 0;
            direction.left = 1;
        }
    }
    return false
}
function posMod(position) {
    x = position.left;
    y= position.top;
    x %= GameSettings.width;
    y %= GameSettings.height
    position.left = (x < 0) ? x + GameSettings.width : x;
    
    position.top = (y < 0) ? y + GameSettings.height : y;
}
function moveSnake(direction, position, body =[]) {
    var nBody = Object.assign({}, position);
    position.top += direction.top;
    position.left += direction.left;
    if (GameSettings.solidWalls == false){
        posMod(position)
    }
    body.push(nBody)
    body.shift()
    document.getElementById(`snake`).innerHTML += `<div class="sBody sPart" style="transform: translate(${nBody.left * 20}px, ${nBody.top *20}px);"></div>`;
    var wBody = document.getElementsByClassName(`sBody`)
    wBody[0].remove()
    var head = document.getElementById(`sHead`);
    head.style.transform = `translate(${position.left * 20}px, ${position.top *20}px)`

}
function startGame(){
    document.removeEventListener(`keydown`, startGame)
    var position = {top: 5, left: 5}
    var direction = {top: -1, left: 0}
    var body = [{top: 6, left:  5}]
    document.addEventListener(`keypress`, function(e){gameInputs(e, loop, direction)})
    var loop = self.setInterval(function(){moveSnake(direction, position, body)}, 300)
    
}
document.addEventListener(`keydown`, startGame);
