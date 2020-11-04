const db = require('../../database/models');

const StatesRepository = {
    async getOne(stateName) {
        try {
            const data = await db.sequelize.query(`SELECT states.id FROM states WHERE states.name = '${stateName}'`, {
                type: db.sequelize.QueryTypes.SELECT,
                plain: true
            });

            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = StatesRepository;