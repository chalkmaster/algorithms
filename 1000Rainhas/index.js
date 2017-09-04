class Queen {
    /**
     * 
     * @param {{top:Number, left: Number}} field 
     */
    constructor(field) {
        this.field = field;
    }
}
const topBoundary = 0;
const bottomBoundary = 8;
const leftBoundary = 0;
const rightBoundary = 8;
const countOfQueens = 8;

let emptyFields = [];
let queens = [];

function initializeFields() {
    for (let top = topBoundary; top < bottomBoundary; top++)
        for (let left = leftBoundary; left < rightBoundary; left++)
            emptyFields.push(`${top}x${left}`);
}

function print() {
    let output = '';
    for (let left = leftBoundary; left < rightBoundary; left++) {
        for (let top = topBoundary; top < bottomBoundary; top++) {
            if (emptyFields.indexOf(`${top}x${left}`) == -1)
                output += "[ x ] ";
            else
                output += `[${top}x${left}] `;
        }
        output += "\n";
    }
    console.log(output);
}

function clear(queenTop, queenLeft) {
    //limpa da esquerda pra direita
    for (let left = leftBoundary; left < rightBoundary; left++) {
        emptyFields.splice(emptyFields.indexOf(`${queenTop}x${left}`),1);
    }
    //limpa de cima em baixo
    for (let top = topBoundary; top < bottomBoundary; top++) {
        const index = emptyFields.indexOf(`${top}x${queenLeft}`);
        if (index > -1)
            emptyFields.splice(index,1);
    }
    //limpa diagonal esquerda
    let top = queenTop;
    let left = queenLeft;
    for (;left >= leftBoundary && top >= topBoundary;) {
        const index = emptyFields.indexOf(`${top}x${left}`);
        if (index > -1)
            emptyFields.splice(index,1);
        top--;
        left--;
    }
    top = queenTop;
    left = queenLeft;
    for (;left <= rightBoundary && top <= bottomBoundary;) {
        const index = emptyFields.indexOf(`${top}x${left}`);
        if (index > -1)
            emptyFields.splice(index,1);
        top++;
        left++;
    }
    top = queenTop;
    left = queenLeft;
    for (;left >= leftBoundary && top >= topBoundary;) {
        const index = emptyFields.indexOf(`${top}x${left}`);
        if (index > -1)
            emptyFields.splice(index,1);
        top--;
        left++;
    }
    top = queenTop;
    left = queenLeft;
    for (;left <= rightBoundary && top <= bottomBoundary;) {
        const index = emptyFields.indexOf(`${top}x${left}`);
        if (index > -1)
            emptyFields.splice(index,1);
        top++;
        left--;
    }
}
initializeFields();
print();
clear(4,4);
print();
