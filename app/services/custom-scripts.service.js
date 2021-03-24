const fs = require('fs');
const path = require('path');
const models = require('../../database/models');

class CustomScriptsService {
    constructor() {
        this._path_url = path.normalize(process.env.CUSTOM_SCRIPTS_PATH);
    }

    async getOne(script_id) {
        try {
            const script = await models.CustomScripts.findOne({ where: { id: script_id } });
            return script;
        } catch (error) {
            throw error;
        }
    }

    async getAll(agent_id, type_id) {
        try {
            const custom_scripts = await models.CustomScripts.findAll({ where: { user_id: agent_id, type_id } });
            return custom_scripts;
        } catch (error) {
            throw error;
        }
    }

    async create(agent_id, type_id, html) {
        try {
            let filename = `${Date.now()}-${agent_id}-${type_id}.html`;
            let script_path = path.join(this._path_url, filename);

            const { dataValues: custom_script } = await models.CustomScripts.create({
                user_id: agent_id,
                type_id,
                path: this._path_url,
                filename
            });

            fs.writeFileSync(script_path, html);

            delete custom_script.filename;
            custom_script.html = html;

            return custom_script;
        } catch (error) {
            throw error;
        }
    }

    async delete(script) {
        try {
            await script.destroy();
            let script_path = path.join(this._path_url, script.filename);
            fs.unlinkSync(script_path);
        } catch (error) {
            throw error;
        }
    }

    async update(script, html) {
        try {
            let script_path = path.join(this._path_url, script.filename);
            await script.update({
                updatedAt: new Date(),
            });
            fs.writeFileSync(script_path, html);
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