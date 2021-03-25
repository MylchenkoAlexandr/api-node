const csvToJson = require('convert-csv-to-json');
const formidable = require('formidable');
const FormatService = require('../services/format.service');
const client = require('socket.io-client')(process.env.WEBSOCKET_URL);
// const FileHelper = require('../helpers/file.helper');
const models = require('../../database/models');
const SettingsService = require('../services/settings.service');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');

class UploadController {
    async uploadCSV(req, res) {
        try {
            const form = new formidable.IncomingForm();
            let lt;
            const rawLeads = await new Promise((resolve, reject) => {
                form.parse(req, (err, fields, files) => {
                    if (err) return reject(err);

                    const delimiter = fields.delimiter;
                    lt = fields.lt;
                    const result = csvToJson.fieldDelimiter(delimiter).formatValueByType().getJsonFromCsv(files["file"].path);
                    resolve(result);
                });
            });

            if (rawLeads) {
                Object.keys(rawLeads).forEach(index => {
                    let preparedRawLead = FormatService.formatRawLead(rawLeads[index], "bulk", lt);
                    client.emit("process-lead", preparedRawLead);
                });

                res.status(200).json({ status: "success", message: "Success parsed CSV file into system" });
            }
        } catch (err) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw err;
        }
    }

    async uploadVoiceMailAudio(req, res) {
        try {
            const form = new formidable.IncomingForm();

            if (form) {
                const uploadedFile = await new Promise((resolve, reject) => {
                    form.parse(req, (err, fields, files) => {
                        if (err) return reject(err);

                        if (files.audio && fields.user_id) {
                            const oldPath = files.audio.path;
                            fs.readFile(oldPath, (err, data) => {
                                if (err) throw err;
                                let path = 'public/voice_mails/' + files.audio.name;
                                fs.writeFile(path, data, (err) => {
                                    if (err) throw err;
                                    fs.unlink(oldPath, function (err) {
                                        if (err) throw err;
                                    });
                                    resolve({ path: path, user_id: fields.user_id });
                                });
                            });
                        }
                    });
                });
                let newFilePath;

                if (uploadedFile.path) {
                    newFilePath = 'voice_mails/' + (+new Date()) + Math.floor(Math.random() * Math.floor(999999)) + ".mp3";

                    const status = await new Promise((resolve, reject) => {
                        ffmpeg(uploadedFile.path)
                            .toFormat('mp3')
                            .on('error', (err) => {
                                console.log('An error occurred: ' + err.message);
                                reject(false);
                            })
                            .on('end', () => {
                                resolve(true);
                            })
                            .save('public/' + newFilePath);
                    });

                    if (status) {
                        fs.unlinkSync(uploadedFile.path, function (err) {
                            if (err) throw err;
                        });

                        fs.copyFile('public/' + newFilePath, process.env.VM_CUSTOM_PATH + newFilePath, (err) => {
                            if (err) throw err;
                        });

                        const user = await models.Users.findOne({
                            where: { id: uploadedFile.user_id }
                        });

                        let existVoiceMail;

                        if (user.role_id == 2) {
                            if (user.voice_mail) existVoiceMail = user.voice_mail;

                            await user.update({
                                voice_mail: newFilePath
                            }).then(() => {
                                if (existVoiceMail) {
                                    fs.unlink('public/' + existVoiceMail, (err) => {
                                        if (err) throw err;
                                    });
                                    fs.unlink(process.env.VM_CUSTOM_PATH + existVoiceMail, (err) => {
                                        if (err) throw err;
                                    });
                                };
                            });
                        } else if (user.role_id == 1) {
                            const settings = await SettingsService.get();

                            if (settings.default_voice_mail) existVoiceMail = settings.default_voice_mail;

                            await settings.update({
                                default_voice_mail: newFilePath
                            }).then(() => {
                                if (existVoiceMail) {
                                    fs.unlink('public/' + existVoiceMail, (err) => {
                                        if (err) throw err;
                                    });
                                    fs.unlink(process.env.VM_CUSTOM_PATH + existVoiceMail, (err) => {
                                        if (err) throw err;
                                    });
                                };
                            });
                        }

                    }
                }

                if (newFilePath) {
                    return res.status(200).json({ status: 'success', message: "Record upload success!", url: newFilePath });
                }
            }
            return res.status(400).json({ status: 'error', message: "Bad request!" });
        } catch (error) {
            res.status(500).json({ status: "error", message: "Server Error" });
            throw error;
        }
    }
}

module.exports = new UploadController;