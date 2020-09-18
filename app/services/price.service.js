const models = require('../../database/models');

class PriceService {
    /**
     * Process price from lead actions
     * @param {int} lead_id 
     * @param {object} price 
     * @param {string} quoter 
     */
    async processPrice(lead_id, price, quoterName) {
        try {
            const quoter = await models.Quoters.findOne({
                attributes: ['id'],
                where: { name: quoterName }
            });

            const exist = await models.Prices.findOne({
                where: {
                    quoter_id: quoter.id,
                    lead_id: lead_id,
                }
            });

            const stringifiedPrice = JSON.stringify(price);

            if (exist) {
                await this.updatePrice(exist, stringifiedPrice);
            } else {
                await this.createPrice(quoter.id, lead_id, stringifiedPrice);
            }
        } catch (err) {
            throw err;
        }
    }

    /**
     * Create price if can`t found in DB
     * @param {int} quoter_id 
     * @param {int} lead_id 
     * @param {string} price 
     */
    async createPrice(quoter_id, lead_id, price) {
        try {
            await models.Prices.create({
                quoter_id: quoter_id,
                lead_id: lead_id,
                price: price
            });
        } catch (err) {
            throw err;
        }
    }

    /**
     * Update price in exist record
     * @param {object} exist 
     * @param {string} price 
     */
    async updatePrice(exist, price) {
        try {
            await exist.update({
                price: price
            });
        } catch (err) {
            throw err;
        }
    }
}

module.exports = new PriceService;