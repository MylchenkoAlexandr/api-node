const fs = require('fs');
const path = require('path');
const models = require('../../database/models');

class CustomScriptsService {
    constructor() {
        this._path_url = path.normalize(path.join(__dirname, '..', '..', 'scripts'));
    }

    async getAll(agent_id, type_id) {
        try {
            const custom_scripts = await models.CustomScripts.findAll({ where: { user_id: agent_id, type_id } });
            return custom_scripts;
        } catch (error) {
            throw error;
        }
    }

    async create(agent_id, type_id, html, amount_scripts) {
        try {
            if (amount_scripts > 3) return false;
            let filename = `${Date.now()}-${agent_id}-${type_id}.html`;
            let script_path = path.join(this._path_url, filename);
            
            await models.CustomScripts.create({
                user_id: agent_id,
                type_id,
                filename
            });
            
            fs.writeFileSync(script_path, html);

            return true;
        } catch (error) {
            throw error;
        }
    }

    async delete(script_id) {
        try {
            await models.CustomScripts.destroy({ where: { id: script_id } });
        } catch (error) {
            throw error;
        }
    }

    parseScript(filename) {
        try {
            let script_path = path.join(this._path_url, filename);
            const data = fs.readFileSync(script_path, "utf8");

            return data;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomScriptsService;