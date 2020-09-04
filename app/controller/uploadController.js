const csvToJson = require('convert-csv-to-json');
const fs = require('fs');
const formidable = require('formidable')

function uploadCSV(req, res) {
    const form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        const delimiter = fields.delimiter;

        let data = csvToJson.fieldDelimiter(delimiter).formatValueByType().getJsonFromCsv(files["file"].path);

        console.log("uploadCSV -> data", data)
        
        // console.log("uploadCSV -> data", data)
        // console.log("uploadCSV -> delimiter", delimiter)
    });
}

module.exports = {
    uploadCSV
};