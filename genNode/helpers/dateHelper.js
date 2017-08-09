/**
 * Calcula a diferença de dias entre duas datas.
 * @param {Date} date1 
 * @param {Date} date2 
 */
function daysDiff(date1, date2){
    return (date1 - date2) / 36e5;
}

/**
 * Calcula a diferença de dias entre duas datas e retorna o valor absoluto da diferença
 * @param {Date} date1 
 * @param {Date} date2 
 */
function daysDiffAbs(date1, date2){
    return Math.abs((date1 - date2) / 36e5);
}

module.exports = {
    daysDiff,
    daysDiffAbs,
};