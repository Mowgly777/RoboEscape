import Phaser from "phaser";
import roboImg from "./assets/robo.png";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
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
  robo = this.add.image(100, 150, "robo");
  this.input.on('pointerup', function() {
    robo.x = 500;
    robo.y = 150;
  }, this);

}


