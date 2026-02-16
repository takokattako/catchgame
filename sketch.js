// 必要な変数を定義する (02)
let mode;
let score;
let startTime;
let gameTime;
let basetime;

let basketImage;
let powerupImage;
let basketX;
let basketY;
let basketVY;        // for drop movement
let basketDropping;  // whether basket is currently falling
let catchCount;      // total fruits caught

let appleImage;
let persimmonImage;

// arrays tracking all falling fruits
let fruitX;
let fruitY;
let fruitVY;
let fruitIsCatched;
let fruitType; // "apple" or "persimmon"

// arrays for power-up baskets that fall
let powerupX;
let powerupY;
let powerupVY;

const gravity = 0.2;
let catchSound;
let powerupCatchCount; // number of powerups caught

function preload() {
    // 画像を読み込む (02)
    basketImage = loadImage("image/basket.png");
    powerupImage = loadImage("image/powerupbasket.png");
    appleImage = loadImage("image/apple.png");
    persimmonImage = loadImage("image/persimmon.png");
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
    basketVY = 0;
    basketDropping = false;
    catchCount = 0;
    powerupCatchCount = 0;
    fruitX = [];
    fruitY = [];
    fruitVY = [];
    fruitIsCatched = [];
    fruitType = [];
    powerupX = [];
    powerupY = [];
    powerupVY = [];
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
        // かごを動かす (04) 範囲を制限
        if (keyIsDown(LEFT_ARROW)) {
            basketX -= 5;
        }
        if (keyIsDown(RIGHT_ARROW)) {
            basketX += 5;
        }
        // X座標を30〜470の範囲に収める
        basketX = constrain(basketX, 30, 470);
        
        // ゲーム時間を計測しておく
        gameTime = floor((millis() - startTime) / 1000);
        // 一定時間おきに果物を増やす (06)
        // 残り5秒以下なら落下数を1.5倍にする
        let spawnInterval = 1000;
        if (gameTime >= 15) {
            spawnInterval = 1000 / 1.5; // 約667ms
        }
        if (millis() - basetime > spawnInterval) {
            basetime = millis();
            // X座標を30〜470の範囲に限定
            fruitX.push(random(30, 470));
            fruitY.push(0);
            fruitVY.push(0);
            fruitIsCatched.push(false);
            // ランダムにりんごか柿を選ぶ（柿は少なめ）
            if (random() < 0.8) {
                fruitType.push("apple");
            } else {
                fruitType.push("persimmon");
            }
        }
        
        // 果物を落とす (05)
        for (let i = 0; i < fruitY.length; i++) {
            if (!fruitIsCatched[i]) {
                fruitVY[i] += gravity;
                fruitY[i] += fruitVY[i];
            }
        }
        // パワーアップかごも落とす
        for (let i = 0; i < powerupY.length; i++) {
            powerupVY[i] += gravity;
            powerupY[i] += powerupVY[i];
        }
        // 画面外に出たパワーアップは配列から削除
        for (let i = powerupY.length - 1; i >= 0; i--) {
            if (powerupY[i] > height) {
                powerupX.splice(i, 1);
                powerupY.splice(i, 1);
                powerupVY.splice(i, 1);
            }
        }
        
        // かごと果物が重なったら (07)
        for (let i = 0; i < fruitX.length; i++){
        // 当たり判定も果物の大きさに合わせる
        let halfSize = (fruitType[i] === "persimmon") ? 30 : 20;
        if (
            basketX - 30 < fruitX[i] &&
            fruitX[i] < basketX + 30 &&
            basketY - halfSize < fruitY[i] &&
            fruitY[i] < basketY + 30 &&
            fruitIsCatched[i] == false
        ) {
            // 柿なら2点、それ以外は1点
            if (fruitType[i] === "persimmon") {
                score += 2;
            } else {
                score += 1;
            }
            fruitIsCatched[i] = true;
            // カウントを1増やし、10の倍数かチェック
            catchCount++;
            if (catchCount % 10 === 0) {
                // パワーアップかごを落とすのみ
                powerupX.push(random(30, 470));
                powerupY.push(30);      // visible immediately
                powerupVY.push(0);
            }
            if (catchSound) {
                catchSound.play();
            }
        }
    }
        
        // パワーアップかごのキャッチ判定
        for (let i = powerupX.length - 1; i >= 0; i--) {
            if (
                basketX - 30 < powerupX[i] &&
                powerupX[i] < basketX + 30 &&
                basketY - 30 < powerupY[i] &&
                powerupY[i] < basketY + 30
            ) {
                // 捕まえた
                if (catchSound) catchSound.play();
                powerupCatchCount++;
                // 削除
                powerupX.splice(i, 1);
                powerupY.splice(i, 1);
                powerupVY.splice(i, 1);
            }
        }
        
        // 果物を表示する (05)
        for (let i = 0; i < fruitX.length; i++) {
            if (fruitIsCatched[i] == false) {
                if (fruitType[i] === "apple") {
                    image(appleImage, fruitX[i], fruitY[i], 40 ,40);
                } else {
                    // 柿は1.5倍の大きさ
                    image(persimmonImage, fruitX[i], fruitY[i], 60 ,60);
                }
            }
        }
        // パワーアップかごを表示する
        for (let i = 0; i < powerupX.length; i++) {
            image(powerupImage, powerupX[i], powerupY[i], 60, 60);
        }
        
        // かごを表示する (04)
        image(basketImage, basketX, basketY, 60, 60);

        // パワーアップ数表示
        textAlign(RIGHT);
        text("P-UPS: " + powerupCatchCount, width - 10, 40);
        
        // スコアを表示する (08)
        textAlign(LEFT);
        text("SCORE: " + score, 10, 20);
        
        // 時間を表示する (08)
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
