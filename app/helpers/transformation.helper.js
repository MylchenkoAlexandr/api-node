class TransformationHelper {
    /**
     * Format phone number for valid state
     * @param {string} phone 
     */
    phoneNumber(phone) {
        let cleaned = ('' + phone).replace(/\D/g, '');

        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            let intlCode = (match[1] ? '+1 ' : '');

            return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
        }
    }

    formatPhoneForCall(phone) {
        return "+1" + phone.replace(/\D/g, "");
    }

    /**
     * Date formatting with american standart
     * @param {Date} date 
     * @param {Date} time 
     */
    formatDate(date, time = null) {
        let newDate = new Date(date);
        const yy = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(newDate);
        const mm = new Intl.DateTimeFormat('en', { month: '2-digit' }).format(newDate);
        const dd = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(newDate);
        const timeF = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: 'numeric', second: 'numeric', }).format(newDate);

        if (time) return `${mm}/${dd}/${yy} ${timeF}`;

        return mm + '/' + dd + '/' + yy;
    }

    /*
    * Formating number e.g 1000 on 1,000
    */
    numberWithCommas(number) {
        if (typeof number == 'string') return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

module.exports = new TransformationHelper;