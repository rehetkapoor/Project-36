var dog, happyDog, database, foodS, foodStock
var d, hd
var feed, addFood
var fedTime, lastFed
var foodObj
var changeState, readState
var bedroom, garden, washroom
var currentTime
var gameState
var Background

function preload()
{
  d = loadImage("Dog.png");
  hd = loadImage("happydog.png");
  bedroom = loadImage("Bed Room.png");
  garden = loadImage("Garden.png");
  washroom = loadImage("Wash Room.png");
}

function setup() {
  createCanvas(500, 500);
  Background=createSprite(250, 250, 500, 500);
  Background.visible=false
  dog = createSprite(250, 400, 20, 20);
  dog.addImage(d);
  dog.scale=0.2

  foodObj = new Food();

  database=firebase.database();
  foodStock=database.ref('Food');
  foodStock.on("value", readStock)

  readState=database.ref('gameState');
  readState.on("value", function(data){
    gameState=data.val();
  });

 

  feed=createButton("Feed the dog");
  feed.position(600, 95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(700, 95);
  addFood.mousePressed(addFoods);
}


function draw() {  
  background(color(179, 241, 242));
  
  fedTime=database.ref('FeedTime');
  fedTime.on("value", function(data){
    lastFed=data.val();
  });

  foodObj.display();

  fill(255, 255, 254);
  textSize(15);
  if(lastFed>=12){
    text("Last Fed: " + lastFed%12 + " PM", 350, 30);
  }

  else if(lastFed===0){
    text("Last Fed: 12 AM", 350, 30);
  }

  else{
    text("Last Fed: " + lastFed +" AM", 350, 30);
  }

  if(gameState) {
    if(gameState!=="Hungry"){
      feed.hide();
      addFood.hide();
      dog.remove();
    }else{
      feed.show();
      addFood.show();
      dog.addImage(d);
    }
  }

  currentTime=hour();

  if(currentTime===(lastFed+1)){
    update("Playing");
    Background.visible=true;
    Background.addImage(garden);
  }else if(currentTime===(lastFed+2)){
    update("Bathing");
    Background.visible=true;
    Background.addImage(washroom);
  } else{
    update("Hungry");
  }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(hd);
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  });
}

function update(state){
  database.ref('/').update({
    gameState:state
  })
}