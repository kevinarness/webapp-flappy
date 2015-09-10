// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(750, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
var score_label;
var player;
var step_size = 100;
var pipes = [];
var weights = [];
var balloons = [];
var cx;
var cy;
var width = 750;
var height = 400;
var gameSpeed = 200;
var gapSize = 100;
var jumpPower = 275;
var gameGravity = 750;
var gapMargin = 50;
var blockHeight = 50;
var pipeEndHeight = 12
var pipeEndExtraWidth = 4
var splashDisplay;
var splashDislpay1;
var stars = [];
var stars1 = [];
var pipeWidth=50;
var bonusWidth=50;


$.get("/score", function (scores) {
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 3; i++) {
        $("#scoreboard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score + " points" +
            "</li>");
    }
});

/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("spam_image", "../assets/home-cat.jpg");
    game.load.image("background_image", "../assets/bubble.png");
    game.load.image("flap", "../assets/black_fish.png");
    game.load.audio("audio1", "../assets/point.ogg");
    game.load.image("pipe", "../assets/pipe2-body.png");
    game.load.image("pipe_end", "../assets/pipe2-end.png");
    game.load.image("weight", "../assets/weight.png");
    game.load.image("balloon", "../assets/blue-balloons.png");
    game.load.image("star", "../assets/star.png");
    game.load.image("star1", "../assets/star1.png");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
// set the background colour of the scene
    game.stage.setBackgroundColor("#C4DFF0");
    var background = game.add.image(0, 0, "background_image");
    background.width = width
    background.height = height
    game.physics.startSystem(Phaser.Physics.ARCADE);

// Score Label
    score_label = game.add.text(50, 0, "0", {font: "30px Arial", fill: "#FFFFFF"});
    player = game.add.sprite(250, 200, "flap");
    player.anchor.setTo(0.5, 0.5);
    game.physics.arcade.enable(player);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.add(start);
    splashDisplay = game.add.text(192, 35, "Press: ENTER to start",{font: "40px Impact", fill: "#FFFFFF"});
    splashDislpay1 = game.add.text(300, 72, "SPACEBAR to jump",{font: "40px Impact", fill: "#FFFFFF"});
}

function start() {
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    splashDisplay.destroy();
    splashDislpay1.destroy();
    player.body.velocity.y = -400;
    player.body.gravity.y = gameGravity;
// Pipe generation
    pipeInterval = 1.75;
    game.time.events.loop(pipeInterval * Phaser.Timer.SECOND, generate);

// Interactions
// Cat spam (optional)
    //game.input.onDown.add(spam);
    //game.input.onDown.add(clicking);
// Modified flap kill

    game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function () {
        player.body.velocity.y = -jumpPower;
    });

    //game.input.keyboard.addKey(Phaser.Keyboard.K).onDown.add(flapkill);
    //game.input.keyboard.addKey(Phaser.Keyboard.R).onDown.add(respawn);
    //game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(space);
// Score Message (not needed0
    //alert(score)
    //game.input.keyboard.addKey(Phaser.Keyboard.RIGHT).onDown.add(move_right);
    //game.input.keyboard.addKey(Phaser.Keyboard.LEFT).onDown.add(move_left);
    //game.input.keyboard.addKey(Phaser.Keyboard.UP).onDown.add(move_up);
    //game.input.keyboard.addKey(Phaser.Keyboard.DOWN).onDown.add(move_down);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    // Check for pipe collision
    //for(var i=pipes.length - 1; i >= 0; i--) {
    //if(pipes[i].body.x - pipeWidth < 0){
    //pipes[i].destroy;
    //pipes.splice(i,1);
    //}
    //}
    game.physics.arcade.overlap(player, pipes, gameOver);
    /*for (var index = 0; index < pipes.length; index++) {
     game.physics.arcade.overlap(player, pipes[index], gameOver);
     }*/
    if (player.body.y < 0 || player.body.y > 400) {
        gameOver();
    }
    player.rotation = Math.atan(player.body.velocity.y / gameSpeed);

    //Code factoring!
    //instead of this:

    //for(var i=balloons.length - 1; i >= 0; i--){
    //game.physics.arcade.overlap(player,balloons[i], function(){
    // We need to do something here!
    //changeGravity(-100);
    //balloons[i].destroy();
    //balloons.splice(i,1);
    //});
    //}
    //for(var i=weights.length - 1; i >= 0; i--){
    //game.physics.arcade.overlap(player,weights[i], function(){
    // We need to do something here!
    //changeGravity(+100);
    //weights[i].destroy();
    //weights.splice(i,1);
    //});
    //}

    //this:

    checkBonus(balloons, -100);
    checkBonus(weights, 100);

    for(var i=stars.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,stars[i], function(){
            stars[i].destroy();
            stars.splice(i,1);
            trackscore();
            game.sound.play("audio1");

        });
    }
    for(var i=stars1.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,stars1[i], function(){
            stars1[i].destroy();
            stars1.splice(i,1);
            trackscore();
            game.sound.play("audio1");
        });
    }
}

//function spam(event) {
//alert("Cat attack! Target at position: " + event.x + "," + event.y);
//for(m =0; m < 79; m++) {
//for(var repeat = 0; repeat < 8; repeat++) {
//var p1 = game.add.sprite(80*m,0+50*i,"spam_image");
//p1.width = 75
//p1.height = 50
//}
//}

//}
//function clicking(event) {
//game.add.sprite(event.x, event.y, "flap")
//}
//function jump() {
//player.body.velocity.y = -jumpPower;
//}
//function flapkill() {
//cx = player.x;
//cy = player.y;
//player.kill();
//}
//function respawn(){
//game.add.sprite(cx,cy,"flap");
//}

function trackscore() {
    score++;
    score_label.setText(score.toString());
    // make the game a little bit harder for every point the player gets
    if(player.body.x < (width / 2)) {
        player.body.x += 5;
    }
}

// Movement
//function move_right(){
//player.x = player.x +step_size;
//}
//function move_left(){
//player.x = player.x -step_size;
//}
//function move_up(){
//player.y = player.y -step_size;
//}
//function move_down(){
//player.y = player.y +step_size;
//}
// To generate random pipes across screen
//function generate_pipe() {
//for(i = 0; i < 7; i ++){
//var gap = game.rnd.integerInRange(1, 4);
//for(var count = 0; count < 8; count ++){
//if(count != gap && count != gap +1){
//game.add.sprite(150 +130*i, 50*count, "pipe");
//}
//}
//}
//}
// To generate single, random pipe

//Bonus or Pipe generation
function generate() {
    var diceRoll = game.rnd.integerInRange(1, 20);
    if(diceRoll==1) {
        balloon_generator();
    } else if(diceRoll==2) {
        weight_generator();
    } else {
        generate_pipe();
    }
}

//Pipe generation
function addPipeBlock(x, y) {
    // create a new pipe block
    var block = game.add.sprite(x, y, "pipe");
    // insert it in the 'pipes' array
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed

}
function addPipeEnd(x, y) {
    // create a new pipe block
    var block = game.add.sprite(x, y, "pipe_end");
    // insert it in the 'pipes' array
    pipes.push(block);
    game.physics.arcade.enable(block);
    block.body.velocity.x = -gameSpeed
}
//function generate_pipe1() {
// calculate a random position for the gap
//var extra = game.rnd.integerInRange(0, 1);
//if (extra == 0){
// generate the pipes, except where the gap should be
//var gap = game.rnd.integerInRange(1 ,5);
// gap length 2
//for (var count = 0; count < 8; count ++) {
//if (count != gap && count != gap +1) {
//addPipeBlock(750, count*50);
//}
//}
//}
//else {
// generate the pipes, except where the gap should be
//var gap1 = game.rnd.integerInRange(1, 4);
// gap length 3
//for (var count1 = 0; count1 < 8; count1++) {
//if (count1 != gap1 && count1 != gap1 + 1 && count1 != gap1 + 2) {
//addPipeBlock(750, count1 * 50);
//}
//}
//}
//trackscore();
//}
function generate_pipe() {
    var c = game.rnd.integerInRange(0,1);
    if (c===0) {
        var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

        addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - pipeEndHeight);
        for (var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
            addPipeBlock(width, y - blockHeight);
        }

        addStar(width, gapStart + (gapSize / 2) - 24);

        addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize);
        for (var y = gapStart + gapSize + pipeEndHeight; y < height; y += blockHeight) {
            addPipeBlock(width, y);
        }
    } else {
        gapSize1 = gapSize*1.5;
        var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize1 - gapMargin);

        addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart - pipeEndHeight);
        for (var y = gapStart - pipeEndHeight; y > 0; y -= blockHeight) {
            addPipeBlock(width, y - blockHeight);
        }

        addStar1(width, gapStart + 27);

        addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + gapSize1);
        for (var y = gapStart + gapSize1 + pipeEndHeight; y < height; y += blockHeight) {
            addPipeBlock(width, y);
        }
        delete gapSize1;
    }
}
function balloon_generator(x,y) {
    var block1 = game.add.sprite(width, height, "balloon");
    balloons.push(block1);
    game.physics.enable(block1);
    block1.body.velocity.x = -gameSpeed;
    block1.body.velocity.y = -game.rnd.integerInRange(60, 100);
    block1.body.gravity.y = -game.rnd.integerInRange(30,40);
}
function weight_generator(x,y) {
    var block2 = game.add.sprite(width, 0, "weight");
    weights.push(block2);
    game.physics.enable(block2);
    block2.body.velocity.x = -gameSpeed;
    block2.body.velocity.y = game.rnd.integerInRange(60, 100);
    block2.body.gravity.y = game.rnd.integerInRange(30,40);
}
//Check for bonus and for which one
function checkBonus(bonusArray, bonusEffect){
    for(var i=bonusArray.length - 1; i>=0; i--){
        if(bonusArray[i].body.x - bonusWidth < 0) {
            bonusArray[i].destroy();
            bonusArray.splice(i, 1);
        } else {
            game.physics.arcade.overlap(player,bonusArray[i], function(){
                changeGravity(bonusEffect);
                bonusArray[i].destroy();
                bonusArray.splice(i,1);
            });
        }
    }
}
function addStar(x,y) {
    var block3 = game.add.sprite(x, y,"star");
    stars.push(block3);
    game.physics.enable(block3);
    block3.body.velocity.x = -gameSpeed;
}
function addStar1(x,y) {
    var block4 = game.add.sprite(x, y,"star1");
    stars1.push(block4);
    game.physics.enable(block4);
    block4.body.velocity.x = -gameSpeed;
}


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function gameOver() {
    player.kill();
    $("#score").val(score);
    $("#greeting").show();
    game.paused = true;

}