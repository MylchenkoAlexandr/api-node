'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('States', [{
      name: 'AL',
      title: 'Alabama',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'AK',
      title: "Alaska",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'AZ',
      title: "Arizona",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'AR',
      title: "Arkansas",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'CA',
      title: "California",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'CO',
      title: "Colorado",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'CT',
      title: "Connecticut",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'DE',
      title: "Delaware",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'FL',
      title: "Florida",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'GA',
      title: "Georgia",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'HI',
      title: "Hawaii",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'ID',
      title: "Idaho",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'IL',
      title: "Illinois",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'IN',
      title: "Indiana",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'IA',
      title: "Iowa",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'KS',
      title: "Kansas",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'KY',
      title: "Kentucky",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'LA',
      title: "Louisiana",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'ME',
      title: "Maine",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MD',
      title: "Maryland",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MA',
      title: "Massachusetts",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MI',
      title: "Michigan",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MN',
      title: "Minnesota",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MS',
      title: "Mississippi",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MO',
      title: "Missouri",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'MT',
      title: "Montana",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NE',
      title: "Nebraska",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NV',
      title: "Nevada",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NH',
      title: "New Hampshire",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NJ',
      title: "New Jersey",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NM',
      title: "New Mexico",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NY',
      title: "New York",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'NC',
      title: "North Carolina",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'ND',
      title: "North Dakota",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'OH',
      title: "Ohio",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'OK',
      title: "Oklahoma",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'OR',
      title: "Oregon",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'PA',
      title: "Pennsylvania",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'RI',
      title: "Rhode Island",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'SC',
      title: "South Carolina",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'SD',
      title: "South Dakota",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'TN',
      title: "Tennessee",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'TX',
      title: "Texas",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'UT',
      title: "Utah",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'VT',
      title: "Vermont",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'VA',
      title: "Virginia",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'WA',
      title: "Washington",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'WV',
      title: "West Virginia",
      createdAt: new Date(),
      updatedAt: new Date()
    },

    {
      name: 'WI',
      title: "Wisconsin",
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'WY',
      title: "Wyoming",
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('States', null, {});
  }
};


