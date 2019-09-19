import Phaser from "phaser";
import arrowUp from "./assets/arrowUp.png";
import arrowLeft from "./assets/arrowLeft.png";
import arrowDown from "./assets/arrowDown.png";
import arrowRight from "./assets/arrowRight.png";
import runBtn from "./assets/run.png";
import roboImg from "./assets/robot.png";
import tile from "./assets/tile.png";
import grid from "./assets/grid.csv";

const robotMovement = [];

function preload() {
  this.load.image("arrowUp", arrowUp);
  this.load.image("arrowDown", arrowDown);
  this.load.image("arrowLeft", arrowLeft);
  this.load.image("arrowRight", arrowRight);
  this.load.image("runBtn", runBtn);
  this.load.image("robo", roboImg);

  // GRID
  this.load.image('tiles', tile);
  this.load.tilemapCSV('map', grid);
}

function create() {
  // GRID
  var map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
  var tileset = map.addTilesetImage('tiles', null, 32, 32, 1, 2);
  var layer = map.createStaticLayer(0, tileset, 0, 0);

  // DRAG DROP
  initImgs(this);
  this.input.topOnly = false;

  this.input.on('dragstart', function (pointer, gameObject) {

    this.children.bringToTop(gameObject);

  }, this);

  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {

    gameObject.x = dragX;
    gameObject.y = dragY;

  });

  var zone = this.add.zone(500, 10, 40, 40).setRectangleDropZone(40, 40);
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
  const robot = this.add.image(60, 100, "robo");
  robot.displayHeight = 32;
  robot.displayWidth = 32;
  const runBtn = this.add.image(20, 160, "runBtn");
  runBtn.displayHeight = 30;
  runBtn.displayWidth = 30;

  this.input.on('pointerup', function (pointer, gameObject) {
    if (gameObject.texture.key === 'runBtn') {
      move(robot);
    }
  }, this);
}

function move(robot) {
  robotMovement.forEach(element => {
    switch (element) {
      case 'arrowUp':
        robot.y -= 32;
        break;
      case 'arrowLeft':
        robot.x -= 32;
        break;
      case 'arrowDown':
        robot.y += 32;
        break;
      case 'arrowRight':
        robot.x += 32;
      default:
        break;
    }
  });
}

function initImgs(context) {
  initImg("arrowUp", context, 20, 20);
  initImg("arrowLeft", context, 20, 55);
  initImg("arrowDown", context, 20, 90);
  initImg("arrowRight", context, 20, 125);
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
  }
};

const game = new Phaser.Game(config);
