const axios = require('axios');

class NinjaQuoter {
    constructor(companiesList) {
        this.companies = companiesList;
    }

    /**
     * Return list filtered companies
     * 
     */
    async filteredCompanies() {
        try {
            const companies = await this.fetchCompanyListFromNinjaQuoter();

            return new Promise((resolve, reject) => {
                if (companies) {
                    resolve(companies);
                } else reject([]);
            })
        } catch (error) {
            return [];
        }
    }

    /**
     * Fetch companies list from Ninja Quoter API 
     * @TODO add parameters for this function 
     */
    fetchCompanyListFromNinjaQuoter() {
        return new Promise((resolve, reject) => {
            axios.get('https://wq.ninjaquoter.com/api/quoter/quotes/?state=CO&birthdate=2001-05-23&gender=m&rate_class=lb&smoker=true&coverage=4000&term=fex', {
                auth: {
                    username: process.env.NINJA_QUOTER_API_TOKEN || '',
                    password: ''
                }
            }).then(res => {
                return resolve(res.data.results);
            }).catch(e => {
                console.error(e);
                return reject([]);
            });
        });
    }
}

module.exports = NinjaQuoter;