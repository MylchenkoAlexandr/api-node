const formidable = require('formidable');
const fs = require('fs');
const models = require('../../../database/models');
const VoiceMailsRepository = require('../../repository/voicemails.repository');

class VoiceMailsController {
    async get(req, res) {
        try {
            if ("user_id" in req.params) {
                const voiceMails = await VoiceMailsRepository.getVoiceMails(req.params.user_id);
                if (voiceMails) {
                    return res.status(200).send({ status: "success", message: "Success", voicemails: voiceMails });
                }
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async create(req, res) {
        try {
            const form = new formidable.IncomingForm();
            if (form) {
                const voiceMail = await new Promise((resolve, reject) => {
                    form.parse(req, (err, fields, files) => {
                        if (err) throw err;

                        if (files.audio && fields.user_id) {
                            fs.readFile(files.audio.path, function (err, data) {
                                if (err) throw err;
                                let path = 'voice_mails/' + (+new Date()) + '_' + fields.user_id + '.mp3';

                                fs.writeFile('public/' + path, data, async function (err) {
                                    if (err) throw err;

                                    await models.AgentsVoiceMails.create({
                                        user_id: fields.user_id,
                                        voice_mail: path
                                    }).then((res) => {
                                        resolve({ id: res.id, url: res.voice_mail });
                                    }).catch((err) => {
                                        throw err;
                                    });
                                });
                            });
                        }
                    });
                });
                if (voiceMail) {
                    return res.status(200).send({ status: "success", message: "Record uploaded success!", vm: voiceMail });
                }
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }

    async delete(req, res) {
        try {
            console.log(req.body);
            if ("recordId" in req.body) {
                await models.AgentsVoiceMails.destroy({
                    where: {
                        id: req.body.recordId
                    }
                });
                return res.status(200).send({ status: "success", message: "Success deleted!" });
            }
            return res.status(400).send({ status: "error", message: "Bad request!" });
        } catch (error) {
            res.status(500).send({ status: "error", message: "Server error!" });
            throw error;
        }
    }
}

module.exports = new VoiceMailsController;