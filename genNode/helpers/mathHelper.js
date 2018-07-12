class MathHelper {
    /**
     * retorna um numero aleatóreo entre o mínimo (incluseve) e o máximo (exclusive)
     * @param {Number} min valor mínimo retornável (inclusive)
     * @param {Number} max valor máximo retornável (exclusive)
     */
    getRandomDouble(min, max) {
        return Math.random() * (max - min) + min;
    }

    /**
     * Retorna um inteiro aleatório entre dois números inteiros
     * @param {Number} min valor mínimo retornável (inclusive)
     * @param {Number} max valor máximo retornável (inclusive)
     */
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getRandom() {
        return Math.random();
    }

}
module.exports = new MathHelper();