const socket = io.connect('http://localhost:3001');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

buildStadium();
let football;
let clientBalls = {};
let selfID;

socket.on('connect', () => {
    selfID = socket.id;
})

socket.on('updateConnections', players => {
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    playersFound = {};
    for(let id in players){
        if(clientBalls[id] === undefined){
            clientBalls[id] = new Capsule(players[id].x+35, players[id].y, players[id].x-35, players[id].y, 13, 10);
            clientBalls[id].maxSpeed = 7;
            clientBalls[id].score = 0;
            clientBalls[id].no = players[id].no;
            if(clientBalls[id].no === 1){
                clientBalls[id].color = "#3498DB";
            } else if(clientBalls[id].no === 2){
                clientBalls[id].color = "#E74C3C";
            }
            if(id === selfID){
                userInput(clientBalls[id]);
            }
        }
        playersFound[id] = true;
    }
    for(let id in clientBalls){
        if(!playersFound[id]){
            clientBalls[id].remove();
            delete clientBalls[id];
        }
    }
})

socket.on('updateFootball', footballPos => {
    if(football === undefined){
        football = new Ball(footballPos.x, footballPos.y, 13, 10);
        football.color = "#aaa";
    } else {
        football.setPosition(footballPos.x, footballPos.y);
    }
})

socket.on('positionUpdate', playerPos => {
    // console.log("getting ",playerPos);
    for(let id in playerPos){
        if(clientBalls[id] !== undefined){
            clientBalls[id].setPosition(playerPos[id].x, playerPos[id].y, playerPos[id].angle);
        }
    }
})

socket.on('updateScore', scorerId => {
    if (scorerId === null){
        for (let id in clientBalls){
            clientBalls[id].score = 0;
        } 
    } else {
        for (let id in clientBalls){
            if (id === scorerId){
                if(clientBalls[id].no === 1){
                    clientBalls[id].score++;
                } else if(clientBalls[id].no === 2){
                    clientBalls[id].score++;
                }
            }
        }
    }
})

requestAnimationFrame(renderOnly);

function userInterface(){
    ctx.font = "2.5rem Teko";
    ctx.fillStyle = "#fff"
    for (let id in clientBalls){
        if(clientBalls[id].no === 1){
            ctx.fillText(clientBalls[id].score, 20, 45);
            ctx.fillText("Blue", 60, 45);
          } else if(clientBalls[id].no === 2){
            ctx.fillText(clientBalls[id].score, 600, 45);
            ctx.fillText("Red", 520, 45);
        }
    }
}

function buildStadium(){
    new Wall(60, 80, 580, 80);
    new Wall(60, 460, 580, 460);

    new Wall(60, 80, 60, 180);
    new Wall(60, 460, 60, 360);
    new Wall(580, 80, 580, 180);
    new Wall(580, 460, 580, 360);

    new Wall(50, 360, 10, 360);
    new Wall(0, 360, 0, 180);
    new Wall(10, 180, 50, 180);
    new Wall(590, 360, 630, 360);
    new Wall(640, 360, 640, 180);
    new Wall(630, 180, 590, 180);
}