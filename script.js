const bird = document.getElementById('bird');
const gameContainer = document.getElementById('game-container');
const gameContainerImg = document.getElementById('gameContainer');
const scoreElement = document.getElementById('score');
const playBtn = document.getElementById('start-button');
const rulesDiv = document.getElementById('rules');
const ok = document.getElementById('ok');
const startButton = document.getElementById('startGame');
const gameOverSms = document.getElementById('gameoversms');

let birdY = 300;
let birdVelocity = 0;
let gravity = 0.5;
let gameLoop;
let pipes = [];
let score = 0;
let gameStarted = false;
//*------------------------------- here we have to add upload wala code 
    const imageUploadInput = document.getElementById('imageUpload');
    const imagePreview = document.getElementById('image-preview');
    const uploadStatus = document.getElementById('upload-status');
    // Listen for file selection
    imageUploadInput.addEventListener('change', function(event) {
        const file = event.target.files[0];        if (file) {
            // Show loading animation
            uploadStatus.style.display = 'block';

            // Simulate image upload delay
            setTimeout(() => {
                // Hide loading animation
                uploadStatus.style.display = 'none';

                // Create image preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    const imgElement = document.createElement('img');
                    imgElement.src = e.target.result;
                    imagePreview.innerHTML = '';  // Clear previous preview
                    imagePreview.appendChild(imgElement);
                    bird.style.backgroundImage = `url(${e.target.result})`;
                    bird.style.backgroundSize = 'cover';
                    bird.style.backgroundColor = 'transparent';
                    // Enable start button
                    startButton.disabled = false;
                };
                reader.readAsDataURL(file);
            }, 2000);  // Simulate 2-second delay for upload
        }
    });
//*------------------------------------- uplad wala code was end
// *------------------------------------------ move on game container
startButton.addEventListener("click",()=>{
    touchSfx()
    audioPlayer.play();
    gameContainerImg.style.display='none'
    gameContainer.style.display='flex'
})
// *------------------------------------------ move on game container 
function jump() {
    birdVelocity = -8; // Reduced jump strength for easier control
}

function createPipe() {
    const pipeGap = 300; // Increased gap between pipes
    const minHeight = 50; // Minimum height for a pipe
    const maxHeight = 400; // Maximum height for a pipe

    const bottomPipeHeight = Math.random() * (maxHeight - minHeight) + minHeight;
    const topPipeHeight = 600 - bottomPipeHeight - pipeGap;

    const pipe = document.createElement('div');
    pipe.className = 'pipe';
    pipe.style.height = `${bottomPipeHeight}px`;
    pipe.style.left = '400px';
    pipe.style.bottom = '0';
    gameContainer.appendChild(pipe);

    const topPipe = document.createElement('div');
    topPipe.className = 'pipe';
    topPipe.style.height = `${topPipeHeight}px`;
    topPipe.style.left = '400px';
    topPipe.style.top = '0';
    gameContainer.appendChild(topPipe);

    pipes.push({ bottom: pipe, top: topPipe, passed: false });
}

function updateGame() {
    if (!gameStarted) return;

    birdVelocity += gravity;
    birdY += birdVelocity;
    bird.style.top = `${birdY}px`;

    pipes.forEach(pipe => {
        const pipeLeft = parseInt(pipe.bottom.style.left);
        pipe.bottom.style.left = `${pipeLeft - 1.5}px`; // Slowed down pipe movement
        pipe.top.style.left = `${pipeLeft - 1.5}px`; // Slowed down pipe movement

        if (pipeLeft < -60) {
            gameContainer.removeChild(pipe.bottom);
            gameContainer.removeChild(pipe.top);
            pipes.shift();
        }

        if (pipeLeft < 50 && pipeLeft > -10 && !pipe.passed) {
            if (birdY < parseInt(pipe.top.style.height) || 
                birdY + 40 > 600 - parseInt(pipe.bottom.style.height)) {
                gameOver();
            }
            if (pipeLeft < 0) {
                pipe.passed = true;
                score++;
                scoreElement.textContent =`Score:${score}`;
            }
        }
    });

    if (birdY > 560 || birdY < 0) {
        gameOver();
    }

    if (pipes.length === 0 || 400 - parseInt(pipes[pipes.length - 1].bottom.style.left) > 250) { // Increased distance between pipes
        createPipe();
    }
}

function gameOver() {
    gameOverSms.style.display='block'
    playBtn.disabled=true
    gameOverSfx()
    setTimeout(() => {
        playBtn.disabled=false
        gameOverSms.style.display='none'
    }, 9000);
    clearInterval(gameLoop);
    gameStarted = false;
    playBtn.style.display = 'block';
}

function startGame() {
    startSfx()
    if (gameStarted) return;

    gameStarted = true;
    birdY = 300;
    birdVelocity = 0;
    score = 0;
    scoreElement.innerHTML = `Score:${score}`;
    pipes.forEach(pipe => {
        gameContainer.removeChild(pipe.bottom);
        gameContainer.removeChild(pipe.top);
    });
    pipes = [];
    playBtn.style.display = 'none';
    gameLoop = setInterval(updateGame, 20);
}

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        if (!gameStarted) {
            startGame();
        } else {
            jump();
        }
    }
});

playBtn.addEventListener('click', startGame);

gameContainer.addEventListener('click', () => {
    if (gameStarted) {
        jump();
    }
});
// ?-------------------------------------audio section bolate
let audioPlayer = document.querySelector("#audio-player")
let sfxPlayer = document.querySelector("#sfx-player")
audioPlayer.volume='0.1';
function playBgMusic(){
    audioPlayer.play();
}
function touchSfx(){
    sfxPlayer.src='click.mp3'
    sfxPlayer.play()
}
function gameOverSfx(){
    sfxPlayer.src='moye-moye.m4a'
    sfxPlayer.play()
}
function oksfx(){
    sfxPlayer.src='pew.mp3'
    sfxPlayer.play()
}
function startSfx(){
    sfxPlayer.src='ooof.mp3'
    sfxPlayer.play()
}
ok.addEventListener("click",()=>{
    oksfx()
rulesDiv.style.display='none'
})