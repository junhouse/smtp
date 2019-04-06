/**
 * Refer to RFC 5321 section 4.2.3. for complete list of response code
 */

// Positive Completion Reply
const service_name = 'junhouse';
const greeting = `250 OK version 0.0.1 ${service_name} SMTP`;
const two50 = '250 Requested mail action okay, completed';
const two21 = `${service_name} Service Closing transmission channel`;

// Positive Intermediary Reply
const three54 = 'Start mail input; end with <CRLF>.<CRLF>';

// Permanent Negative Completion reply
const five00 = 'Syntax error, command unrecognized (This may include errors such as command line too long)';
const five01 = 'Syntax error in parameters or arguments';
const five02 = 'Command not implemented';
const five03 = 'Bad sequence of commands';
const five04 = 'Command parameter not implemented';

module.exports = {
    greeting,
    two50,
    two21,
    three54,
    five00,
    five01,
    five02,
    five03,
    five04
}