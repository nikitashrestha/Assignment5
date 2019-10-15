var gameContainer = document.getElementsByClassName('game-container')[0];
var XPOS = [10,63 ,115];
var arrowCount = 1;
var ROADHEIGHT = 300;
var CARHEIGHT = 50;
var CARWIDTH = 30;

var keyEvent = {
    left : 'false',
    right : 'false',
    space : 'false'
}

var gamestate = 1;
var carCollision = 0;


function getRandomNumber(min,max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) ) + min;
}


class Car{

    constructor(road,id,isPlayer){

        this.parenElement = road;
        this.car = null;
        this.x = null;
        this.y = null;
        this.dy = 1;
        this.id = id;
        this.isPlayer = isPlayer;
        this.create();
    
    }

    create(){

        this.car = document.createElement('div');
        this.car.style.backgroundImage = 'url("images/'+(this.id+1)+'.png")';
        this.car.classList.add('car');

    }

    setPosition(x,y){

        this.x = x;
        this.y = y;

    }

    move(){
        var that = this;
        var interval = setInterval(function(){
            if(gamestate == 1){
                that.y += that.dy;
                that.draw();
            }
            else{
                clearInterval(interval);
            }
            
        },5000/60);
    }

    reverseDirection(){

        this.y -= this.dy;
        this.draw();
        
    }

    detectYCollision(player){

        if(((this.y+CARHEIGHT)==(ROADHEIGHT-CARHEIGHT)) && (this.x==player.x)){

            return true;

        }

        else{

            return false;

        }
        
    }

    detectXCollision(player){

        if((this.x== player.x) && ((ROADHEIGHT-CARHEIGHT)<=(this.y+CARHEIGHT))){
                
            // player.setPosition()
            return true;
        
        }
        else{
            return false;
        }
    }

    draw(){

        this.car.style.left = this.x + 'px';

        if(this.isPlayer){

            this.car.style.bottom = this.y +'px';
            this.car.style.transform = 'scaleY(-1)';
            this.car.style.filter= 'FlipV';

        }
        else{

            this.car.style.top = this.y + 'px';
        
        }
        
        this.parenElement.appendChild(this.car);
    }

}

class Game{

    constructor(gameContainer){

        this.parenElement = gameContainer;
        this.scoreCount = 0;
        this.carImages = ['1.png','2.png','3.png','4.png'];
        this.carHolder = [];
        this.carImagesTag = [];
        this.player = null;
        this.playerID = null;
        this.obstacles = [];
        this.arrowCount = 1;
        this.roadBgBotttom = 0;
        this.gameOverDiv = null;
        this.yesButton = null;
        this.noButton = null;
        this.bullet = [];

        //creating game elements
        this.scoreBoard = document.createElement('div');
        this.gameWindow = document.createElement('div');
        this.selectCarDiv = document.createElement('div');
        this.selectCarHeader =document.createElement('h1');
        this.startGameButton = document.createElement('button');
        this.road = document.createElement('div');
        this.roadBg = document.createElement('div');
        this.leftLane = document.createElement('div');
        this.midLane = document.createElement('div');
        this.rightLane = document.createElement('div');

        //Adding css property
        this.selectCarDiv.classList.add('select-car');
        this.scoreBoard.classList.add('score-board');
        this.gameWindow.classList.add('game-window');
        this.road.classList.add('road');
        this.roadBg.classList.add('road-bg');
        this.leftLane.classList.add('left-lane');
        this.midLane.classList.add('mid-lane');
        this.rightLane.classList.add('right-lane');
        
        //Adding to DOM
        this.parenElement.appendChild(this.scoreBoard);
        this.parenElement.appendChild(this.gameWindow);
        this.gameWindow.appendChild(this.selectCarDiv);
        this.road.appendChild(this.roadBg);
        this.roadBg.appendChild(this.leftLane);
        this.roadBg.appendChild(this.midLane);
        this.roadBg.appendChild(this.rightLane);

        this.showScore();
        this.createSelectCarWindow();
        
    }

    showScore(){

        this.scoreBoard.innerHTML = 'Score<br>' + this.scoreCount;

    }

    createSelectCarWindow(){

        this.selectCarHeader.innerHTML = 'Select Your Car';
        this.selectCarDiv.appendChild(this.selectCarHeader);

        for(let i=0; i<this.carImages.length; i++){

            this.carHolder[i] = document.createElement('div');
            this.carImagesTag[i] = document.createElement('img');
            this.carImagesTag[i].setAttribute('src','./images/'+this.carImages[i]);

            this.carHolder[i].classList.add('car-holder');
            this.carImagesTag[i].classList.add('car-img');
            this.carHolder[i].setAttribute('id',i);
            this.carHolder[i].appendChild(this.carImagesTag[i]);
            this.selectCarDiv.appendChild(this.carHolder[i]);

        }

        this.selectCarDiv.classList.add('clearfix');
        this.startGameButton.innerHTML = "Start Game";
        this.selectCarDiv.appendChild(this.startGameButton);
        this.selectPlayer();
        this.startGame();
    }

    selectPlayer(){

        var carHolder = this.selectCarDiv.getElementsByTagName('div');
        var that = this;

        for(let i=0; i<carHolder.length; i++){
            
            carHolder[i].onclick = function(){

                that.player = new Car(that.road,i, true);
                carHolder[i].style.border = '1px solid red';
                
            }
        } 
    }
    
    onArrowKeyPressed(){

        var that = this;

        document.addEventListener('keydown', function(event){

            if(event.defaultPrevented){

                return;

            }

            var key = event.key || event.keyCode;
        
            switch(key){

                case 'ArrowLeft':
    
                    if(arrowCount<=0){
    
                        arrowCount=0;

                        that.player.setPosition(XPOS[arrowCount],0);
                        // that.detectXCollision(that.player,that.obstacles)

                    }
                    else{
    
                        arrowCount-=1;
                        that.player.setPosition(XPOS[arrowCount],0);
                    }
                    
                    that.player.draw();
                    break;
    
                case 'ArrowRight':
    
                    if(arrowCount>=2){
    
                        arrowCount = 2;
                        that.player.setPosition(XPOS[arrowCount],0);

                    }
                    else{
    
                        arrowCount+=1;
                        that.player.setPosition(XPOS[arrowCount],0);

                    }
                    
                    that.player.draw();
                    break;
                
                case ' ':
                    keyEvent.space = 'true';
                    break;
            }
        })
    }

    createInstances(){

        this.player.setPosition(XPOS[1],0);
        this.player.draw();

    }

    moveBackground(){

        this.roadBgBotttom -= 5;
        this.roadBg.style.bottom = this.roadBgBotttom+'px';

    }

    createObstacles(playerID){
        var that = this;
        var interval = setInterval(function(){
            var randomCar = getRandomNumber(0,4);
            if(randomCar == playerID && randomCar>=0 && randomCar<3){

                randomCar += 1;

            }

            else if(randomCar==playerID && randomCar>=3)
            {

                randomCar = 2;

            }

            var car = new Car(that.road,randomCar,false);
            car.setPosition(XPOS[getRandomNumber(0,3)],getRandomNumber(-100,-90));

            if(that.obstacles.length>2){

                for(let i=0;i<that.obstacles.length;i++){

                    var diff = car.y - that.obstacles[i].y;
                    if(Math.abs(diff)<=CARHEIGHT){

                        car.y+=diff;

                    }
                }
            }
            that.obstacles.push(car);
        },2000)
    }

    startGame(){

        var that=this;
      
        this.startGameButton.onclick = function(){
            
            that.playerID = that.player.id;
            that.createInstances();
            that.onArrowKeyPressed();
            that.createObstacles(that.player.id);
            that.gameWindow.removeChild(that.selectCarDiv);
            that.gameWindow.appendChild(that.road);
        }
    }

    createGameOverWindow(){
        
        this.gameOverDiv = document.createElement('div');
        this.yesButton = document.createElement('button');
        this.gameOverDiv.classList.add('game-over');
        this.yesButton.classList.add('button-style');


        this.gameOverDiv.innerHTML = '<br><br>Game Over<br><br>Play Again <br><br>';
        this.yesButton.innerHTML = 'Yes';

        this.gameWindow.appendChild(this.gameOverDiv);
        this.gameOverDiv.appendChild(this.yesButton);

        var that = this;
        this.yesButton.onclick = function(){
            document.location.reload() ;
        }
    
    }

    removeOpponentCar(opponentCar,index){

        this.road.removeChild(opponentCar[index].car);
        opponentCar.splice(index,1);
    }

    gameLoop(){

        this.startGame();
        var that = this;

        var interval = setInterval(function(){

            that.moveBackground();
            that.showScore();

            for(let i=0;i<that.obstacles.length;i++){

                if((that.obstacles[i].y-ROADHEIGHT)>=0){

                    that.scoreCount++;
                    that.removeOpponentCar(that.obstacles,i);

                }

                else{

                    that.obstacles[i].move();
                    
                    if(that.obstacles[i].detectYCollision(that.player)){

                        clearInterval(interval);
                        gamestate = 0;
                        that.obstacles[i].reverseDirection();
                        that.player.reverseDirection();
                        that.createGameOverWindow();

                    }
                    else if(that.obstacles[i].detectXCollision(that.player)){

                        clearInterval(interval);
                        gamestate = 0;
                        that.createGameOverWindow();

                    }
                }  
            }
        },100);
    }
}

game = new Game(gameContainer);
game.gameLoop();