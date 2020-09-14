const { parseCSVfileToDB } = require('../services/uploadService')
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
const csvToJson = require('convert-csv-to-json');
const formidable = require('formidable');

async function uploadCSV(req, res) {
    const form = new formidable.IncomingForm();

    try {
        const rowLeadsJSON = await new Promise((resolve, reject) => {
            form.parse(req, (err, fields, files) => {
                const delimiter = fields.delimiter;

                const result = csvToJson.fieldDelimiter(delimiter).formatValueByType().getJsonFromCsv(files["file"].path);

                resolve(result);
            });
        });

        if (rowLeadsJSON) {
            const idArray = await parseCSVfileToDB(rowLeadsJSON);

            if (idArray)
                client.emit('row-leads', idArray);
        }

        res.status(200).json({
            status: "success",
            message: "Success parsed CSV file into system"
        });
    } catch (err) {
        res.status(400).json({
            status: "failed",
            message: "Server error!"
        });
        
        throw new Error(err);
    }
}

module.exports = {
    uploadCSV
};