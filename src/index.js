import Phaser from "phaser";
import roboImg from "./assets/robo.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 1500,
  height: 1000,
  scene: {
    preload: preload,
    create: create
  }
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("robo", roboImg);
}

var robo; 
function create() {
  robo = this.add.image(100, 500, "robo");
  const arr = ['left','left','left','left','left','left','left','left','left','left','left','right','left','up,','down'];
  
  this.input.on('pointerup', function() {
    console.log('pointerUp');
     var index=0;  
     var x = robo.x;
     var y = robo.y;
     console.log("X",robo.x);
     console.log("X",robo.y);
   for (index = 0; index < arr.length; index++) { 
      console.log(arr[index]);
      setTimeout((posIndex) => {
        if(arr[posIndex]==='left'){
          robo.x =  robo.x +100;
        } else if(arr[posIndex]==='right'){
          robo.x =  robo.x -100;
        }else if(arr[posIndex]==='up'){
          robo.y =  robo.y+100;
        }else if(arr[posIndex]==='down'){
          robo.y =  robo.y-100;
        } 
      },500*index ,index);
      
      console.log(robo.x);
      console.log(robo.y);
  } 

    
  }, this);

}

