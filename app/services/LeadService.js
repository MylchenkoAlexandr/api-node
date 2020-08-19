function processLead(lead) {
    const leadExist;

    if (!leadExist) {
        create(lead)
    } else {
        update(lead)
    }
}

function create(lead) {
    // modules.Leads.create
}

function update(lead) {

}

module.exports = {
    processLead
}