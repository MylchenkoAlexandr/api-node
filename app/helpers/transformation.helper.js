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

    date(date) {
        const date_now = new Date(date);
        const year = date_now.getFullYear();
        const month = (date_now.getMonth() + 1).toString().length === 1 ? `0${date_now.getMonth() + 1}` : date_now.getMonth() + 1;
        const day = (date_now.getDate()).toString().length === 1 ? `0${date_now.getDate()}` : date_now.getDate();
        return `${year}${month}${day}`;
    }

    /*
    * Formating number e.g 1000 on 1,000
    */
    numberWithCommas(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}

module.exports = new TransformationHelper;