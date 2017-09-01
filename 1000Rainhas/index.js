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
                output += "x";
            else
                output += "0";
        }
        output += "\n";
    }
    console.log(output);
}

function clear(ctop, cleft) {
    emptyFields.splice(emptyFields.indexOf(`${ctop}x${cleft}`));

    for (let left = cleft; left < rightBoundary; left++) {
        const top = ctop;
        emptyFields.splice(emptyFields.indexOf(`${top}x${left}`));
    }
    for (let top = ctop; top < bottomBoundary; top++) {
        const left = cleft;
        emptyFields.splice(emptyFields.indexOf(`${top}x${left}`));
    }
    for (let left = cleft; left < rightBoundary; left++) {
        const top = ctop;
        emptyFields.splice(emptyFields.indexOf(`${top}x${left}`));
    }
    for (let top = ctop; top > topBoundary; top--) {
        const left = cleft;
        emptyFields.splice(emptyFields.indexOf(`${top}x${left}`));
    }
    for (let left = cleft; left < rightBoundary; left++) {
        const top = ctop;
        emptyFields.splice(emptyFields.indexOf(`${top}x${left}`));
    }
}
initializeFields();
print();