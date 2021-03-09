'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('status', {
      order: 1
    }, {
      name: 'newLead'
    });
    await queryInterface.bulkUpdate('status', {
      order: 2
    }, {
      name: 'contactAttempt1'
    });
    await queryInterface.bulkUpdate('status', {
      order: 3
    }, {
      name: 'contactAttempt2'
    });
    await queryInterface.bulkUpdate('status', {
      order: 4
    }, {
      name: 'contactAttempt3'
    });
    await queryInterface.bulkUpdate('status', {
      order: 5
    }, {
      name: 'contactAttempt4'
    });
    await queryInterface.bulkUpdate('status', {
      order: 6
    }, {
      name: 'wrongPhoneNumber'
    });
    await queryInterface.bulkUpdate('status', {
      order: 7
    }, {
      name: 'doNotCall'
    });
    await queryInterface.bulkUpdate('status', {
      order: 8
    }, {
      name: 'notInterested'
    });
    await queryInterface.bulkUpdate('status', {
      order: 9
    }, {
      name: 'followUp'
    });
    await queryInterface.bulkUpdate('status', {
      order: 10
    }, {
      name: 'priceTooHigh'
    });
    await queryInterface.bulkUpdate('status', {
      order: 11
    }, {
      name: 'emailed'
    });
    await queryInterface.bulkUpdate('status', {
      order: 12
    }, {
      name: 'thinkingAboutIt'
    });
    await queryInterface.bulkUpdate('status', {
      order: 13
    }, {
      name: 'agreement'
    });
    await queryInterface.bulkUpdate('status', {
      order: 14
    }, {
      name: 'inApplication'
    });
    await queryInterface.bulkUpdate('status', {
      order: 15
    }, {
      name: 'underwriting'
    });
    await queryInterface.bulkUpdate('status', {
      order: 16
    }, {
      name: 'approved'
    });
    await queryInterface.bulkUpdate('status', {
      order: 17
    }, {
      name: 'aota'
    });
    await queryInterface.bulkUpdate('status', {
      order: 18
    }, {
      name: 'condIssued'
    });
    await queryInterface.bulkUpdate('status', {
      order: 19
    }, {
      name: 'purchased'
    });
    await queryInterface.bulkUpdate('status', {
      order: 20
    }, {
      name: 'in-force'
    });
    await queryInterface.bulkUpdate('status', {
      order: 21
    }, {
      name: 'declined'
    });
    await queryInterface.bulkUpdate('status', {
      order: 22
    }, {
      name: 'cancelled'
    });   
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkUpdate('status', {
      order: 0
    });
  }
};
