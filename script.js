const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const plane = new Image();
plane.src = 'airplane.png'; // Substitua pelo caminho da imagem do avião
const cloud = new Image();
cloud.src = 'cloud.png'; // Substitua pelo caminho da imagem da nuvem

let planeX = canvas.width / 2;
let planeY = canvas.height - 100;
let score = 0;
let clouds = [];
let gameOver = false;

function drawPlane() {
    ctx.drawImage(plane, planeX, planeY, 50, 50);
}

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.drawImage(cloud.img, cloud.x, cloud.y, 50, 50);
        cloud.y += 2;
        if (cloud.y > canvas.height) {
            cloud.y = -50;
            cloud.x = Math.random() * canvas.width;
            score++;
            document.getElementById('score').innerText = score;
        }
        if (planeX < cloud.x + 50 && planeX + 50 > cloud.x && planeY < cloud.y + 50 && planeY + 50 > cloud.y) {
            gameOver = true;
            let playerName = prompt('Game Over! Insira seu nome:');
            saveScore(playerName, score);
            // Adicione lógica para salvar o score
        }
    });
}

function gameLoop() {
    if (gameOver) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlane();
    drawClouds();
    requestAnimationFrame(gameLoop);
}

function createClouds() {
    for (let i = 0; i < 5; i++) {
        clouds.push({
            img: cloud,
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height
        });
    }
}

function saveScore(name, score) {
    let highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.push({ name, score });
    highscores.sort((a, b) => b.score - a.score);
    highscores = highscores.slice(0, 6);
    localStorage.setItem('highscores', JSON.stringify(highscores));
    displayHighscores();
}

function displayHighscores() {
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    const highscoresList = document.getElementById('highscores');
    highscoresList.innerHTML = '';
    highscores.forEach(score => {
        const li = document.createElement('li');
        li.textContent = `${score.name}: ${score.score}`;
        highscoresList.appendChild(li);
    });
}

document.getElementById('up').addEventListener('click', () => planeY -= 10);
document.getElementById('down').addEventListener('click', () => planeY += 10);
document.getElementById('left').addEventListener('click', () => planeX -= 10);
document.getElementById('right').addEventListener('click', () => planeX += 10);
document.getElementById('restart').addEventListener('click', () => location.reload());
document.getElementById('close').addEventListener('click', () => window.close());

createClouds();
displayHighscores();
gameLoop();
