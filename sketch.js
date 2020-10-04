var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadImage("trex.png");
  
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("cactus.png");
 
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  

  trex = createSprite(50,height-70,20,50);
  
  trex.addImage(trex_running);
  
  

  trex.scale = 0.1;
  
  ground = createSprite(width/2,height-70,width,2);
  ground.addImage(groundImage);
  ground.scale=0.2
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.2;
  restart.scale = 0.2;
  
  invisibleGround = createSprite(width/2,height-10,width,125);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false
  
  score = 0;
  
}

function draw() {
  trex.debug = true
  background("lightblue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  if(gameState === PLAY){
    //move the 
    gameOver.visible = false;
    restart.visible = false;
    //change the trex animation
     
    ground.velocityX =-(6 + score/100)
    //scoring
    score = score + Math.round(getFrameRate()/50);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/20;
    }
    
    //jump when the space key is pressed
    if(touches.length > 0 && trex.y  >= height-120) {
      jumpSound.play()
      trex.velocityY = -10;
       touches = [];
    }
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        //jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     //change the trex animation
     
       

     
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0); 
     
     if(mousePressedOver(restart)){
       reset();
     }
   }
  
 if(touches.length>0) {      
      reset();
      touches = []
    }
  //stop trex from falling down
  trex.collide(invisibleGround);
  

  drawSprites();
}




function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,height-110,20,30);
   obstacle.velocityX = -(6 + score/100);
   
    obstacle.addImage(obstacle1)
   
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.03;
    obstacle.lifetime = 300;
   obstacle.debug=true
   obstacle.depth = trex.depth;
    trex.depth = trex.depth + 1;
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
 if (frameCount % 70 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(10,220));
    cloud.addImage(cloudImage);
    cloud.scale = 0.05;
    cloud.velocityX = -(6 + score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
   
   
     gameOver.depth = cloud.depth + 1
   restart.depth = cloud.depth + 1
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
 gameState = PLAY
obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score=0
}