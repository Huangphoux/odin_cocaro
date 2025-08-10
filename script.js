const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));

        console.log(boardWithCellValues);
    };

    const placeToken = (row, column, player) => {
        if (board[row][column].getValue() !== 0) return false;

        board[row][column].addToken(player);

        return true;
    };

    // check an array of 3 items
    const whoIsTheWinner = (arr) => {
        if (arr[1].getValue() === arr[0].getValue() && arr[1].getValue() === arr[2].getValue()) {
            if (arr[1].getValue() == 1) {
                return 1;
            }
            if (arr[1].getValue() == 2) {
                return 2;
            }
        }
    };

    const checkFor3 = () => {
        for (let i = 0; i < rows; i++) {
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
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (board[i][j].getValue() === 0) {
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
    let value = 0;

    const addToken = (player) => {
        value = player;
    };

    const getValue = () => value;

    return { addToken, getValue };
}

function createPlayer(name, token) {
    return { name, token };
}

const gameController = (function (playerOneName = "Player One", playerTwoName = "Player Two") {
    const players = [createPlayer(playerOneName, 1), createPlayer(playerTwoName, 2)];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        gameBoard.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    //0: tie
    //1: 1 wins
    //2: 2 wins
    const playRound = (row, column) => {
        if (!gameBoard.placeToken(row, column, getActivePlayer().token)) {
            return;
        }

        let result = gameBoard.checkFor3();

        if ([1, 2].includes(result)) {
            console.log(`The winner is ${players[result - 1].name} !`);
        } else if (result === 0) {
            console.log("The game is tied.");
        } else {
            switchPlayerTurn();
        }
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer };
})();

const screenController = (function () {
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
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
        const selectedRow = e.target.dataset.row;
        const selectedColumn = e.target.dataset.column;

        if (!selectedColumn) return;

        gameController.playRound(selectedRow, selectedColumn);
        updateScreen();
    }

    boardDiv.addEventListener("click", clickHandlerBoard);

    updateScreen();
})();
