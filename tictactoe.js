document.addEventListener("DOMContentLoaded", function () {
    const boardElement = document.querySelector(".board");
    const statusElement = document.querySelector(".status");
    const timerElement = document.getElementById("timer");

    let board = ["", "", "", "", "", "", "", "", ""];
    let currentPlayer = "X";
    let gameActive = true;
    let timeRemaining = 120; // 2 minutes countdown

    // Create the board dynamically
    function createBoard() {
        boardElement.innerHTML = "";
        board.forEach((cell, index) => {
            const cellElement = document.createElement("div");
            cellElement.classList.add("cell");
            cellElement.dataset.index = index;
            cellElement.textContent = cell;
            if (cell) cellElement.classList.add("taken");
            cellElement.addEventListener("click", handleCellClick);
            boardElement.appendChild(cellElement);
        });
    }

    // Handle a player's move
    function handleCellClick(event) {
        const index = event.target.dataset.index;
        if (!gameActive || board[index] !== "") return;

        board[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add("taken");

        if (checkWinner(currentPlayer)) {
            statusElement.textContent = `${currentPlayer} Wins!`;
            gameActive = false;
            return;
        }

        if (board.every(cell => cell)) {
            statusElement.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        // Switch to AI move
        currentPlayer = "O";
        statusElement.textContent = "AI's Turn";
        setTimeout(aiMove, 500);
    }

    // Simple AI move (random available cell)
    function aiMove() {
        if (!gameActive) return;

        let emptyCells = board.map((cell, index) => cell === "" ? index : null).filter(val => val !== null);
        if (emptyCells.length === 0) return;

        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = "O";

        createBoard();

        if (checkWinner("O")) {
            statusElement.textContent = "AI Wins!";
            gameActive = false;
            return;
        }

        if (board.every(cell => cell)) {
            statusElement.textContent = "It's a Draw!";
            gameActive = false;
            return;
        }

        currentPlayer = "X";
        statusElement.textContent = "Your Turn!";
    }

    // Check for a winner
    function checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        return winPatterns.some(pattern => 
            pattern.every(index => board[index] === player)
        );
    }

    // Reset the game every 2 minutes
    function resetGame() {
        board = ["", "", "", "", "", "", "", "", ""];
        currentPlayer = "X";
        gameActive = true;
        statusElement.textContent = "New Game Started!";
        createBoard();
        timeRemaining = 120; // Reset countdown
    }

    // Countdown timer for game reset
    function updateTimer() {
        if (timeRemaining > 0) {
            timeRemaining--;
            timerElement.textContent = `Time remaining: ${timeRemaining} sec`;
        } else {
            resetGame();
        }
    }

    // Start the first game
    createBoard();

    // Set an interval to reset the game every 2 minutes (120 seconds)
    setInterval(updateTimer, 1000);
    setInterval(resetGame, 120000);
});
