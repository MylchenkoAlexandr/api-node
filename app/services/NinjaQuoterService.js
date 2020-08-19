const axios = require('axios');

class NinjaQuoter {
    constructor(companiesList, customerInfo) {
        this.companies = companiesList;
        this.customerQuoteFilds = customerInfo;
    }

    /**
     * Return list filtered companies
     */
    async getQuotes() {
        try {
            const ninjaQuoterCompanies = await this.fetchCompanyListFromNinjaQuoter();

            return new Promise((resolve, reject) => {
                if (ninjaQuoterCompanies) {
                    resolve(this.filterCompanies(ninjaQuoterCompanies));
                } else reject();
            })
        } catch (error) {
            throw error;
        }
    }

    filterCompanies(ninjaQuoterCompanies) {
        ninjaQuoterCompanies.forEach(comp => {
            if (this.companies[comp.company_code] == 0 && comp.company_code in this.companies)
                this.companies[comp.company_code] = comp.premium_monthly
        });

        return this.companies;
    }

    /**
     * Fetch companies list from Ninja Quoter API 
     */
    fetchCompanyListFromNinjaQuoter() {
        return new Promise((resolve, reject) => {
            axios.get(`https://wq.ninjaquoter.com/api/quoter/quotes/?state=${this.customerQuoteFilds.state}&birthdate=${this.customerQuoteFilds.birthdate}&gender=${this.customerQuoteFilds.gender}&rate_class=${this.customerQuoteFilds.rate_class}&smoker=${this.customerQuoteFilds.smoker}&coverage=${this.customerQuoteFilds.coverage}&term=${this.customerQuoteFilds.term}`, {
                auth: {
                    username: process.env.NINJA_QUOTER_API_TOKEN || '',
                    password: ''
                }
            }).then(res => {
                return resolve(res.data.results);
            }).catch(e => {
                console.error(e);
                return reject();
            });
        });
    }
}

module.exports = NinjaQuoter;