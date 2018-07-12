class DateHelper {
    /**
     * @param {String} sapDate 
     * @param {String} sapTime 
     * @returns {Date}
     */
    static dateFromSapDate(sapDate = '', sapTime = '') {
        const normalizedDateString = sapDate.replace('/', '').replace('/', '');
        let date = eval(`new ${normalizedDateString}`);
        date = date.toUTC();
        if (sapTime) {
            const hours = sapTime.substring(2, 4);
            const min = sapTime.substring(5, 7);
            const sec = sapTime.substring(8, 10);
            date.setHours(hours, min, sec);
        }
        return date;
    }

    static hoursDiffAbs(dateA, dateB) {
        return Math.abs(dateA - dateB) / 36e5;
    }

    static minutesDiffAbs(dateA, dateB) {
        return Math.abs(dateA - dateB) / 6e4;
    }

    static nextMonday(){
        var d = new Date();
        d.setDate(d.getDate() + (1 + 7 - d.getDay()) % 7);
        d.setHours(0, 0, 0, 0);
        return d;
    }
}

module.exports =  DateHelper;