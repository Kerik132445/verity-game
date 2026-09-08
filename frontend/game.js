let gameState = {
	anger: 0,
	love: 0,
	lives: 3,
	level: 1
};

const MAX_ANGER = 100;
const MAX_LOVE = 100;


function goodChoice() {
	gameState.anger -= 20;

	if (gameState.anger < 0) {
		gameState.love = Math.min(
			MAX_LOVE,
			gameState.love + Math.abs(gameState.anger)
		);

		gameState.anger = 0;
	}

	updateUI();
}

function badChoice() {
	gameState.anger += 20;

	if (gameState.anger >= MAX_ANGER) {
		loseLife();
	}

	updateUI();
}

function loseLife() {
	gameState.lives--;
	gameState.anger = 0;

	showScreamer();

	if (gameState.lives <= 0) {
		gameOver();
	}
}