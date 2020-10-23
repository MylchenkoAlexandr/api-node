const axios = require('axios');
const _ = require('lodash');

class NinjaQuoterService {

    constructor(customerInfo) {
        const preferedCompanies = {
            mutual_omaha_express: 0,
            foresters_express: 0,
            sagicor_express_issue: 0,
            american_general: 0,
            american_national: 0,
        };

        const preferedCompaniesFEX = {
            mutual_omaha: 0,
            royal_neighbors: 0,
            liberty_bankers: 0,
            prosperity_life: 0,
            foresters: 0
        };

        this.companies = customerInfo.term == 'fex' ? preferedCompaniesFEX : preferedCompanies;
        this.customerQuoteFilds = customerInfo;
    }

    /**
     * Return list filtered companies
     */
    // async fetchQuotes() {
    //     try {
    //         const companies = await this.fetchCompanyListFromNinjaQuoter();
    //         return companies;
    //     } catch (error) {
    //         throw error;
    //     }
    // }

    /**
     * Return Price 
     */
    getPrice(companies) {
        try {
            companies.forEach(comp => {
                if (comp.company_code in this.companies && this.companies[comp.company_code] == 0)
                    this.companies[comp.company_code] = comp.premium_monthly
            });

            return this.companies;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Return full companies info
     */
    getCompaniesInfo(companies) {
        try {
            let companiesFullData = companies.filter(comp => comp.company_code in this.companies);

            const uniq_companies = _.uniqBy(companiesFullData, 'company_code');

            uniq_companies.sort((prev, next) => prev.premium_monthly - next.premium_monthly);

            return uniq_companies;
        } catch (error) {
            throw error
        }
    }

    /**
     * Fetch companies list from Ninja Quoter API 
     */
    async fetchCompanyListFromNinjaQuoter() {
        try {
            const response = await axios.get(`https://wq.ninjaquoter.com/api/quoter/quotes/?state=${this.customerQuoteFilds.state}&birthdate=${this.customerQuoteFilds.birthdate}&gender=${this.customerQuoteFilds.gender}&rate_class=${this.customerQuoteFilds.rate_class}&smoker=${this.customerQuoteFilds.smoker}&coverage=${this.customerQuoteFilds.coverage}&term=${this.customerQuoteFilds.term}`, {
                auth: {
                    username: process.env.NINJA_QUOTER_API_TOKEN || '',
                    password: ''
                }
            });

            return response.data.results;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = NinjaQuoterService;