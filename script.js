const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const startScreen = document.getElementById('startScreen');
const playButton = document.getElementById('playButton');

playButton.addEventListener('click', startGame);

function startGame() {
    startScreen.style.display = 'none';
    canvas.style.display = 'block';
    createEnemies();
    update();
}

const player = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0
};

const bullets = [];
const enemies = [];
const enemyRowCount = 3;
const enemyColumnCount = 8;
const enemyWidth = 40;
const enemyHeight = 40;
const enemyPadding = 20;
const enemyOffsetTop = 30;
const enemyOffsetLeft = 30;

const playerImg = new Image();
playerImg.src = 'images/player.png';

const enemyImg = new Image();
enemyImg.src = 'images/enemy.png';

const bulletImg = new Image();
bulletImg.src = 'images/bullet.png';

function drawPlayer() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

function drawEnemies() {
    enemies.forEach((enemy) => {
        ctx.drawImage(enemyImg, enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

function drawBullets() {
    bullets.forEach((bullet) => {
        ctx.drawImage(bulletImg, bullet.x, bullet.y, bullet.width, bullet.height);
    });
}

function movePlayer() {
    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    }

    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }
}

function moveBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        if (bullet.y + bullet.height < 0) {
            bullets.splice(index, 1);
        }
    });
}

function moveEnemies() {
    enemies.forEach((enemy) => {
        enemy.x += enemy.dx;
    });

    const hitEdge = enemies.some(enemy => enemy.x + enemy.width > canvas.width || enemy.x < 0);

    if (hitEdge) {
        enemies.forEach((enemy) => {
            enemy.dx *= -1;
            enemy.y += enemy.height;
        });
    }
}

function shoot() {
    const bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 10,
        height: 20,
        speed: 7
    };
    bullets.push(bullet);
}

function collisionDetection() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                setTimeout(() => {
                    bullets.splice(bIndex, 1);
                    enemies.splice(eIndex, 1);
                }, 0);
            }
        });
    });
}

function update() {
    movePlayer();
    moveBullets();
    moveEnemies();
    collisionDetection();

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(update);
}

function createEnemies() {
    for (let r = 0; r < enemyRowCount; r++) {
        for (let c = 0; c < enemyColumnCount; c++) {
            const enemy = {
                x: c * (enemyWidth + enemyPadding) + enemyOffsetLeft,
                y: r * (enemyHeight + enemyPadding) + enemyOffsetTop,
                width: enemyWidth,
                height: enemyHeight,
                dx: 2
            };
            enemies.push(enemy);
        }
    }
}

function keyDown(e) {
    if (e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ') {
        shoot();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Zapobiega przewijaniu strony przy użyciu strzałek
window.addEventListener('keydown', function(e) {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) > -1) {
        e.preventDefault();
    }
}, false);
