const canvasWidth = 600;
const canvasHeight = 300;
const ballRadius = 10;
const pocketRadius = 20;

const pockets = [
    { x: 0, y: 0 },
    { x: canvasWidth / 2, y: 0 },
    { x: canvasWidth, y: 0 },
    { x: 0, y: canvasHeight },
    { x: canvasWidth / 2, y: canvasHeight },
    { x: canvasWidth, y: canvasHeight }
];

function distance(x1, y1, x2, y2) {
    return Math.hypot(x2 - x1, y2 - y1);
}

class Ball {
    constructor(x, y, color, type, number) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.type = type;
        this.number = number;
        this.radius = ballRadius;
        this.inPlay = true;
    }

    update() {
        if (!this.inPlay) return;
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.99;
        this.vy *= 0.99;
        if (Math.abs(this.vx) < 0.05) this.vx = 0;
        if (Math.abs(this.vy) < 0.05) this.vy = 0;
    }

    draw(ctx) {
        if (!this.inPlay) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.stroke();
        if (this.type !== 'cue' && this.number !== null) {
            ctx.fillStyle = "white";
            ctx.font = "10px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(this.number, this.x, this.y);
        }
    }
}

class PoolGame {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = canvasWidth;
        this.canvas.height = canvasHeight;
        this.canvas.style.border = "2px solid #444";
        document.getElementById("game-table").appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");

        this.balls = [];
        this.shootingAllowed = true;
        this.cueBall = null;
        this.ballInHand = false;
        this.aim = null;

        this.canvas.addEventListener("mousemove", (e) => this.updateAim(e));
        this.canvas.addEventListener("click", (e) => this.handleClick(e));

        this.setupBalls();
        requestAnimationFrame(() => this.gameLoop());
    }

    setupBalls() {
        this.balls = [];
        this.cueBall = new Ball(100, canvasHeight / 2, "white", "cue", null);
        this.balls.push(this.cueBall);

        const rackX = canvasWidth - 150;
        const rackY = canvasHeight / 2;
        let ballPositions = [];
        for (let row = 0; row < 5; row++) {
            let offsetX = row * (ballRadius * 1.732);
            let startY = rackY - row * ballRadius;
            for (let i = 0; i <= row; i++) {
                let x = rackX + offsetX;
                let y = startY + i * (ballRadius * 2);
                ballPositions.push({ row, i, x, y });
            }
        }

        let solids = [
            { number: 1, color: "#FFD700" },
            { number: 2, color: "#DC143C" },
            { number: 3, color: "#1E90FF" },
            { number: 4, color: "#32CD32" },
            { number: 5, color: "#FF8C00" },
            { number: 6, color: "#8A2BE2" },
            { number: 7, color: "#FF1493" }
        ];
        let stripes = [
            { number: 9, color: "#EEE8AA" },
            { number: 10, color: "#FA8072" },
            { number: 11, color: "#87CEFA" },
            { number: 12, color: "#90EE90" },
            { number: 13, color: "#FFA500" },
            { number: 14, color: "#9370DB" },
            { number: 15, color: "#FF69B4" }
        ];

        const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);
        shuffleArray(solids);
        shuffleArray(stripes);
        let solidIndex = 0, stripeIndex = 0;

        for (let pos of ballPositions) {
            if (pos.row === 2 && pos.i === 1) {
                this.balls.push(new Ball(pos.x, pos.y, "black", "eight", 8));
            } else {
                let assignSolid = Math.random() < 0.5;
                if (assignSolid && solidIndex < solids.length) {
                    let ball = solids[solidIndex++];
                    this.balls.push(new Ball(pos.x, pos.y, ball.color, "solid", ball.number));
                } else if (stripeIndex < stripes.length) {
                    let ball = stripes[stripeIndex++];
                    this.balls.push(new Ball(pos.x, pos.y, ball.color, "stripe", ball.number));
                } else if (solidIndex < solids.length) {
                    let ball = solids[solidIndex++];
                    this.balls.push(new Ball(pos.x, pos.y, ball.color, "solid", ball.number));
                }
            }
        }
    }

    updateAim(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.aim = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        };
    }

    handleClick(event) {
        if (this.ballInHand) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            if (x >= ballRadius && x <= canvasWidth - ballRadius &&
                y >= ballRadius && y <= canvasHeight - ballRadius) {
                this.cueBall.x = x;
                this.cueBall.y = y;
                this.cueBall.inPlay = true;
                this.ballInHand = false;
                this.shootingAllowed = true;
            }
            return;
        }

        if (!this.shootingAllowed || !this.cueBall || !this.cueBall.inPlay) return;
        if (this.areBallsMoving()) return;
        if (!this.aim) return;
        const dx = this.aim.x - this.cueBall.x;
        const dy = this.aim.y - this.cueBall.y;
        const mag = Math.hypot(dx, dy);
        if (mag === 0) return;
        const speed = 8;
        this.cueBall.vx = (dx / mag) * speed;
        this.cueBall.vy = (dy / mag) * speed;
        this.shootingAllowed = false;
    }

    areBallsMoving() {
        for (let ball of this.balls) {
            if (!ball.inPlay) continue;
            if (Math.abs(ball.vx) > 0 || Math.abs(ball.vy) > 0) return true;
        }
        return false;
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    update() {
        for (let ball of this.balls) {
            ball.update();
            if (!ball.inPlay) continue;
            if (ball.x - ball.radius < 0) {
                ball.x = ball.radius;
                ball.vx *= -1;
            }
            if (ball.x + ball.radius > canvasWidth) {
                ball.x = canvasWidth - ball.radius;
                ball.vx *= -1;
            }
            if (ball.y - ball.radius < 0) {
                ball.y = ball.radius;
                ball.vy *= -1;
            }
            if (ball.y + ball.radius > canvasHeight) {
                ball.y = canvasHeight - ball.radius;
                ball.vy *= -1;
            }
            for (let pocket of pockets) {
                if (distance(ball.x, ball.y, pocket.x, pocket.y) < pocketRadius) {
                    if (ball.type === "cue") {
                        ball.inPlay = false;
                        this.ballInHand = true;
                    } else {
                        ball.inPlay = false;
                    }
                }
            }
        }

        for (let i = 0; i < this.balls.length; i++) {
            const ballA = this.balls[i];
            if (!ballA.inPlay) continue;
            for (let j = i + 1; j < this.balls.length; j++) {
                const ballB = this.balls[j];
                if (!ballB.inPlay) continue;
                const dx = ballB.x - ballA.x;
                const dy = ballB.y - ballA.y;
                const dist = Math.hypot(dx, dy);
                if (dist < ballA.radius + ballB.radius && dist > 0) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const tx = -ny;
                    const ty = nx;
                    const dpTanA = ballA.vx * tx + ballA.vy * ty;
                    const dpTanB = ballB.vx * tx + ballB.vy * ty;
                    const dpNormA = ballA.vx * nx + ballA.vy * ny;
                    const dpNormB = ballB.vx * nx + ballB.vy * ny;
                    const mA = dpNormB;
                    const mB = dpNormA;
                    ballA.vx = tx * dpTanA + nx * mA;
                    ballA.vy = ty * dpTanA + ny * mA;
                    ballB.vx = tx * dpTanB + nx * mB;
                    ballB.vy = ty * dpTanB + ny * mB;
                    const overlap = ballA.radius + ballB.radius - dist;
                    ballA.x -= nx * (overlap / 2);
                    ballA.y -= ny * (overlap / 2);
                    ballB.x += nx * (overlap / 2);
                    ballB.y += ny * (overlap / 2);
                }
            }
        }

        if (!this.areBallsMoving() && !this.ballInHand) {
            this.shootingAllowed = true;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        this.ctx.fillStyle = "#006400";
        this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        for (let pocket of pockets) {
            this.ctx.beginPath();
            this.ctx.arc(pocket.x, pocket.y, pocketRadius, 0, Math.PI * 2);
            this.ctx.fillStyle = "black";
            this.ctx.fill();
        }
        for (let ball of this.balls) {
            ball.draw(this.ctx);
        }
        if (this.shootingAllowed && this.cueBall && this.cueBall.inPlay && this.aim) {
            const dx = this.aim.x - this.cueBall.x;
            const dy = this.aim.y - this.cueBall.y;
            const angle = Math.atan2(dy, dx);
            const stickOffset = ballRadius + 5;
            const stickLength = 60;
            const x1 = this.cueBall.x - Math.cos(angle) * stickOffset;
            const y1 = this.cueBall.y - Math.sin(angle) * stickOffset;
            const x2 = this.cueBall.x - Math.cos(angle) * (stickOffset + stickLength);
            const y2 = this.cueBall.y - Math.sin(angle) * (stickOffset + stickLength);
            this.ctx.strokeStyle = "#B5651D";
            this.ctx.lineWidth = 4;
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
        if (this.ballInHand) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "16px Arial";
            this.ctx.fillText("Cue ball pocketed! Click to place it on the table.", 10, canvasHeight - 20);
        } else if (this.shootingAllowed) {
            this.ctx.fillStyle = "white";
            this.ctx.font = "16px Arial";
            this.ctx.fillText("Aim with your mouse, then click to shoot.", 10, canvasHeight - 10);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new PoolGame();
});