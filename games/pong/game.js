// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 400;

// Game objects
const ball = {
    x: canvas.width/2,
    y: canvas.height/2,
    size: 10,
    speedX: 5,
    speedY: 5
};

const paddle = {
    width: 10,
    height: 100,
    player: {
        y: canvas.height/2 - 50,
        score: 0
    },
    computer: {
        y: canvas.height/2 - 50,
        score: 0
    }
};

let gameStarted = false;
let upPressed = false;
let downPressed = false;

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') upPressed = true;
    if (e.key === 'ArrowDown') downPressed = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') upPressed = false;
    if (e.key === 'ArrowDown') downPressed = false;
});

// Mouse movement
canvas.addEventListener('mousemove', (e) => {
    if (gameStarted) {
        let rect = canvas.getBoundingClientRect();
        let mouseY = e.clientY - rect.top;
        paddle.player.y = mouseY - paddle.height/2;
        
        // Keep paddle within canvas bounds
        if (paddle.player.y < 0) paddle.player.y = 0;
        if (paddle.player.y + paddle.height > canvas.height) {
            paddle.player.y = canvas.height - paddle.height;
        }
    }
});

function updateBall() {
    ball.x += ball.speedX;
    ball.y += ball.speedY;
    
    // Wall collision (top and bottom)
    if (ball.y <= 0 || ball.y >= canvas.height) {
        ball.speedY = -ball.speedY;
    }
}

function updatePaddles() {
    // Keyboard controls
    if (upPressed && paddle.player.y > 0) {
        paddle.player.y -= 7;
    }
    if (downPressed && paddle.player.y + paddle.height < canvas.height) {
        paddle.player.y += 7;
    }
    
    // Computer AI
    let computerSpeed = 5;
    let computerCenter = paddle.computer.y + paddle.height/2;
    
    if (computerCenter < ball.y - 35) {
        paddle.computer.y += computerSpeed;
    } else if (computerCenter > ball.y + 35) {
        paddle.computer.y -= computerSpeed;
    }
}

function checkCollisions() {
    // Paddle collisions
    // Left paddle (player)
    if (ball.x <= 20 && 
        ball.y >= paddle.player.y && 
        ball.y <= paddle.player.y + paddle.height) {
        ball.speedX = -ball.speedX;
        ball.speedX *= 1.1; // Increase speed slightly
        ball.speedY *= 1.1;
    }
    
    // Right paddle (computer)
    if (ball.x >= canvas.width - 20 && 
        ball.y >= paddle.computer.y && 
        ball.y <= paddle.computer.y + paddle.height) {
        ball.speedX = -ball.speedX;
        ball.speedX *= 1.1; // Increase speed slightly
        ball.speedY *= 1.1;
    }
    
    // Score points
    if (ball.x <= 0) {
        paddle.computer.score++;
        document.getElementById('computerScore').textContent = paddle.computer.score;
        resetBall();
    } else if (ball.x >= canvas.width) {
        paddle.player.score++;
        document.getElementById('playerScore').textContent = paddle.player.score;
        resetBall();
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(10, paddle.player.y, paddle.width, paddle.height);
    ctx.fillRect(canvas.width - 20, paddle.computer.y, paddle.width, paddle.height);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function resetBall() {
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speedX = -ball.speedX;
    ball.speedX = ball.speedX > 0 ? 5 : -5;
    ball.speedY = 5;
}

function gameLoop() {
    if (gameStarted) {
        updateBall();
        updatePaddles();
        checkCollisions();
    }
    draw();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    gameStarted = true;
    document.getElementById('startButton').style.display = 'none';
    resetBall();
}

// Start game loop
gameLoop();