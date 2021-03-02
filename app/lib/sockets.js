const LeadService = require('../services/lead.service');
const AgentService = require('../services/agent.service');
const UserFacade = require('../facades/user.facade');
const LeadRepository = require('../repository/lead.repository');
const AgentRepository = require('../repository/agent.repository');
const RecordsRepository = require('../repository/records.repository');
const models = require('../../database/models');
const FormatService = require('../services/format.service');
const LeadFacade = require('../facades/lead.facade');
const fetch = require('node-fetch');
const MessageService = require('../twilio/message/message.service');
const SmsRepository = require('../repository/sms.repository');
const CustomersVMService = require('../twilio/voicemails/customers/customersVM.service');
const MailService = require('../services/mail.service');
const TransformationHelper = require('../helpers/transformation.helper');
const FollowUpRepository = require('../repository/followups.repository');

module.exports = server => {
    const io = require("socket.io")(server);
    const users = {};

    io.on('connection', socket => {

        socket.on("connected", async user => {
            users[socket.id] = user;
            console.log('User connected!', users[socket.id].email);

            const role = await AgentRepository.getRole(user.id);

            // if (role == 'admin') {
            //     socket.join(1);
            // }

            if (role == 'admin') {
                socket.join('admin');
            }

            if (role == 'agent') {
                socket.join(user.id);
            }

            if (role == 'guide') {
                socket.join("guide");
            }
        });

        socket.on("join_agent_leads", ({ type, user_id }) => {
            switch (type) {
                case 1:
                    socket.join(user_id + "blueberry_leads");
                    socket.leave(user_id + "media-alpha_leads");
                    socket.leave(user_id + "manual_leads");
                    socket.leave(user_id + "bulk_leads");
                    socket.leave(user_id + "click-listing_leads");
                    socket.leave(user_id + "live-transfer_leads");
                    break;
                case 2:
                    socket.join(user_id + "media-alpha_leads");
                    socket.leave(user_id + "blueberry_leads");
                    socket.leave(user_id + "manual_leads");
                    socket.leave(user_id + "bulk_leads");
                    socket.leave(user_id + "click-listing_leads");
                    socket.leave(user_id + "live-transfer_leads");
                    break;
                case 3:
                    socket.join(user_id + "manual_leads");
                    socket.leave(user_id + "media-alpha_leads");
                    socket.leave(user_id + "blueberry_leads");
                    socket.leave(user_id + "bulk_leads");
                    socket.leave(user_id + "click-listing_leads");
                    socket.leave(user_id + "live-transfer_leads");
                    break;
                case 4:
                    socket.join(user_id + "bulk_leads");
                    socket.leave(user_id + "blueberry_leads");
                    socket.leave(user_id + "media-alpha_leads");
                    socket.leave(user_id + "manual_leads");
                    socket.leave(user_id + "click-listing_leads");
                    socket.leave(user_id + "live-transfer_leads");
                    break;
                case 5:
                    socket.join(user_id + "click-listing_leads");
                    socket.leave(user_id + "blueberry_leads");
                    socket.leave(user_id + "media-alpha_leads");
                    socket.leave(user_id + "manual_leads");
                    socket.leave(user_id + "bulk_leads");
                    socket.leave(user_id + "live-transfer_leads");
                    break;
                case 6:
                    socket.join(user_id + "live-transfer_leads");
                    socket.leave(user_id + "click-listing_leads");
                    socket.leave(user_id + "blueberry_leads");
                    socket.leave(user_id + "media-alpha_leads");
                    socket.leave(user_id + "manual_leads");
                    socket.leave(user_id + "bulk_leads");
                    break;

            }
        });

        socket.on("join_blueberry_leads", () => {
            socket.join("blueberry_leads");
            socket.leave("media-alpha_leads");
            socket.leave("manual_leads");
            socket.leave("bulk_leads");
            socket.leave("click-listing_leads");
            socket.leave("live-transfer_leads");
        });

        socket.on("join_media-alpha_leads", () => {
            socket.join("media-alpha_leads");
            socket.leave("blueberry_leads");
            socket.leave("manual_leads");
            socket.leave("bulk_leads");
            socket.leave("click-listing_leads");
            socket.leave("live-transfer_leads");
        });

        socket.on("join_manual_leads", () => {
            socket.join("manual_leads");
            socket.leave("media-alpha_leads");
            socket.leave("blueberry_leads");
            socket.leave("bulk_leads");
            socket.leave("click-listing_leads");
            socket.leave("live-transfer_leads");
        });

        socket.on("join_bulk_leads", () => {
            socket.join("bulk_leads");
            socket.leave("blueberry_leads");
            socket.leave("media-alpha_leads");
            socket.leave("manual_leads");
            socket.leave("click-listing_leads");
            socket.leave("live-transfer_leads");
        });

        socket.on("join_click-listing_leads", () => {
            socket.join("click-listing_leads");
            socket.leave("blueberry_leads");
            socket.leave("media-alpha_leads");
            socket.leave("manual_leads");
            socket.leave("bulk_leads");
            socket.leave("live-transfer_leads");
        });

        socket.on("join_live-transfer_leads", () => {
            socket.join("live-transfer_leads");
            socket.leave("click-listing_leads");
            socket.leave("blueberry_leads");
            socket.leave("media-alpha_leads");
            socket.leave("manual_leads");
            socket.leave("bulk_leads");
        });

        socket.on("process-lead", async (lead) => {
            try {
                let quoter = "ninjaQuoter";

                if ("type" in lead) {
                    switch (lead.type) {
                        case "life":
                            quoter = "ninjaQuoter";
                            break;
                    }
                }

                let exist;
                let lead_id = lead.id;

                let formatedLead = await FormatService.formatLead(lead);

                if (lead_id) {
                    exist = await models.Leads.findOne({
                        where: {
                            id: lead_id
                        }
                    });
                } else {
                    exist = await LeadService.foundExistLead(formatedLead);
                }

                let uploadedLead;

                if (exist) {
                    const emptyStatus = exist.empty;
                    if (exist.empty == 0 && formatedLead.empty == 1) {
                        console.error("Skipped by checking if exist with filled data already in system!", formatedLead.email);
                    } else {
                        uploadedLead = await LeadFacade.updateLead(exist, formatedLead, quoter);

                        if (uploadedLead) {
                            for (user in users) {
                                if (users[user].id != uploadedLead.user_id) {
                                    io.sockets.to(users[user].id).emit("DELETE_LEAD", uploadedLead.id);
                                } else if (users[user].id == uploadedLead.user_id) {
                                    io.sockets.to(users[user].id).emit("UPDATE_LEAD", uploadedLead);
                                } else {
                                    io.sockets.to(uploadedLead.user_id).emit("CREATE_LEAD", uploadedLead);
                                }
                            }

                            io.sockets.to(uploadedLead.id).emit("UPDATE_LEAD", uploadedLead);
                            io.sockets.to(uploadedLead.user_id).emit("UPDATE_LEADS", uploadedLead);

                            if (uploadedLead.source != 'manual') {
                                if (!uploadedLead.AD_procced) {
                                    io.sockets.to("guide").emit("UPDATE_LEADS", uploadedLead);
                                } else {
                                    io.sockets.to("guide").emit("DELETE_LEAD", uploadedLead.id);
                                }
                            }

                            if (uploadedLead.user_id && uploadedLead.source == 'manual') {
                                io.sockets.to(uploadedLead.user_id + "manual_leads").emit("UPDATE_LEADS", uploadedLead);
                            }

                            if (uploadedLead.source === 'blueberry') {
                                io.sockets.to("blueberry_leads").emit("UPDATE_LEADS", uploadedLead);
                            } else if (uploadedLead.source === 'mediaalpha') {
                                io.sockets.to("media-alpha_leads").emit("UPDATE_LEADS", uploadedLead);
                            }
                            else if (uploadedLead.source === 'manual') {
                                io.sockets.to("manual_leads").emit("UPDATE_LEADS", uploadedLead);
                            }
                            else if (uploadedLead.source === 'bulk') {
                                io.sockets.to("bulk_leads").emit("UPDATE_LEADS", uploadedLead);
                            }
                            else if (uploadedLead.source === 'clickListing') {
                                io.sockets.to("click-listing_leads").emit("UPDATE_LEADS", uploadedLead);
                            }
                            else if (uploadedLead.source === 'liveTransfer') {
                                io.sockets.to("live-transfer_leads").emit("UPDATE_LEADS", uploadedLead);
                            }

                            if (emptyStatus) {
                                io.sockets.to(uploadedLead.user_id).emit("CREATE_LEAD", uploadedLead);

                                if (uploadedLead.source === 'blueberry') {
                                    io.sockets.to("blueberry_leads").emit("CREATE_LEAD", uploadedLead);
                                } else if (uploadedLead.source === 'mediaalpha') {
                                    io.sockets.to("media-alpha_leads").emit("CREATE_LEAD", uploadedLead);
                                }
                                else if (uploadedLead.source === 'manual') {
                                    io.sockets.to("manual_leads").emit("CREATE_LEAD", uploadedLead);
                                }
                                else if (uploadedLead.source === 'bulk') {
                                    io.sockets.to("bulk_leads").emit("CREATE_LEAD", uploadedLead);
                                }
                                else if (uploadedLead.source === 'clickListing') {
                                    io.sockets.to("click-listing_leads").emit("CREATE_LEAD", uploadedLead);
                                }
                                else if (uploadedLead.source === 'liveTransfer') {
                                    io.sockets.to("live-transfer_leads").emit("CREATE_LEAD", uploadedLead);
                                }
                            }
                        }
                    }
                } else {
                    uploadedLead = await LeadFacade.createLead(formatedLead, quoter);

                    if (uploadedLead) {
                        if (uploadedLead.empty == 0) {
                            io.sockets.to(uploadedLead.user_id).emit("CREATE_LEAD", uploadedLead);

                            if (uploadedLead.source != 'manual') {
                                io.sockets.to("guide").emit("CREATE_LEAD", uploadedLead);
                            }

                            if (uploadedLead.user_id && uploadedLead.source == 'manual') {
                                io.sockets.to(uploadedLead.user_id + "manual_leads").emit("CREATE_LEAD", uploadedLead);
                            }

                            if (uploadedLead.source === 'blueberry') {
                                io.sockets.to("blueberry_leads").emit("CREATE_LEAD", uploadedLead);
                            } else if (uploadedLead.source === 'mediaalpha') {
                                io.sockets.to("media-alpha_leads").emit("CREATE_LEAD", uploadedLead);
                            }
                            else if (uploadedLead.source === 'manual') {
                                io.sockets.to("manual_leads").emit("CREATE_LEAD", uploadedLead);
                            }
                            else if (uploadedLead.source === 'bulk') {
                                io.sockets.to("bulk_leads").emit("CREATE_LEAD", uploadedLead);
                            }
                            else if (uploadedLead.source === 'clickListing') {
                                io.sockets.to("click-listing_leads").emit("CREATE_LEAD", uploadedLead);
                            }
                            else if (uploadedLead.source === 'liveTransfer') {
                                io.sockets.to("live-transfer_leads").emit("CREATE_LEAD", uploadedLead);
                            }
                        }

                        if (uploadedLead.empty == 1) {
                            io.sockets.emit("RAW_LEAD_ADD", uploadedLead);
                        }
                    }
                }
            } catch (err) {
                throw err;
            }
        });

        socket.on("assign-agent", async (lead_id, user_id) => {
            try {
                let userId = user_id == 0 ? null : user_id;

                const updatedLead = await LeadService.assignAgent(lead_id, userId);

                io.sockets.to(updatedLead.id).emit("UPDATE_LEAD", updatedLead);
                io.sockets.to(updatedLead.user_id).emit("UPDATE_LEADS", updatedLead);

                for (user in users) {
                    if (users[user].id != updatedLead.user_id) {
                        io.sockets.to(users[user].id).emit("DELETE_LEAD", updatedLead.id);
                    } else {
                        if (updatedLead.source === 'blueberry') {
                            io.sockets.to(updatedLead.user_id + "blueberry_leads").emit("CREATE_LEAD", updatedLead);
                        } else if (updatedLead.source === 'mediaalpha') {
                            io.sockets.to(updatedLead.user_id + "media-alpha_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'manual') {
                            io.sockets.to(updatedLead.user_id + "manual_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'bulk') {
                            io.sockets.to(updatedLead.user_id + "bulk_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'clickListing') {
                            io.sockets.to(updatedLead.user_id + "click-listing_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'liveTransfer') {
                            io.sockets.to(updatedLead.user_id + "live-transfer_leads").emit("CREATE_LEAD", updatedLead);
                        }
                    }
                }

                if (updatedLead.source === 'blueberry') {
                    io.sockets.to([updatedLead.user_id + "blueberry_leads", "blueberry_leads"]).emit("UPDATE_LEADS", updatedLead);
                } else if (updatedLead.source === 'mediaalpha') {
                    io.sockets.to([updatedLead.user_id + "media-alpha_leads", "media-alpha_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'manual') {
                    io.sockets.to([updatedLead.user_id + "manual_leads", "manual_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'bulk') {
                    io.sockets.to([updatedLead.user_id + "bulk_leads", "bulk_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'clickListing') {
                    io.sockets.to([updatedLead.user_id + "click-listing_leads", "click-listing_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'liveTransfer') {
                    io.sockets.to([updatedLead.user_id + "live-transfer_leads", "live-transfer_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
            } catch (err) {
                throw err;
            }
        });

        socket.on("update-price", async (lead_id, price) => {
            try {
                const result = await LeadService.updatePrice(lead_id, JSON.stringify(price));
            } catch (err) {
                throw err;
            }
        });

        socket.on("update-status", async (lead_id, status) => {
            try {
                const updatedLead = await LeadService.updateStatus(lead_id, status);

                io.sockets.to(updatedLead.id).emit("UPDATE_LEAD", updatedLead);
                io.sockets.to(updatedLead.user_id).emit("UPDATE_LEADS", updatedLead);

                for (user in users) {
                    if (users[user].id != updatedLead.user_id) {
                        io.sockets.to(users[user].id).emit("DELETE_LEAD", updatedLead.id);
                    } else if (users[user].id == updatedLead.user_id) {
                        io.sockets.to(users[user].id).emit("UPDATE_LEAD", updatedLead);
                    } else {
                        if (updatedLead.source === 'blueberry') {
                            io.sockets.to(updatedLead.user_id + "blueberry_leads").emit("CREATE_LEAD", updatedLead);
                        } else if (updatedLead.source === 'mediaalpha') {
                            io.sockets.to(updatedLead.user_id + "media-alpha_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'manual') {
                            io.sockets.to(updatedLead.user_id + "manual_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'bulk') {
                            io.sockets.to(updatedLead.user_id + "bulk_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'clickListing') {
                            io.sockets.to(updatedLead.user_id + "click-listing_leads").emit("CREATE_LEAD", updatedLead);
                        }
                        else if (updatedLead.source === 'liveTransfer') {
                            io.sockets.to(updatedLead.user_id + "live-transfer_leads").emit("CREATE_LEAD", updatedLead);
                        }
                    }
                }

                if (updatedLead.source === 'blueberry') {
                    io.sockets.to([updatedLead.user_id + "blueberry_leads", "blueberry_leads"]).emit("UPDATE_LEADS", updatedLead);
                } else if (updatedLead.source === 'mediaalpha') {
                    io.sockets.to([updatedLead.user_id + "media-alpha_leads", "media-alpha_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'manual') {
                    io.sockets.to([updatedLead.user_id + "manual_leads", "manual_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'bulk') {
                    io.sockets.to([updatedLead.user_id + "bulk_leads", "bulk_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (updatedLead.source === 'clickListing') {
                    io.sockets.to([updatedLead.user_id + "click-listing_leads", "click-listing_leads"]).emit("UPDATE_LEADS", updatedLead);
                }
                else if (uploadedLead.source === 'liveTransfer') {
                    io.sockets.to([updatedLead.user_id + "live-transfer_leads", "live-transfer_leads"]).emit("UPDATE_LEADS", uploadedLead);
                }
            } catch (err) {
                throw err;
            }
        });

        socket.on("restart-AD", (user_id) => {
            io.sockets.emit("RESTART_AD", user_id);
        });

        socket.on("set_online_status", async ({ id, status }) => {
            try {
                await models.Users.update({
                    online: status
                }, {
                    where: {
                        id: id
                    }
                });

            } catch (error) {
                throw error;
            }
        });

        socket.on("switch-AD_status", async (lead_id, status) => {
            try {
                await LeadRepository.updateADstatusFields(lead_id, "AD_status", status);
                const updatedLead = await LeadRepository.getOne(lead_id);
                io.sockets.emit("UPDATE_LEADS", updatedLead);
            } catch (error) {
                throw error;
            }
        });

        socket.on("busy-lead", lead_id => {
            socket.join(lead_id, async () => {
                try {
                    const candidate = await models.Leads.findOne({
                        where: { id: lead_id }
                    });

                    if (candidate && users[socket.id]) {
                        // await candidate.update({
                        // busy: 1,
                        // busy_agent_id: users[socket.id].id
                        // });

                        const lead = await LeadRepository.getOne(candidate.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }
                } catch (error) {
                    throw error;
                }
            });
        });

        socket.on("unbusy-lead", lead_id => {
            socket.leave(lead_id, async () => {
                try {
                    const candidate = await models.Leads.findOne({
                        where: { id: lead_id }
                    });

                    if (candidate) {
                        await candidate.update({
                            busy: 0,
                            busy_agent_id: null
                        });
                        const lead = await LeadRepository.getOne(candidate.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }

                } catch (error) {
                    throw error;
                }
            })
        });

        socket.on("record-create", async ({ user_id, lead_id, url }) => {
            try {
                fetch(url + ".json", { method: "Get" })
                    .then(res => res.json())
                    .then(async (json) => {
                        const new_record = await models.Records.create({
                            user_id: user_id,
                            lead_id: lead_id,
                            url: url,
                            duration: json.duration
                        });

                        if (new_record) {
                            const record = await RecordsRepository.getOne(new_record.id);
                            io.sockets.to(lead_id).emit("RECORD_ADD", record);

                            if (+new_record.duration >= 121) {
                                io.sockets.emit("CREATE_RECORD_IN_TABLE", record);
                            }
                        }
                    });
            } catch (error) {
                throw error;
            }
        });

        socket.on("agent-online", async ({ user_id, online }) => {
            try {
                await UserFacade.statusHandler(user_id, "active", online);
                const onlineAgents = await AgentService.getOnlineAgents();

                for (user in users) {
                    if (users[user].role_id === 3) {
                        io.sockets.emit("GET_ONLINE_AGENTS", onlineAgents);
                    }
                }
            } catch (error) {
                throw error;
            }
        });

        socket.on("switch-inbound-status", async ({ id, status }) => {
            try {
                await models.Users.update({
                    INBOUND_status: status
                }, {
                    where: {
                        id: id
                    }
                });

                io.sockets.to(id).emit("SWITCH_INBOUND_STATUS", status);
            } catch (error) {
                throw error;
            }
        });

        socket.on('disconnect', async () => {
            if (users[socket.id]) {
                socket.leaveAll();
                try {
                    console.log('User disconnected!', users[socket.id].email);

                    const candidate = await models.Leads.findOne({
                        where: { busy_agent_id: users[socket.id].id }
                    });

                    if (candidate) {
                        await candidate.update({
                            busy: 0,
                            busy_agent_id: null
                        });
                        const lead = await LeadRepository.getOne(candidate.id);

                        io.sockets.emit("UPDATE_LEADS", lead);
                    }

                } catch (error) {
                    throw error;
                }
                delete users[socket.id];
            }
        });

        /**
         * ------------- MESSAGES -------------
         */

        // add new one to the text tab 
        socket.on("add-message", async (message_id) => {
            try {
                const message = await SmsRepository.getOneByIdWebsocket(message_id);
                io.sockets.to(message.lead_id).emit("ADD_MESSAGE", message);
            } catch (error) {
                throw error;
            }
        });

        // update status of the exist message in text tab
        socket.on("update-send-status", async (message_id) => {
            try {
                let message = await SmsRepository.getOneByIdWebsocket(message_id);
                io.sockets.to(message.lead_id).emit("UPDATE_SEND_STATUS", message);
            } catch (error) {
                throw error;
            }
        });

        // notification about new message for agent
        socket.on("receive-message", async (message_id, user_id) => {
            try {
                let message = await SmsRepository.getOneById(message_id);
                const notification = {
                    id: message.id,
                    lead_id: message.lead_id,
                    user_id: message.user_id,
                    lead_name: message.lead_name,
                    type: 'message',
                    body: message.text,
                    create_date: message.createdAt,
                    time_passed: TransformationHelper.timePassed(message.createdAt),
                }
                io.sockets.to(user_id).emit("RECEIVE_MESSAGE", notification);
                io.sockets.to("admin").emit("RECEIVE_MESSAGE", notification);
            } catch (error) {
                throw error;
            }
        });

        /**
         * Realtime lead_id sending
         */
        socket.on("send-lead-id", (lead_id, user_id) => {
            try {
                io.sockets.to(user_id).emit("ADD_LEAD_ID", lead_id);
            } catch (error) {
                throw error;
            }
        });

        socket.on("create_customer_voice_mail", async (lead_id, url) => {
            try {
                const voicemail = await CustomersVMService.create(lead_id, url);

                const notification = {
                    id: voicemail.id,
                    lead_id: voicemail.lead_id,
                    user_id: voicemail.user_id,
                    lead_name: voicemail.lead_name,
                    type: 'voicemail',
                    body: voicemail.url,
                    create_date: voicemail.createdAt,
                    time_passed: TransformationHelper.timePassed(voicemail.createdAt),
                }

                const mail_options = {
                    from: `Blueberry Insurance <${process.env.MAIL_SERVICE_USER_EMAIL}>`,
                    to: voicemail.agent_email,
                    subject: `New voicemail notification from ${voicemail.lead_name}`,
                    text: `Hey, ${voicemail.agent_name}. You have new voicemail from ${voicemail.lead_name} | ${voicemail.lead_phone}.\nLink to voicemail: ${voicemail.url}.`
                };

                await MailService.sendNewsletter(mail_options);

                io.sockets.to(voicemail.user_id).emit("CREATE_CUSTOMER_VOICE_MAIL", notification);
                io.sockets.to('admin').emit("CREATE_CUSTOMER_VOICE_MAIL", notification);

                let to = TransformationHelper.formatPhoneForCall(voicemail.user_phone);
                let from = TransformationHelper.formatPhoneForCall(voicemail.lead_phone);
                let sms = "Hey, you have a new voicemail from " + voicemail.lead_name + " | " + from + ":\n\n" + voicemail.url;
                await MessageService.sendMessage(from, to, sms);
            } catch (error) {
                throw error;
            };
        });

        socket.on("send_lead", async (lead_id) => {
            try {
                const lead = await LeadRepository.getOne(lead_id);

                if (lead.source === 'blueberry') {
                    io.sockets.to("blueberry_leads").emit("CREATE_LEAD", lead);
                } else if (lead.source === 'mediaalpha') {
                    io.sockets.to("media-alpha_leads").emit("CREATE_LEAD", lead);
                }
                else if (lead.source === 'manual') {
                    io.sockets.to("manual_leads").emit("CREATE_LEAD", lead);
                }
                else if (lead.source === 'bulk') {
                    io.sockets.to("bulk_leads").emit("CREATE_LEAD", lead);
                }
                else if (lead.source === 'clickListing') {
                    io.sockets.to("click-listing_leads").emit("CREATE_LEAD", lead);
                }
                else if (lead.source === 'liveTransfer') {
                    io.sockets.to("live-transfer_leads").emit("CREATE_LEAD", lead);
                }
            } catch (error) {
                throw error;
            }
        });

        socket.on("send-conf-params", (confParams) => {
            try {
                io.sockets.emit("SET_CONF_PARAMS", confParams);
            } catch (error) {
                throw error;
            }
        });

        socket.on("update-notification", async (id, type) => {
            try {
                io.sockets.to("admin").emit("NOTIFICATION_UPDATES", { id: id, type: type });
            } catch (error) {
                throw error;
            }
        });

        socket.on("send-second-part-params", (params) => {
            try {
                io.sockets.emit("SET_SECOND_PARTICIPIANT_PARAMS", params);
            } catch (error) {
                throw error;
            }
        });

        socket.on("create_followup", async (followup) => {
            try {
                const createdFollowup = await models.Followups.create(followup);

                io.sockets.emit("FOLLOWUP_CREATE", createdFollowup);
            } catch (error) {
                throw error;
            }
        });

        socket.on("update_followup", async (followup) => {
            try {
                const user_followup = await FollowUpRepository.getOneByID(followup.id);
            io.sockets.emit("FOLLOWUP_UPDATE", { followup, user_followup });
            } catch (error) {
                throw error;
            }
        });

        socket.on("delete_followup", async (id) => {
            try {
                io.sockets.emit("FOLLOWUP_DELETE", id);
            } catch (error) {
                throw error;
            }
        });

        socket.on("remove_lock_from_agent", async (user_id, value) => {
            try {
                if (value == null) {
                    await AgentService.completedLead(user_id);
                }
                io.sockets.to(user_id).emit("SET_UNCOMPLETED_LEAD", value);
            } catch (error) {
                throw error;
            }
        });
        socket.on("delete_lead", (lead_id) => {
            try {
                io.sockets.emit("DELETE_LEAD", lead_id);
            } catch (error) {
                throw error;
            }
        });

        socket.on("send_follow_up_notification", async (user_id, text) => {
            try {
                // Send notification
                io.sockets.to(user_id).emit("FOLLOWUP_NOTIFICATION", text);
            } catch (error) {
                throw error;
            }
        });
    });

    return io;
};