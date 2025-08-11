const gameBoard = (function () {
    const board = [];
    const empty = "";

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board.map((row) => row.map((cell) => cell.getValue())));
    };

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() === empty) {
            board[row][column].addToken(player);
            return true;
        } else {
            return false;
        }
    };

    // check array if all items are the same
    const whoIsTheWinner = (arr) => {
        let target = arr[0].getValue();
        for (const item of arr) {
            if (item.getValue() !== target) {
                return null;
            }
        }

        if (arr[0].getValue() == "X") {
            return 1;
        }
        if (arr[0].getValue() == "O") {
            return 2;
        }
    };

    const checkFor3 = () => {
        for (let i = 0; i < 3; i++) {
            // row
            let three_in_a_row = whoIsTheWinner(board[i]);
            // column
            let three_in_a_col = whoIsTheWinner([board[0][i], board[1][i], board[2][i]]);

            if (three_in_a_row === 1 || three_in_a_row === 2) {
                return three_in_a_row;
            }
            if (three_in_a_col === 1 || three_in_a_col === 2) {
                return three_in_a_col;
            }
        }

        // diagonal
        let three_in_a_diagonal_top_left = whoIsTheWinner([board[0][0], board[1][1], board[2][2]]);
        let three_in_a_diagonal_top_right = whoIsTheWinner([board[0][2], board[1][1], board[2][0]]);

        if (three_in_a_diagonal_top_left === 1 || three_in_a_diagonal_top_left === 2) {
            return three_in_a_diagonal_top_left;
        }

        if (three_in_a_diagonal_top_right === 1 || three_in_a_diagonal_top_right === 2) {
            return three_in_a_diagonal_top_right;
        }

        let noMoreCell = true;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j].getValue() === empty) {
                    noMoreCell = false;
                }
            }
        }
        if (noMoreCell) {
            return 0;
        }
    };

    return { getBoard, placeToken, printBoard, checkFor3 };
})();

function Cell() {
    let value = "";

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

const playerController = (function () {
    const players = [];

    const getPlayer = (number) => {
        return players[number - 1];
    };
    const createPlayer = (name, token) => {
        players.push({ name, token });
    };

    let activePlayer;

    const getActivePlayer = () => activePlayer;
    const setActivePlayer = () => {
        activePlayer = players[Math.floor(Math.random() * 1)];
    };

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    createPlayer("ada", "X");
    createPlayer("baba", "O");
    setActivePlayer();

    return { getPlayer, createPlayer, setActivePlayer, getActivePlayer, switchPlayerTurn };
})();

const gameController = (function () {
    const printNewRound = () => {
        gameBoard.printBoard();
    };

    const playRound = (row, column) => {
        if (!gameBoard.placeToken(row, column, playerController.getActivePlayer().token)) {
            return;
        }

        playerController.switchPlayerTurn();

        printNewRound();

        return gameBoard.checkFor3();
    };

    return { playRound };
})();

const screenController = (function () {
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const winnerDiv = document.querySelector(".winner");

    const updateScreen = () => {
        if (!players.length) {
            return;
        }

        boardDiv.textContent = "";

        const board = gameBoard.getBoard();
        const activePlayer = gameController.getActivePlayer();

        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;

        // Render board squares
        board.forEach((row, index) => {
            let rowIndex = index;

            row.forEach((cell, index) => {
                const cellButton = document.createElement("button");

                cellButton.classList.add("cell");
                cellButton.dataset.row = rowIndex;
                cellButton.dataset.column = index;
                cellButton.textContent = cell.getValue();

                boardDiv.appendChild(cellButton);
            });
        });
    };

    function clickHandlerBoard(e) {
        if (!players.length) {
            return;
        }

        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        winnerDiv.textContent = gameController.playRound(selectedRow, selectedColumn);

        updateScreen();
    }

    const dialog = document.querySelector("dialog");
    const form = document.querySelector("form");
    const showBtn = document.querySelector(".start");
    const closeBtn = document.querySelector(".close");

    showBtn.addEventListener("click", () => {
        dialog.showModal();
    });

    closeBtn.addEventListener("click", () => {
        dialog.close();
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        let formObj = Object.fromEntries(new FormData(form));

        players = [createPlayer(formObj.player1, "X"), createPlayer(formObj.player2, "O")];

        updateScreen();

        dialog.close();
    });

    boardDiv.addEventListener("click", clickHandlerBoard);
})();
