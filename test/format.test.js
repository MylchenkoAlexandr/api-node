const db = require('../database/models');
const FormatService = require("../app/services/format.service");
const priceService = require('../app/services/price.service');
const oldEnv = process.env;

beforeAll(async () => {
    jest.resetModules();
    await db.sequelize.authenticate();
    // process.env = { ...oldEnv };
    process.env.NODE_ENV = "test";
});

afterAll(() => {
    process.env = oldEnv;
});

test("FormatService@formatLead", async () => {
    const notFormatedLead = {
        id: 4498,
        AD_procced: 0,
        AD_status: 0,
        state_id: 5,
        phone: '(111)111-1111',
        empty: 0,
        fullname: 'test test',
        email: 'test@test.com',
        status: 'contactAttempt4',
        state: 'CA',
        state_title: 'California',
        updated: '06/13/2021 5:37:25 AM',
        source: 'blueberry',
        source_title: 'Blueberry',
        type: 'life',
        insurance: '1',
        gender: 'm',
        tobacco: 'false',
        zipcode: '90001',
        birth_date: '1970-01-05',
        height: 68,
        weight: '150',
        coverage_amount: 250000,
        married: '0',
        children: 0,
        total_income: '$100000',
        term: '10',
        jobstatus: '1',
        medications: ['26'],
        rate_class: 's',
        age: 53,
        bmi: '22.8',
        city: 'Los Angeles',
        mortgage: 0,
        policy: 0,
        updatedAt: '06/13/2021 3:37:25 PM',
        createdAt: '06/13/2021 3:37:25 PM',
        address: 'test test',
        premium_price: '$59.55',
        premium_carrier: 'Protective'
    };

    const formatedLead = {
        source_id: 1,
        type_id: 2,
        state_id: 5,
        email: 'test@test.com',
        phone: '(111)111-1111',
        status_id: 5,
        fullname: 'test test',
        empty: 0,
        property: {
            state: 'CA',
            insurance: '1',
            gender: 'm',
            tobacco: 'false',
            zipcode: '90001',
            birth_date: '1970-01-05',
            height: 68,
            weight: '150',
            coverage_amount: 250000,
            married: '0',
            children: 0,
            total_income: '$100000',
            term: '10',
            jobstatus: '1',
            medications: ['26'],
            rate_class: 's',
            age: 53,
            bmi: '22.8',
            city: 'Los Angeles',
            mortgage: 0,
            policy: 0,
            updatedAt: '06/13/2021 3:37:25 PM',
            createdAt: '06/13/2021 3:37:25 PM',
            address: 'test test'
        }
    };

    expect(await FormatService.formatLead(notFormatedLead)).toEqual(formatedLead);
});