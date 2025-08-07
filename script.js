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
        if (board[row][column].getValue() !== 0) return;

        board[row][column].addToken(player);
    };

    return { getBoard, placeToken, printBoard };
})();

// 0: empty
// 1: X
// 2: O

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

    const checkForWinner = () => {
        // row
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                board[i][j].getValue();
            }
        }

        // column

        // diagonal

        // tie
    };

    const playRound = (row, column) => {
        console.log(`Placing ${getActivePlayer().name}'s token into row ${row}, column ${column}...`);
        gameBoard.placeToken(row, column, getActivePlayer().token);

        checkForWinner();

        switchPlayerTurn();
        printNewRound();
    };

    printNewRound();

    return { playRound, getActivePlayer };
})();

gameController.playRound(0, 0);
gameController.playRound(0, 1);
gameController.playRound(0, 2);
gameController.playRound(1, 2);
gameController.playRound(1, 1);
gameController.playRound(2, 0);
gameController.playRound(2, 2);
