const net = require('net');
const SMTP = require('./smtp.js');
const { greeting } = require('./response_code.js');
const { write_to_stream } = require('./utils.js');

const server = net.createServer(function(stream) {
    const SMTP_stream_writer = write_to_stream(stream);
    // Initial TCP connection
    SMTP_stream_writer(greeting);
    const SMTP_server = new SMTP(stream, SMTP_stream_writer);
});

// SMPT listens to port 25 - requires sudo
server.listen(1337);