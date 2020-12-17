const csvToJson = require('convert-csv-to-json');
const formidable = require('formidable');
const FormatService = require('../services/format.service');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);

async function uploadCSV(req, res) {
    const form = new formidable.IncomingForm();

    try {
        const rawLeads = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                if (err) return reject(err);

                const delimiter = fields.delimiter;
                const result = csvToJson.fieldDelimiter(delimiter).formatValueByType().getJsonFromCsv(files["file"].path);
                resolve(result);
            });
        });

        if (rawLeads) {
            Object.keys(rawLeads).forEach(index => {
                let preparedRawLead = FormatService.formatRawLead(rawLeads[index], "bulk", "life");
                client.emit("process-lead", preparedRawLead);
            });

            res.status(200).json({ status: "success", message: "Success parsed CSV file into system" });
        }
    } catch (err) {
        res.status(500).json({ status: "error", message: "Server Error" });
        throw err;
    }
}

module.exports = {
    uploadCSV
};