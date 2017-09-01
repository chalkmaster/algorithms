class Queen {
    /**
     * 
     * @param {{left:Number, top: Number}} field 
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
            emptyFields.push({ top, left });
}