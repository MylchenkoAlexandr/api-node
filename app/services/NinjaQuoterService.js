const axios = require('axios');
const _ = require('lodash');

class NinjaQuoterService {

    constructor(customerInfo) {
        const preferedCompanies = {
            mutual_omaha_express: 0,
            foresters_express: 0,
            sagicor_express_issue: 0,
            american_general: 0
        };

        const preferedCompaniesFEX = {
            mutual_omaha: 0,
            royal_neighbors: 0,
            liberty_bankers: 0,
        };

        this.companies = customerInfo.term == 'fex' ? preferedCompaniesFEX : preferedCompanies;
        this.customerQuoteFilds = customerInfo;
    }

    /**
     * Return list filtered companies
     */
    fetchQuotes() {
        return new Promise((resolve, reject) => {
            this.fetchCompanyListFromNinjaQuoter()
                .then(companies => {
                    if (companies) {
                        resolve(companies);
                    } else {
                        reject();
                    }
                }).catch(e => reject(e));
        });
    }

    /**
     * Return Price 
     */
    async getPrice() {
        try {
            const companies = await this.fetchQuotes();
            companies.forEach(comp => {
                if (comp.company_code in this.companies && this.companies[comp.company_code] == 0)
                    this.companies[comp.company_code] = comp.premium_monthly
            });

            return this.companies;
        } catch (error) {
            console.error(error);
        }
    }

    /**
     * Return full companies info
     */
    async getCompaniesInfo() {
        try {
            const companies = await this.fetchQuotes();

            let companiesFullData = companies.filter(comp => {
                return comp.company_code in this.companies;
            });

            return _.uniqBy(companiesFullData, 'company_code');
        } catch (error) {
            console.error(error)
        }
        return [];
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

module.exports = NinjaQuoterService;