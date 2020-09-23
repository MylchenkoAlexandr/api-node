class AsigmentService {
    /**
     * Get agent with smaller count of lead per specified state
     * @param {string} state 
     */
    getSuitableAgent(state) {
        // SELECT leads.user_id, COUNT(leads.id) as `count` FROM leads WHERE state_id = (SELECT states.id FROM states WHERE states.name = "CA") GROUP BY leads.user_id ORDER BY `count` ASC LIMIT 1
    }
}

module.exports = new AsigmentService;