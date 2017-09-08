function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const problemSize = 8;
const board = {};

function initializeBoard() {
    for (let col = 0; col < problemSize; col++) {
        board[col] = {e:[]};
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
    let rdCol = 0;
    let rdRow = 0;

    if (row + col + 1 > problemSize){
        rdCol = problemSize - 1;
        rdRow = row - (problemSize - col - 1);
    }
    else {
        rdCol = col + row;
    }
    if (row > col){
        ldRow = row - col;
    } else {
        ldCol = col - row;
    }
    
    for (let i = 0; i < problemSize; i++) {
        board[i][row] = board[i][row] == "[Q]" ? "[Q]" : "[•]";
        board[col][i] = board[col][i] == "[Q]" ? "[Q]" : "[•]";
        if(ldCol < problemSize && ldRow < problemSize)
            board[ldCol++][ldRow++]= board[ldCol-1][ldRow-1] ==  "[Q]" ? "[Q]" : "[•]";
        
        if(rdCol >= 0 && rdRow < problemSize)
             board[rdCol--][rdRow++] = board[rdCol+1][rdRow-1] == "[Q]" ? "[Q]" : "[•]";        
    }
    board[col][row] = "[Q]";
}

function countBlock(row, col){
    let qtd = 0;
    let ldCol = 0;
    let ldRow = 0;
    let rdCol = 0;
    let rdRow = 0;

    if (row + col + 1 > problemSize){
        rdCol = problemSize - 1;
        rdRow = row - (problemSize - col - 1);
    }
    else {
        rdCol = col + row;
    }
    if (row > col){
        ldRow = row - col;
    } else {
        ldCol = col - row;
    }
    
    for (let i = 0; i < problemSize; i++) {
        qtd += board[i][row] != "[ ]" ? 0 : 1;
        qtd += board[col][i] != "[ ]" ? 0 : 1;
        if(ldCol < problemSize && ldRow < problemSize)
            qtd += board[ldCol++][ldRow++] != "[ ]" ? 0 : 1;
        
        if(rdCol >= 0 && rdRow < problemSize)
             qtd += board[rdCol--][rdRow++] != "[ ]" ? 0 : 1;
    }
    return qtd;
}

initializeBoard();
let queen = 0;
while(queen < problemSize){    
    let min = problemSize * 4;
    let fcol = 0;
    let frow = 0;
    for (let row = 0; row < problemSize; row++) {
        for (let col = 0; col < problemSize; col++) {
            if (board[col][row] != '[ ]')
                continue;
            let atual = countBlock(row, col);
            if (atual < min){
                min = atual;
                fcol = col;
                frow = row;
            }
        }
    }
    blockFiledsFor(frow,fcol);
    queen++;
    print();
}
console.log('end');

// const run = problemSize/2;
// let q = 0;
// while(q <= run+1){
//     let pos = 0;

//     while (board[q][pos] != '[ ]' && pos < problemSize)
//         pos++;
    
//     if (pos < problemSize)
//         blockFiledsFor(pos,q);

//     pos = problemSize -1;
//     while (board[problemSize - 1 - q][pos] != '[ ]')
//         pos--;

//     blockFiledsFor(pos,problemSize - 1 - q);    
//     q++;
//     print();
// }

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
