const db = require('../../database/models');

const StatesRepository = {
    async getOne(stateName) {
        const data = await db.sequelize.query(`SELECT states.id FROM states WHERE states.name = '${stateName}'`, {
            type: db.sequelize.QueryTypes.SELECT,
        }).catch(e => {
            throw e;
        });

        return data[0];
    }
}

module.exports = StatesRepository;