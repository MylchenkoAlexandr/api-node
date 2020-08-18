const axios = require('axios');

const companies = [];

function setCompanies(userCompanies) {
    this.companies.push(userCompanies);
    console.log(this.companies);
}

function fetchCompanyListFromNinjaQuoter(params) {
    console.log(params)
    return new Promise((resolve, reject) => {
        const token = process.env.NINJA_QUOTER_API_TOKEN;

        axios.get('https://wq.ninjaquoter.com/api/quoter/quotes/?state=CO&birthdate=2001-05-23&gender=m&rate_class=lb&smoker=true&coverage=4000&term=fex', {
            auth: {
                username: token,
                password: ''
            }
        }).then(responce => {
            return resolve(responce.data.results);
        }).catch(e => {
            console.error(e);
            return reject();
        });
    });
}

module.exports = {
    setCompanies,
    fetchCompanyListFromNinjaQuoter
}
