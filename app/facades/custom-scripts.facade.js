const CustomScriptsService = require('../services/custom-scripts.service');

class CustomScriptsFacade {

    async createCustomScript({ agent_id, type_id, html }) {
        try {
            let custom_scripts = await CustomScriptsService.getAll(agent_id, type_id);
            const amount_scripts = custom_scripts.length + 1;
            const created_script = await CustomScriptsService.create(agent_id, type_id, html, amount_scripts);

            return created_script;
        } catch (error) {
            throw error;
        }
    }

    async getHtmlForCustomScript({ agent_id, type_id }) {
        try {
            let custom_scripts = await CustomScriptsService.getAll(agent_id, type_id);
            let scripts = [];

            custom_scripts.forEach(script => {
                let script_obj = {
                    id: script.id,
                    html: CustomScriptsService.parseScript(script.filename)
                };

                scripts.push(script_obj);
            });

            return scripts;
        } catch (error) {
            throw error;
        }
    }

    async updateCustomScript({ script_id, html }) {
        try {
            const script = await CustomScriptsService.getOne(script_id);
            await CustomScriptsService.update(script, html)
        } catch (error) {
            throw error;
        }
    }

    async deleteCustomScriptById(script_id) {
        try {
            const script = await CustomScriptsService.getOne(script_id);
            await CustomScriptsService.delete(script);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomScriptsFacade;