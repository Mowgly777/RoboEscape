import Phaser from "phaser";
import arrowUp from "./assets/arrowUp.png";
import arrowLeft from "./assets/arrowLeft.png";
import arrowDown from "./assets/arrowDown.png";
import arrowRight from "./assets/arrowRight.png";
import runBtn from "./assets/button.png";
import roboImg from "./assets/robot.png";
import tile from "./assets/tile.png";
import grid from "./assets/grid.csv";

let robotMovement = [];

function preload() {
  this.load.image("arrowUp", arrowUp);
  this.load.image("arrowDown", arrowDown);
  this.load.image("arrowLeft", arrowLeft);
  this.load.image("arrowRight", arrowRight);
  this.load.image("runBtn", runBtn);
  this.load.image("robo", roboImg);

  // GRID
  this.load.image('tiles', './src/assets/drawtiles-spaced.png');
  this.load.tilemapCSV('map', './src/assets/grid.csv');
}

function create() {
  // GRID
  var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
  var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
  var layer = map.createStaticLayer(0, tileset, 0, 0);

  // DRAG DROP
  initImgs(this);
  this.input.topOnly = true;

  this.input.on('dragstart', function (pointer, gameObject) {

    this.children.bringToTop(gameObject);

  }, this);

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

    gameObject.x = dragX;
    gameObject.y = dragY;

  });

  var zone = this.add.zone(350, 15, 40, 40).setRectangleDropZone(40, 40);
  var graphics = this.add.graphics();
  initZone(zone, graphics);

  this.input.on('dragenter', function (pointer, gameObject, dropZone) {
    initZone(zone, graphics);
    zoneEntered(dropZone, graphics);
  });

  this.input.on('dragleave', function (pointer, gameObject, dropZone) {
    initZone(zone, graphics);
  });

  this.input.on('drop', function (pointer, gameObject, dropZone) {
    initImg(gameObject.texture.key, this, gameObject.input.dragStartX, gameObject.input.dragStartY);

    gameObject.x = dropZone.x;
    gameObject.y = dropZone.y;
    robotMovement.push(gameObject.texture.key);
    gameObject.input.enabled = false;
    underZone(zone, graphics);
  }, this);

  this.input.on('dragend', function (pointer, gameObject, dropped) {

    if (!dropped) {
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
    }

  });


  // Robot
  var robot = this.add.image(32 + 16, 32 + 16, "robo");
  robot.displayHeight = 32;
  robot.displayWidth = 32;

  var runBtn = this.add.image(390, 35, "runBtn");
  runBtn.displayHeight = 60;
  runBtn.displayWidth = 60;
  this.children.bringToTop(runBtn);

  this.input.on('pointerup', function (pointer) {

    if (pointer.downX >= 300) {

      robotMovement.push('DONE');
      console.log('pointerUp');
      var index = 0;
      var x = robot.x;
      var y = robot.y;
      console.log("X", robot.x);
      console.log("X", robot.y);
      for (index = 0; index < robotMovement.length; index++) {
        setTimeout((posIndex) => {
          if (robotMovement[posIndex] === 'arrowUp') {
            robot.y = robot.y - 32;
            if (robot.y < 16 + 32) {
              reset(this, zone, graphics, robot);
            }
          } else if (robotMovement[posIndex] === 'arrowDown') {
            robot.y = robot.y + 32;
            if (robot.y > 7 * 32) {
              reset(this, zone, graphics, robot);
            }
          } else if (robotMovement[posIndex] === 'arrowLeft') {
            robot.x = robot.x - 32;
            if (robot.x < 16 + 32) {
              reset(this, zone, graphics, robot);
            }
          } else if (robotMovement[posIndex] === 'arrowRight') {
            robot.x = robot.x + 32;
            if (robot.y > 7 * 32) {
              reset(this, zone, graphics, robot);
            }
          } else if (robotMovement[posIndex] === 'DONE') {
            robotMovement = [];
          }
        }, 500 * index, index);
      }
    }

  }, this);
}

function reset(context, zone, graphics, robot) {
  // graphics.clear();
  // initImgs(context);
  // zone = context.add.zone(350, 15, 40, 40).setRectangleDropZone(40, 40);
  // graphics = context.add.graphics();
  // initZone(zone, graphics);
  // robot = context.add.image(32 + 16, 32 + 16, "robo");
  // robot.displayHeight = 32;
  // robot.displayWidth = 32;

  // const runBtn = context.add.image(390, 35, "runBtn");
  // runBtn.displayHeight = 60;
  // runBtn.displayWidth = 60;
  // context.children.bringToTop(runBtn);
  alert('Please press F5 to try again');
}

function initImgs(context) {
  initImg("arrowUp", context, 275, 15);
  initImg("arrowLeft", context, 275, 50);
  initImg("arrowDown", context, 275, 85);
  initImg("arrowRight", context, 275, 120);
};

function initImg(imgName, context, x, y) {
  const img = context.add.image(x, y, imgName).setInteractive();
  img.displayHeight = 30;
  img.displayWidth = 30;
  context.input.setDraggable(img);
}

function initZone(zone, graphics) {

  graphics.clear();
  graphics.lineStyle(2, 0xff0000);
  graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

}

function underZone(zone, config) {
  zone.y += 30;
  initZone(zone, config);
}

function zoneEntered(zone, graphics) {
  graphics.lineStyle(2, 0x0000ff);
  graphics.strokeRect(zone.x - zone.input.hitArea.width / 2, zone.y - zone.input.hitArea.height / 2, zone.input.hitArea.width, zone.input.hitArea.height);

}

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  pixelArt: true,
  width: window.innerWidth,
  height: window.innerHeight,
  scene: {
    preload: preload,
    create: create
  },
  backgroundColor: '#ffffff'
};

const game = new Phaser.Game(config);
