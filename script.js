
var GameSettings = {
    width: 20,
    height: 20,
    solidWalls: false,
    apple_pos: {left: 2, top: 2},
    forceQuit: false,
}

function sliderInput(input, outputId){
    document.getElementById(outputId).innerHTML = input;
    
}
function applySettings(settings){
    settings.width = parseInt(document.getElementById(`i-width`).value);
    settings.height = parseInt(document.getElementById(`i-height`).value);
    settings.solidWalls = document.getElementById("i-solid").checked;
    settings.apple_pos= {left: 2, top: 2}

    console.log(settings);
    fieldLoad(document.getElementById(`field`), GameSettings);
    settings.forceQuit = true;

}
function fieldLoad(field, settings = {}){
    var size = 20
    console.log("loading");
    console.log(field);
    style = field.style;
    style.width = `${size * settings.width}px`;
    style.height = `${size*settings.height}px`;
    if (settings.solidWalls) {
        style.border = `double white 6px`;
    }
    else{
        style.border = `none`;
    }
}
function updateMaxSize() {
    var width = document.getElementById("i-width");
    var height = document.getElementById("i-height");
    var game = document.getElementById("game");
    width.max = Math.floor((game.offsetWidth - 40 - 150) / 20);
    height.max = Math.floor((game.offsetHeight - 40) / 20);
}
function onLoad() {
    fieldLoad(document.getElementById(`field`), GameSettings);
    updateMaxSize();
}
function onResize() {
    updateMaxSize();
}

//Game:
function gameInputs(e,gameloop, direction, body) {
    console.log(e);
    if (e.key == "Escape" || e.key == `q`) {
        gameOver(gameloop, body)
        document.removeEventListener(`keypress`, function(e){gameInputs(e, loop, direction, body)});
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
function moveSnake(direction, position, body =[], loop) {
    var notEaten = true;
    var nBody = Object.assign({}, position);
    position.top += direction.top;
    position.left += direction.left;
    if (GameSettings.solidWalls == false){
        posMod(position);
    }
    body.push(nBody);
    
    document.getElementById(`snake`).innerHTML += `<div class="sBody sPart" style="transform: translate(${nBody.left * 20}px, ${nBody.top *20}px);"></div>`;
    if (position.top == GameSettings.apple_pos.top && position.left == GameSettings.apple_pos.left) {
        console.log(`succes`);
        GameSettings.apple_pos = randomPos(GameSettings.width, GameSettings.height)
        document.getElementById(`apple`).style.transform = `translate(${GameSettings.apple_pos.left * 20}px, ${GameSettings.apple_pos.top *20}px)`
        notEaten = false;
    }
    if (notEaten == true) {
        var wBody = document.getElementsByClassName(`sBody`);
        wBody[0].remove();
        body.shift();
    }
    checkCollision(loop, position, body).then(function(result){
        if (result) {
            document.getElementById(`score-value`).innerText = result
        }
    })
    var head = document.getElementById(`sHead`);
    head.style.transform = `translate(${position.left * 20}px, ${position.top *20}px)`
    console.log(body.length);

}
function startGame(){
    document.removeEventListener(`keydown`, startGame);
    var position = {left: 5, top: 5};
    var direction = {top: -1, left: 0};
    var body = [{left: 5, top:  6}];
    //document.addEventListener(`keypress`, function(e){gameInputs(e, loop, direction, body)}, true);
    registerEventListener(document, {event: `keypress`,callback: function(e){gameInputs(e, loop, direction, body)}})
    var loop = self.setInterval(function(){moveSnake(direction, position, body, loop);}, 300);
    
}
document.addEventListener(`keydown`, startGame);


function randomPos(width, height){
    var x= Math.floor(Math.random() * width);
    var y= Math.floor(Math.random() * height);
    return {left: x, top: y};
}
function checkCollision(loop, headPos, body =[]) {
    return new Promise(resolve => {
        body.forEach(part => {
            if (part.left == headPos.left && part.top == headPos.top) {
                gameOver(loop, body);
                resolve(false);
                console.log(`collision`);
            }
            //console.log(part, headPos);
        });
        if (GameSettings.forceQuit == true) {
            gameOver(loop, body);
            resolve(false);
            console.log(`forced`);
            console.log(GameSettings);
        }
        resolve(body.length);
    });
}
function gameOver(loop, body){
    window.clearInterval(loop)
    document.getElementById(`score-table`).innerHTML += `
    <tr class="tablerow">
        <td>${formatDate()}</td>
        <td class="value">${body.length}</td>
    </tr>`;
    document.getElementById(`field`).innerHTML +=`
    <div id="gameOver-field">
    </div>
    <H1> Game Over!! <br> </H1>
    <p> press any key to restart </p>`;
    //document.removeEventListener(`keypress`, function(e){gameInputs(e, loop, direction, body)});
    unRegisterAllEventListeners(document)
    setTimeout(() => {document.addEventListener(`keypress`, restartGame);
    }, 1000);
}
function formatDate() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}
function restartGame() {
    
    document.removeEventListener(`keypress`, restartGame);
    document.getElementById(`field`).innerHTML = `
    <div id="snake">
        <div id="sHead" class="sHead sPart" style="transform: translate(100px, 100px);" ></div>
        <div class="sBody sPart" style="transform: translate(100px, 120px);"></div>
    </div>
    <div id="apple" style="transform: translate(40px, 40px);"></div>`
    console.log(`new game`);
    applySettings(GameSettings);
    GameSettings.forceQuit = false;
    startGame();
}

function registerEventListener(obj, params) {
	if ( typeof obj._eventListeners == 'undefined' ) {
		obj._eventListeners = [];	
	}
	
	obj.addEventListener(params.event, params.callback);
	
	var eventListeners = obj._eventListeners;
	eventListeners.push(params);
	obj._eventListeners = eventListeners;
}
function unRegisterAllEventListeners(obj) {
	if ( typeof obj._eventListeners == 'undefined' || obj._eventListeners.length == 0 ) {
		return;	
	}
	
	for(var i = 0, len = obj._eventListeners.length; i < len; i++) {
		var e = obj._eventListeners[i];
		obj.removeEventListener(e.event, e.callback);
	}

	obj._eventListeners = [];
}
