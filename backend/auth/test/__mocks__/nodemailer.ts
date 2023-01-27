// Mock file
/* eslint-disable @typescript-eslint/no-var-requires */
const nodemailer = require('nodemailer');
const nodemailerMock = require('nodemailer-mock').getMockFor(nodemailer);
module.exports = nodemailerMock;