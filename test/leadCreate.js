const expect = require('chai').expect;
const db = require('../database/models');
const { processLead } = require('../app/services/LeadService');

describe("Lead Create", () => {
    it("1 should equal to 1", async () => {

        const lead = {
            "source": "blueberry",
            "type": "life",
            "birth_date": "2001-05-23",
            "children": 1,
            "coverage_amount": 6000,
            "disability": "1",
            "email": "test@test.com",
            "fname": "Test",
            "gender": "m",
            "height": 57,
            "howchildren": null,
            "insurance": 1,
            "jobstatus": "3",
            "lname": "Test", "married": 1,
            "medications": ["4"],
            "mortgage": 1,
            "mortgage_remaining": null,
            "phone": "(503)336-9814",
            "policy": 1,
            "rateClass": "lb",
            "state": "CO",
            "term": "fex",
            "tobacco": 1,
            "total_income": null,
            "weight": "123",
            "zipcode": "12321"
        };

        await processLead(lead);

        const properties = await db.Leads.findAll();

        expect(properties.length).to.equal(1);
    })
});