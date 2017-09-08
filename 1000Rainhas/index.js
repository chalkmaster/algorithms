const problemSize = 8;
const board = {};

function initializeBoard() {
    for (let col = 0; col < problemSize; col++) {
        board[col] = {};
        for (let row = 0; row < problemSize; row++) {
            board[col][row] = "[ ]";
        }
    }
}
function print(){
    let s = '';
    for (let row = 0; row < problemSize; row++) {
        for (let col = 0; col < problemSize; col++) {
            s += board[col][row];
        }
        s += '\n';
    }
    console.log(s);
}
function blockFiledsFor(row, col){
    let ldCol = 0;
    let ldRow = 0;
    let rdCol = problemSize - 1;
    let rdRow = problemSize - 1;

    if (row > col){
        ldRow = row - col;
        rdRow -= ldRow;
    }
    else {
        ldCol = col - row;
        rdCol -= ldCol;
    }

    for (let i = 0; i < problemSize; i++) {
        board[i][row] = "[•]";
        board[col][i] = "[•]";
        board[ldCol++][ldRow++] = "[•]";
        board[rdCol--][rdRow--] = "[•]";        
    }
    board[col][row] = "[Q]";
}
initializeBoard();
blockFiledsFor(4,4);
print();
//----------------

// const topBoundary = 0;
// const bottomBoundary = 8;
// const leftBoundary = 0;
// const rightBoundary = 8;
// const countOfQueens = 8;

// let emptyFields = [];
// let queens = [];

// function initializeFields() {
//     for (let top = topBoundary; top < bottomBoundary; top++)
//         for (let left = leftBoundary; left < rightBoundary; left++)
//             emptyFields.push(`${top}x${left}`);
// }

// // function print() {
// //     let output = '';
// //     for (let left = leftBoundary; left < rightBoundary; left++) {
// //         for (let top = topBoundary; top < bottomBoundary; top++) {
// //             if (queens.indexOf(`${top}x${left}`) != -1)
// //                 output += '[ Q ] ';
// //             else if (emptyFields.indexOf(`${top}x${left}`) == -1)
// //                 output += '[ x ] ';
// //             else
// //                 output += `[${top}x${left}] `;
// //         }
// //         output += "\n";
// //     }
// //     console.log(output);
// // }

// function clear(queenTop, queenLeft) {
//     //limpa da esquerda pra direita
//     for (let left = leftBoundary; left < rightBoundary; left++) {
//         emptyFields.splice(emptyFields.indexOf(`${queenTop}x${left}`), 1);
//     }
//     //limpa de cima em baixo
//     for (let top = topBoundary; top < bottomBoundary; top++) {
//         const index = emptyFields.indexOf(`${top}x${queenLeft}`);
//         if (index > -1)
//             emptyFields.splice(index, 1);
//     }
//     //limpa diagonal esquerda
//     let top = queenTop;
//     let left = queenLeft;
//     for (; left >= leftBoundary && top >= topBoundary;) {
//         const index = emptyFields.indexOf(`${top}x${left}`);
//         if (index > -1)
//             emptyFields.splice(index, 1);
//         top--;
//         left--;
//     }
//     top = queenTop;
//     left = queenLeft;
//     for (; left <= rightBoundary && top <= bottomBoundary;) {
//         const index = emptyFields.indexOf(`${top}x${left}`);
//         if (index > -1)
//             emptyFields.splice(index, 1);
//         top++;
//         left++;
//     }
//     top = queenTop;
//     left = queenLeft;
//     for (; left >= leftBoundary && top >= topBoundary;) {
//         const index = emptyFields.indexOf(`${top}x${left}`);
//         if (index > -1)
//             emptyFields.splice(index, 1);
//         top--;
//         left++;
//     }
//     top = queenTop;
//     left = queenLeft;
//     for (; left <= rightBoundary && top <= bottomBoundary;) {
//         const index = emptyFields.indexOf(`${top}x${left}`);
//         if (index > -1)
//             emptyFields.splice(index, 1);
//         top++;
//         left--;
//     }
// }
// function getRandomInt(min, max) {
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// initializeFields();
// print();

// let col = 0;
// let row = countOfQueens;
// while (queens.length < countOfQueens) {
//     if (emptyFields.length === 0) {
//         console.log("error, no field to put queen - " + queens.length);
//         print();
//         break;
//     }
//     let pos = getRandomInt(init, final - 1);
//     let field = emptyFields[pos];
//     queens.push(field);
//     let top = parseInt(field.split("x")[0]);
//     let left = parseInt(field.split("x")[1]);
//     clear(top, left);
//     print();
// }
