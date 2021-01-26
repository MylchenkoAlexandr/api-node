const fs = require('fs');
const path = require('path');

class FileHelper {
    constructor() {
        this._path_url = path.normalize(process.env.CUSTOM_SCRIPTS_PATH);
    }

    uploadFile(user_id, folder, file) {
        try {
            const filename = `${1}_${user_id}${path.extname(file.name)}`;
            const pathToFile = path.join(this._path_url + "/public/" + folder, filename);
            const data = new Uint8Array(Buffer.from(file.name));

            // fs.writeFileSync(pathToFile, data);
            fs.createWriteStream(filename, data, function (err) {
                if (err) throw err;
                console.log('Saved!');
            });

            console.log("🚀 ~ file: file.helper.js ~ line 20 ~ FileHelper ~ createFile ~ pathToFile", pathToFile)
            return pathToFile;
        } catch (error) {
            throw error;
        }
    }

    async deleteFile(path) {
        try {

        } catch (error) {
            throw error;
        }
    }
}

module.exports = new FileHelper;