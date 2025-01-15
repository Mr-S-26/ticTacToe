const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const resetBoard = () => { board = ["", "", "", "", "", "", "", "", ""]; };
    const setMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };
    return { getBoard, resetBoard, setMove };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    let player1;
    let player2;
    let currentPlayer;
    let gameOver = false;

    const switchPlayer = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const combo of winningCombinations) {
            const [a, b, c] = combo;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                gameOver = true;
                return `${currentPlayer.name} wins!`;
            }
        }
        if (!board.includes("")) {
            gameOver = true;
            return "It's a tie!";
        }
        return null;
    };

    const playTurn = (index) => {
        if (gameOver) return "Game is already over!";
        if (Gameboard.setMove(index, currentPlayer.marker)) {
            const result = checkWin();
            if (result) return result;
            switchPlayer();
            return `${currentPlayer.name}'s turn!`;
        } else {
            return "Spot already taken!";
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        gameOver = false;
        currentPlayer = player1;
    };

    const startGame = (name1, name2) => {
        player1 = Player(name1, "X");
        player2 = Player(name2, "O");
        currentPlayer = player1;
    };

    return { playTurn, resetGame, startGame, getCurrentPlayer: () => currentPlayer };
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const messageDisplay = document.querySelector(".message");
    const restartButton = document.querySelector(".restart");
    const startButton = document.querySelector("#start-game");
    const playerInputs = document.querySelector(".player-inputs");
    const gameboardDiv = document.querySelector(".gameboard");

    const renderBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const updateMessage = (message) => {
        messageDisplay.textContent = message;
    };

    const addEventListeners = () => {
        cells.forEach((cell, index) => {
            cell.addEventListener("click", () => {
                const result = GameController.playTurn(index);
                renderBoard();
                updateMessage(result);
            });
        });

        restartButton.addEventListener("click", () => {
            GameController.resetGame();
            renderBoard();
            updateMessage(`${GameController.getCurrentPlayer().name}'s turn!`);
        });

        startButton.addEventListener("click", () => {
            const player1Name = document.querySelector("#player1-name").value || "Player 1";
            const player2Name = document.querySelector("#player2-name").value || "Player 2";
            GameController.startGame(player1Name, player2Name);
            playerInputs.style.display = "none";
            gameboardDiv.style.display = "grid";
            messageDisplay.style.display = "block";
            restartButton.style.display = "inline-block";
            updateMessage(`${player1Name}'s turn!`);
        });
    };

    return { renderBoard, updateMessage, addEventListeners };
})();

DisplayController.renderBoard();
DisplayController.addEventListeners();
