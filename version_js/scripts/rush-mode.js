const speedOption = document.getElementById('speed-option');
const triangleLeft = document.querySelector('.triangle-left');
const triangleRight = document.querySelector('.triangle-right');
let speed = 0;

// Add event listener for the right triangle
triangleRight.addEventListener('click', incrementSpeed);

// Add event listener for the left triangle
triangleLeft.addEventListener('click', decrementSpeed);

const canvas = document.getElementById("tetris");
const ctx = canvas.getContext("2d");

const scale = canvas.width / 10;

ctx.scale(scale, scale);

const tWidth = canvas.width / scale;
const tHeight = canvas.height / scale;

class Tetromino {
    constructor(matrix, color) {
        this.matrix = matrix;
        this.color = color;
    }
}

const pieces = [
    new Tetromino(
        [
            [1, 1],
            [1, 1],
        ],
        "#9518E2"
    ),
    new Tetromino(
        [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
        ],
        "#F0692F"
    ),
    new Tetromino(
        [
            [0, 0, 0],
            [3, 3, 0],
            [0, 3, 3],
        ],
        "#F5D949"
    ),
    new Tetromino(
        [
            [0, 0, 0],
            [0, 4, 4],
            [4, 4, 0],
        ],
        "#26AA10"
    ),
    new Tetromino(
        [
            [5, 0, 0],
            [5, 0, 0],
            [5, 5, 0],
        ],
        "#E91E1E"
    ),
    new Tetromino(
        [
            [0, 0, 6],
            [0, 0, 6],
            [0, 6, 6],
        ],
        "#D70FC3"
    ),
    new Tetromino(
        [
            [0, 0, 0],
            [7, 7, 7],
            [0, 7, 0],
        ],
        "#1EBB95"
    ),
];

let arena = [];

let rand;

class Player {
    constructor() {
        this.pos = { x: 4, y: 0 };
        this.tetromino = null;
        this.score = 0;
        this.speed = 0;
    }

    getRandomTetromino() {
        rand = Math.floor(Math.random() * pieces.length);
        this.tetromino = pieces[rand];
    }
}

const player = new Player();
player.getRandomTetromino();

// Update the speed display
function updateSpeed() {
    speedOption.textContent = speed;
}

// Increment the speed by one
function incrementSpeed() {
    if (speed < 10) {
        speed++;
        player.speed++;
        updateSpeed();
    }
}

// Decrement the speed by one
function decrementSpeed() {
    if (speed > 0) {
        speed--;
        player.speed--;
        updateSpeed();
    }
}

function drawMatrix(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j]) ctx.fillRect(x + j, y + i, 1, 1);
        }
    }
}

function rotateMatrix(matrix, dir) {
    let newMatrix = [];

    for (let i in matrix) newMatrix.push([]);

    if (dir === 1) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[j][matrix.length - i - 1] = matrix[i][j];
            }
        }
    } else {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                newMatrix[matrix.length - j - 1][i] = matrix[i][j];
            }
        }
    }

    return newMatrix;
}

function collides(player, arena) {
    for (let i = 0; i < player.tetromino.matrix.length; i++) {
        for (let j = 0; j < player.tetromino.matrix[i].length; j++) {
            if (
                player.tetromino.matrix[i][j] &&
                arena[player.pos.y + i + 1][player.pos.x + j + 1]
            )
                return true;
        }
    }

    return false;
}

function mergeArena(matrix, x, y) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            arena[y + i + 1][x + j + 1] =
                arena[y + i + 1][x + j + 1] || matrix[i][j];
        }
    }
}

const score = document.getElementById("score");

function clearBlocks() {
    for (let i = 1; i < arena.length - 2; i++) {
        let clear = true;

        for (let j = 1; j < arena[i].length - 1; j++) {
            if (!arena[i][j]) clear = false;
        }

        if (clear) {
            let r = new Array(tWidth).fill(0);
            r.push(1);
            r.unshift(1);

            arena.splice(i, 1);
            arena.splice(1, 0, r);
            player.score += 11;
            score.textContent = player.score;
        }
    }
}

function drawArena() {
    for (let i = 1; i < arena.length - 2; i++) {
        for (let j = 1; j < arena[i].length - 1; j++) {
            if (arena[i][j]) {
                ctx.fillStyle = pieces[arena[i][j] - 1].color;
                ctx.fillRect(j - 1, i - 1, 1, 1);
            }
        }
    }
}

function initArena() {
    arena = [];

    const r = new Array(tWidth + 2).fill(1);
    arena.push(r);

    for (let i = 0; i < tHeight; i++) {
        let row = new Array(tWidth).fill(0);
        row.push(1);
        row.unshift(1);

        arena.push(row);
    }

    arena.push(r);
    arena.push(r);
}

function gameOver() {
    for (let j = 1; j < arena[1].length - 1; j++) if (arena[1][j]) isGameOver = true;

    return;
}

let interval = 1000;
let lastTime = 0;
let count = 0;
let isGameOver = false;

function update(time = 0) {
    if (isGameOver) return;
    const dt = time - lastTime;
    lastTime = time;
    count += dt;

    if (count >= interval) {
        player.pos.y++;
        count = 0;
    }

    if (collides(player, arena)) {
        mergeArena(player.tetromino.matrix, player.pos.x, player.pos.y - 1);
        clearBlocks();
        gameOver();

        player.pos.y = 0;
        player.pos.x = 4;

        player.getRandomTetromino();
        player.score += 2;
        score.textContent = player.score;

        if (player.speed < 10) {
            interval = 1000 - (player.speed * 100);
        }
        else {
            interval = 50;
        }
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawArena();
    ctx.fillStyle = player.tetromino.color;
    drawMatrix(player.tetromino.matrix, player.pos.x, player.pos.y);

    requestAnimationFrame(update);
}

document.addEventListener("keydown", (event) => {
    if (event.keyCode === 37 && interval - 1) {
        player.pos.x--;
        if (collides(player, arena)) player.pos.x++;
    } else if (event.keyCode === 39 && interval - 1) {
        player.pos.x++;
        if (collides(player, arena)) player.pos.x--;
    } else if (event.keyCode === 40) {
        player.pos.y++;
        count = 0;
    } else if (event.keyCode === 38) {
        player.tetromino.matrix = rotateMatrix(player.tetromino.matrix, 1);
        if (collides(player, arena))
            player.tetromino.matrix = rotateMatrix(player.tetromino.matrix, -1);
    } else if (event.keyCode === 32) {
        interval = 1;
    }
});

initArena();
update();

// Sélectionner l'élément DOM du timer
const timerElement = document.getElementById('time');

// Définir la durée initiale du timer en secondes
let timerDuration = 60;

// Définir la fonction qui met à jour le timer
function updateTimer() {
    if (isGameOver) {
        return;
    }


    // Calculer les minutes et les secondes restantes
    const minutes = Math.floor(timerDuration / 60);
    const seconds = timerDuration % 60;

    // Afficher le timer dans l'élément DOM
    timerElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Vérifier si le temps est écoulé
    if (timerDuration > 0) {
        // Décrémenter le temps restant
        timerDuration--;
    }
    else {
        isGameOver = true;
    }

}

// Appeler la fonction updateTimer une fois pour afficher le temps initial
updateTimer();

// Mettre à jour le timer toutes les secondes
const timerInterval = setInterval(updateTimer, 1000);
