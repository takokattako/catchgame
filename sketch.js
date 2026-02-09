// 必要な変数を定義する (02)
let mode;
let score;
let startTime;
let gameTime;
let basetime;

let basketImage;
let basketX;
let basketY;

let appleImage;
let appleX;
let appleY;
let appleIsCatched;
let appleVY;
const gravity = 0.2;
let catchSound;

function preload() {
    // 画像を読み込む (02)
    basketImage = loadImage("image/basket.png");
    appleImage = loadImage("image/apple.png");
    // 効果音を読み込む
    catchSound = loadSound("audio/catch.mp3");
}

function setup() {
    createCanvas(500, 500);
    imageMode(CENTER);

    // 変数を初期化する (02)
    mode = 0;
    basketX = width / 2;
    basketY = height - 30;
    appleX = [];
    appleY = [];
    appleVY = [];
    appleIsCatched = [];
    basetime = 0;
    score = 0;
}

function draw() {
    background("lightblue");

    if (mode == 0) {
        // スタート画面の表示 (03)
        startTime = millis();
        textAlign(CENTER);
        text("クリックしてスタート" , width / 2 , height / 2);
        if (mouseIsPressed) {
            mode = 1;
        }

    }

    if (mode == 1) {
        // かごを動かす (04)
        if (keyIsDown(LEFT_ARROW)) {
            basketX -= 5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            basketX += 5;
        }
        
        // 一定時間おきにりんごを増やす (06)
        if (millis() - basetime > 1000) {
            basetime = millis();
            appleX.push(random(0, width));
            appleY.push(0);
            appleVY.push(0);
            appleIsCatched.push(false);
        }
        
        // りんごを落とす (05)
        for (let i = 0; i < appleY.length; i++) {
            if (!appleIsCatched[i]) {
                appleVY[i] += gravity;
                appleY[i] += appleVY[i];
            }
        }
        
        // かごとりんごが重なったら (07)
        for (let i = 0; i < appleX.length; i++){
        if (
            basketX - 30 < appleX[i] &&
            appleX[i] < basketX + 30 &&
            basketY - 20 < appleY[i] &&
            appleY[i] < basketY + 30 &&
            appleIsCatched[i] == false
        ) {
            score++;
            appleIsCatched[i] = true;
            if (catchSound) {
                catchSound.play();
            }
        }
    }
        
        // りんごを表示する (05)
        for (let i = 0; i < appleX.length; i++) {
            if (appleIsCatched[i] == false) {
                image(appleImage, appleX[i], appleY[i], 40 ,40);
            }
        }
        
        // かごを表示する (04)
        image(basketImage, basketX, basketY, 60, 60);
        
        // スコアを表示する (08)
        textAlign(LEFT);
        text("SCORE: " + score, 10, 20);
        
        // 時間を表示する (08)
        gameTime = floor((millis() - startTime) / 1000);
        text("TIME: " + gameTime, width - 80, 20);
        
        // 時間切れでゲームを終了する (09)
        if (gameTime >= 20) {
            mode = 2;
        }
    }

    if (mode == 2) {
        // 終了画面の表示 (09)
        textAlign(LEFT);
        text("SCORE: " + score, 10, 20);
        text("TIME: " + gameTime, width - 80, 20);

        textAlign(CENTER);
        text("FINISH", width / 2, height / 2);
        text("クリックしてもう一度プレイ", width / 2, height / 2 + 30);

        if (mouseIsPressed) {
            setup();
            startTime = millis();
            mode = 1;
        }
            }
}
