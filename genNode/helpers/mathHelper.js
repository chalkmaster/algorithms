/**
 * retorna um numero aleatóreo entre o mínimo (incluseve) e o máximo (exclusive)
 * @param {Number} min valor mínimo retornável (inclusive)
 * @param {Number} max valor máximo retornável (exclusive)
 */
function getRandomDouble(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * Retorna um inteiro aleatório entre dois números inteiros
 * @param {Number} min valor mínimo retornável (inclusive)
 * @param {Number} max valor máximo retornável (inclusive)
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    getRandomDouble,
    getRandomInt,
}