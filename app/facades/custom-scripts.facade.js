const CustomScriptsService = require('../services/custom-scripts.service');

class CustomScriptsFacade {

    async createCustomScript({ agent_id, type_id, html }) {
        try {
            let custom_scripts = await CustomScriptsService.getAll(agent_id, type_id);

            const amount_scripts = custom_scripts.length + 1;
            if (amount_scripts > 3) return { code: 400, status: 'error', message: 'Maximum number of scripts' };

            const script = await CustomScriptsService.create(agent_id, type_id, html, amount_scripts);
            return { code: 201, status: 'success', message: 'Script created', script };
        } catch (error) {
            throw error;
        }
    }

    async getCustomScripts({ agent_id, type_id }) {
        try {
            let custom_scripts = await CustomScriptsService.getAll(agent_id, type_id);
            let scripts = [];

            custom_scripts.forEach(script => {
                let parsedScript = CustomScriptsService.parseScript(script.filename)
                if (parsedScript) {
                    let script_obj = {
                        id: script.id,
                        html: parsedScript
                    };

                    scripts.push(script_obj);
                }
            });

            return { code: 200, status: 'success', scripts };
        } catch (error) {
            throw error;
        }
    }

    async updateCustomScript({ script_id, html }) {
        try {
            const script = await CustomScriptsService.getOne(script_id);
            await CustomScriptsService.update(script, html)

            return { code: 200, status: 'success', message: 'Custom script updated' };
        } catch (error) {
            throw error;
        }
    }

    async deleteCustomScriptById(script_id) {
        try {
            const script = await CustomScriptsService.getOne(script_id);
            await CustomScriptsService.delete(script);

            return { code: 200, status: 'success', message: 'Custom script deleted' };
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new CustomScriptsFacade;