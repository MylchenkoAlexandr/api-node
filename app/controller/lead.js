const { getCompanyListNinjaQuoter } = require('../services/ninjaQuote')

async function create(req, res) {
    try {
        const companyList = await getCompanyListNinjaQuoter();

        if(companyList){


            res.json(companyList);
        }
    } catch (error) {
        res.json({ status: false, message: 'Server error!' })
    }
}

module.exports = {
    create
}   