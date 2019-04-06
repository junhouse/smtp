/**
 * State Variable
 * 0: No TCP connection
 * 1: TCP connection is established. Greeting is sent to the user
 * 2: HELO command is processed. 
 * 3: MAIL command is processed.
 * 4: RCPT command is processed.
 * 5: DATA command is processed. Ready to accept email body.
 * 6: Email body is received and processed.
 */
const { two50, two21, three54, five00, five01, five03 } = require('./response_code.js');
const { StringDecoder } = require('string_decoder');

function SMTP(tcp_connection, stream_writer) {
    this.state = 0;
    this.stream = tcp_connection;
    this.stream_writer = stream_writer;
    if(tcp_connection) this.state++;
    
    this.error_state = false;
    this.client_domain = '';
    this.mail_from = '';
    this.mail_to = '';
    this.mail_content = '';

    this.stream.on('data', (chunk) => {
        let decoder = new StringDecoder('utf8');
        let decoded_stream = decoder.write(chunk);

        if (decoded_stream !== '') {
            if (this.state === 5) { // process email content
                const email_body_chunk = decoded_stream.toString();
                // End of Body Stream
                if (email_body_chunk === '.\n') {
                    this.state++;
                    this.stream_writer(two50);
                    return;
                }
                this.mail_content += email_body_chunk;
                decoder.end();
                return;
            }
            else {
                const client_message = decoded_stream.toString().trim();
                decoder.end();
                const client_command = client_message.slice(0,4);
                const command_params = client_message.substring(4);
                this.handle_command(client_command, command_params);
            }
        }
    });
}

/* Class methods */
SMTP.prototype.handle_command = function(cmd, opts) {
    switch(cmd) {
        case 'HELO': {
            this.stream_writer(this.handle_helo(opts));
            break;
        }
        case 'MAIL': {
            this.stream_writer(this.handle_mail(opts));
            break;
        }
        case 'RCPT': {
            this.stream_writer(this.handle_rcpt(opts));
            break;
        }
        case 'DATA': {
            this.stream_writer(this.handle_data(opts));
            break;
        }
        case 'QUIT': {
            this.stream_writer(this.handle_quit(opts));
            this.stream.end();
            this.reset();
            break;
        }
        default: {
            this.stream_writer(five00);
            this.reset();
            break;
        }
    }
}

/* HELO command */
SMTP.prototype.handle_helo = function(opts) {
    this.state++;
    this.client_domain = opts.trim();
    return two50;
}

/* MAIL command */
SMTP.prototype.handle_mail = function(opts) {
    if (this.state !== 2) return five03;
    if (typeof opts !== 'string') return five01;

    opts = opts.trim();
    let email_from = opts.substring(5);
    email_from = email_from.replace(/^</, '').replace(/>$/, '').trim();

    const email_check=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (email_check.test(email_from)) {
        this.mail_from = email_from;
        this.state++;
        return two50;
    }
}

/* RCPT command */
SMTP.prototype.handle_rcpt = function(opts) {
    if (this.state !== 3) return five03;
    if (typeof opts !== 'string') return five01;

    opts = opts.trim();
    let email_to = opts.substring(3);
    email_to = email_to.replace(/^</, '').replace(/>$/, '').trim();

    const email_check=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    if (email_check.test(email_to)) {
        this.mail_to = email_to;
        this.state++;
        return two50;
    }
}

/**
 * DATA command
 * Refer to 4.1.1.4 for details
 */
SMTP.prototype.handle_data = function(opts) {
    if (this.state !== 4) return five03;
    this.state++;
    return three54;
}

/* QUIT command */
SMTP.prototype.handle_quit = function(opts) {
    return two21;
}

/* Other member methods */
SMTP.prototype.reset = function() {
    this.state = 0;
    this.stream = null;
    this.stream_writer = null;
    this.error_state = null;
    this.mail_from = '';
    this.mail_to = '';
    this.mail_content = '';
}

module.exports = function(tcp_connection, stream_writer) {
    return new SMTP(tcp_connection, stream_writer);
}