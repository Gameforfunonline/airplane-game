const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const airplane = new Image();
airplane.src = 'airplane.png';
const cloudImage = new Image();
cloudImage.src = 'cloud.png';
const collisionSound = new Audio('collision.mp3');

let airplaneX = 100;
let airplaneY = 200;
let speed = 2;
let score = 0;
let level = 1;
let clouds = [];
let gameOver = false;

const airplaneWidth = 50;
const airplaneHeight = 50;
const reducedAirplaneWidth = airplaneWidth * 0.9;
const reducedAirplaneHeight = airplaneHeight * 0.9;

// Carregar os seis melhores scores do localStorage
let highScores = JSON.parse(localStorage.getItem('highScores')) || [
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 },
    { name: '---', score: 0 }
];

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        airplaneY -= 15; // Aumentar a velocidade do movimento para cima
    } else if (event.key === 'ArrowDown') {
        airplaneY += 15; // Aumentar a velocidade do movimento para baixo
    } else if (event.key === 'ArrowLeft') {
        airplaneX -= 15; // Aumentar a velocidade do movimento para trás
    } else if (event.key === 'ArrowRight') {
        airplaneX += 15; // Aumentar a velocidade do movimento para frente
    } else if (event.key === ' ') {
        if (gameOver) {
            resetGame();
        }
    }
});

// Variáveis para controlar o movimento contínuo
let moveUp = false;
let moveDown = false;
let moveLeft = false;
let moveRight = false;

// Adicionar eventos de toque para os botões de controle
document.getElementById('up').addEventListener('touchstart', () => moveUp = true);
document.getElementById('up').addEventListener('touchend', () => moveUp = false);
document.getElementById('down').addEventListener('touchstart', () => moveDown = true);
document.getElementById('down').addEventListener('touchend', () => moveDown = false);
document.getElementById('left').addEventListener('touchstart', () => moveLeft = true);
document.getElementById('left').addEventListener('touchend', () => moveLeft = false);
document.getElementById('right').addEventListener('touchstart', () => moveRight = true);
document.getElementById('right').addEventListener('touchend', () => moveRight = false);

// Adicionar eventos para os botões de tela cheia e reset
document.getElementById('reset').addEventListener('click', resetGame);
document.getElementById('exit-fullscreen').addEventListener('click', exitFullscreen);

// Função para entrar em tela cheia
function enterFullscreen() {
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.mozRequestFullScreen) { // Firefox
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) { // Chrome, Safari and Opera
        canvas.webkitRequestFullscreen();
    } else if (canvas.msRequestFullscreen) { // IE/Edge
        canvas.msRequestFullscreen();
    }
}

// Função para sair da tela cheia
function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { // Firefox
        document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { // IE/Edge
        document.msExitFullscreen();
    }
}

// Entrar em tela cheia automaticamente em dispositivos móveis
if (/Mobi|Android/i.test(navigator.userAgent)) {
    enterFullscreen();
}

function addCloud() {
    const cloud = {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50
    };
    clouds.push(cloud);
}

function update() {
    if (gameOver) return;

    // Atualizar a posição do avião com base nos controles
    if (moveUp) airplaneY -= 5;
    if (moveDown) airplaneY += 5;
    if (moveLeft) airplaneX -= 5;
    if (moveRight) airplaneX += 5;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(airplane, airplaneX, airplaneY, reducedAirplaneWidth, reducedAirplaneHeight);

    // Desenhar pontuação
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.fillText('Score: ' + score, canvas.width - 100, 30);

    // Desenhar os seis melhores scores
    ctx.fillText('High Scores:', 10, 30);
    highScores.forEach((record, index) => {
        ctx.fillText(`${index + 1}. ${record.name}: ${record.score}`, 10, 60 + index * 30);
    });

    if (Math.random() < 0.02) {
        addCloud();
    }

    clouds.forEach((cloud, index) => {
        cloud.x -= speed;
        ctx.drawImage(cloudImage, cloud.x, cloud.y, cloud.width, cloud.height);

        if (cloud.x + cloud.width < 0) {
            clouds.splice(index, 1);
            score++;
            if (score % 50 === 0) {
                level++;
                speed += 1;
            }
        }

        if (
            airplaneX < cloud.x + cloud.width &&
            airplaneX + reducedAirplaneWidth > cloud.x &&
            airplaneY < cloud.y + cloud.height &&
            airplaneY + reducedAirplaneHeight > cloud.y
        ) {
            gameOver = true;
            collisionSound.play();
            const playerName = prompt('Game Over! Score: ' + score + '\nDigite seu nome:');
            updateHighScores(playerName