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
}

module.exports = new TransformationHelper;