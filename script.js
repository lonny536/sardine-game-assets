const stages = [

  { enemy: "tuna.png", cookies: 5, bg: "background.png", size: 1 },

  { enemy: "Octopus.png", cookies: 7, bg: "background~2.png", size: 2 },

  { enemy: "shark.png", cookies: 10, bg: "background~3.png", size: 3 },

  { enemy: "whale.png", cookies: 13, bg: "background~4.png", size: 4 },

  { enemy: "diver.png", cookies: 17, bg: "background~5.png", size: 5 },

  { enemy: "hook.png", cookies: 1, bg: "background~6.png", size: 1, final: true }

];

let stage=0, hearts=15, cookies=0;

let playerX=200, playerY=200, playerDir='right';

let enemyX, enemyY, enemySpeed=0.2;

let gameRunning=false;

const bubbleSound = new Audio('https://c.top4top.io/m_3498120f20.mp3');

const cookieSound = new Audio('https://g.top4top.io/m_34981h6ca0.mp3');

const hurtSound = new Audio('https://j.top4top.io/m_3498z42ez0.mp3');

const seaSound = new Audio('https://c.top4top.io/m_3498u7j2p0.mp3'); seaSound.loop=true; seaSound.volume=0.3;

const game=document.getElementById("game");

const player=document.getElementById("player");

const enemy=document.getElementById("enemy");

const cookie=document.getElementById("cookie");

function startGame(){

  document.getElementById("startScreen").classList.remove("active");

  game.style.display="block";

  seaSound.play();

  loadStage();

  gameRunning=true;

  loop();

}

function loadStage(){

  cookies=0; enemySpeed=0.2;

  const s=stages[stage];

  game.style.backgroundImage=`url(https://raw.githubusercontent.com/lonny536/sardine-game-assets/refs/heads/main/${s.bg})`;

  enemy.style.backgroundImage=`url(https://raw.githubusercontent.com/lonny536/sardine-game-assets/refs/heads/main/${s.enemy})`;

  enemy.style.transform=`scale(${s.size})`;

  if(s.final){

    enemyX=window.innerWidth/2-40;

    enemyY=window.innerHeight/2-30;

  } else {

    enemyX=window.innerWidth-120;

    enemyY=Math.random()*(window.innerHeight-100);

  }

  spawnCookie();

  updateHUD();

}

function spawnCookie(){

  const controlArea = 100;

  let x=Math.random()*(window.innerWidth-40-controlArea)+controlArea;

  let y=Math.random()*(window.innerHeight-40);

  if(stages[stage].final){

    x=enemyX;

    y=enemyY-50; // فوق/تحت السنارة

  }

  cookie.style.left=x+"px";

  cookie.style.top=y+"px";

}

function move(dir){

  if(!gameRunning) return;

  if(dir==="up"){ playerY-=12; bubbleSound.play(); }

  if(dir==="down"){ playerY+=12; bubbleSound.play(); }

  if(dir==="left"){ playerX-=12; playerDir='left'; player.style.transform='scaleX(-1)'; bubbleSound.play(); }

  if(dir==="right"){ playerX+=12; playerDir='right'; player.style.transform='scaleX(1)'; bubbleSound.play(); }

  playerX=Math.max(0,Math.min(window.innerWidth-60,playerX));

  playerY=Math.max(0,Math.min(window.innerHeight-40,playerY));

}

function loop(){

  if(!gameRunning) return;

  let dx=playerX-enemyX;

  let dy=playerY-enemyY;

  let dist=Math.hypot(dx,dy);

  if(!stages[stage].final && dist>10){

    enemyX+=(dx/dist)*enemySpeed;

    enemyY+=(dy/dist)*enemySpeed;

    if(dx>0) enemy.style.transform='scaleX(1)';

    else enemy.style.transform='scaleX(-1)';

  }

  player.style.left=playerX+"px";

  player.style.top=playerY+"px";

  enemy.style.left=enemyX+"px";

  enemy.style.top=enemyY+"px";

  if(dist<50 && !stages[stage].final){

    hearts--;

    enemySpeed+=0.05;

    enemyX=window.innerWidth-120;

    enemyY=Math.random()*(window.innerHeight-100);

    updateHUD();

    hurtSound.play();

    if(hearts<=0) loseGame();

  }

  let cx=cookie.offsetLeft-playerX;

  let cy=cookie.offsetTop-playerY;

  if(Math.hypot(cx,cy)<40){

    cookies++;

    cookieSound.play();

    if(cookies>=stages[stage].cookies) nextStage();

    spawnCookie();

    updateHUD();

  }

  requestAnimationFrame(loop);

}

function nextStage(){

  stage++;

  if(stage>=stages.length) winGame();

  else loadStage();

}

function updateHUD(){

  document.getElementById("hearts").textContent="❤️ "+hearts;

  const s=stages[stage];

  document.getElementById("cookies").textContent=`🍪 ${cookies} / ${s.cookies}`;

  document.getElementById("stageText").textContent="Stage "+(stage+1);

}

function winGame(){

  gameRunning=false;

  showEnd("ending~2.png");

}

function loseGame(){

  gameRunning=false;

  showEnd(Math.random()>0.5?"Loser1.png":"Loser2.png");

}

function showEnd(img){

  game.style.display="none";

  const end=document.getElementById("endScreen");

  document.getElementById("endImage").src="https://raw.githubusercontent.com/lonny536/sardine-game-assets/refs/heads/main/"+img;

  end.style.display="block";

}

function restartGame(){

  stage=0; hearts=15; cookies=0; enemySpeed=0.2;

  playerX=200; playerY=200;

  document.getElementById("endScreen").style.display="none";

  document.getElementById("startScreen").classList.add("active");

}

function exitGame(){ alert("Exit game"); }