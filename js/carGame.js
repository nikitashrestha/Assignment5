var gameContainer = document.getElementsByClassName('game-container')[0];
var XPOS = [10,63 ,115];
var arrowCount = 1;
var ROADHEIGHT = 300;
var CARHEIGHT = 50;
var CARWIDTH = 30;


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

        this.y += this.dy;
        this.draw();
    }

    reverseDirection(){

        this.y -= this.dy;
        this.draw();
        
    }

    detectYCollision(player){

        if(((this.y+CARHEIGHT)==(ROADHEIGHT-CARHEIGHT)) && (this.x==player.x)){

            console.log("collision Detected");
            return true;

        }

        else{

            return false;

        }
        
    }

    detectXCollision(player){

        if((this.x== player.x) && ((this.y+CARHEIGHT)>=(ROADHEIGHT-CARHEIGHT))){
                
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
        this.obstacles = [];
        this.arrowCount = 1;
        this.roadBgBotttom = 0;
        this.gameOverDiv = null;

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

    createGameOverWindow(){
        
        this.gameOverDiv = document.createElement('div');
        this.gameOverDiv.classList.add('game-over');

        this.gameOverDiv.innerHTML = 'Game Over<br>Do you want to play again???';
        this.gameWindow.appendChild(this.gameOverDiv);

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
            }
        })
    }

    createInstances(){

        this.player.setPosition(XPOS[1],0);
        this.onArrowKeyPressed();
        this.player.draw();

    }

    moveBackground(){

        this.roadBgBotttom -= 5;
        this.roadBg.style.bottom = this.roadBgBotttom+'px';

    }

    createObstacles(playerID){

        var noOfObstacles = getRandomNumber(2,4);
        var that = this;

        for(let i=0 ;i<noOfObstacles; i++){

            if(i == playerID ){

                continue;
                
            }

            var car = new Car(that.road,i,false);
            car.setPosition(XPOS[getRandomNumber(0,3)],getRandomNumber(0,50));
            car.draw();
            that.obstacles.push(car);

        }
    }

    startGame(){

        var that=this;
      
        this.startGameButton.onclick = function(){
            
            that.createInstances();
            that.createObstacles(that.player.id);
            that.gameWindow.removeChild(that.selectCarDiv);
            that.gameWindow.appendChild(that.road);
            that.gameLoop();

        }
    }

    gameLoop(){
        
        var that = this;
        
        var interval = setInterval(function(){

            that.moveBackground();
            that.showScore();

            for (let i=0;i < that.obstacles.length; i++){

                that.obstacles[i].move();
            
                if(that.obstacles[i].detectYCollision(that.player)){

                    clearInterval(interval);
                    that.obstacles[i].reverseDirection();
                    that.player.reverseDirection();
                    that.createGameOverWindow();

                }
                else if(that.obstacles[i].detectXCollision(that.player)){

                    clearInterval(interval);

                }

                if((ROADHEIGHT-that.obstacles[i].y)==0){

                    that.scoreCount++;

                }
            
            }
        
        },100)
    }
}

game = new Game(gameContainer);



