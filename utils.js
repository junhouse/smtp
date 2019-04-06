/**
 * Take message and write to stream ending with CRLF
 */
const write_to_stream = (stream) => {
    return (message) => {
        message = message + '\r\n';
        stream.write(message);
    }
}

module.exports = {
    write_to_stream
}