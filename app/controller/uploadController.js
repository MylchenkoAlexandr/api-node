const csvToJson = require('convert-csv-to-json');

function uploadCSV(req, res) {
    
    // if (!req.files) {
    //     return res.status(500).send({ msg: "file is not found" })
    // }

    const files = req.body.file;

    files.mv(`${__dirname}/public/`)

    console.log();
    // let json = csvToJson.getJsonFromCsv("");
    // for (let i = 0; i < json.length; i++) {
    //     console.log(json[i]);
    // }

    // contents = fs.readFileSync('DATA', 'utf8');
}

module.exports = {
    uploadCSV
};