# smtp

Node.js implementation of simple SMTP server.

### How to start up the server

```
node server.js
```

### How to connect to the server using terminal (Mac OS)
```
nc localhost 1337
```

### Example Interaction
```
nc localhost 1337
250 OK version 0.0.1 junhouse SMTP
HELO domain.com
250 Requested mail action okay, completed
MAIL FROM:<john@domain.com>
250 Requested mail action okay, completed
RCPT TO:<jessica@gmail.com>
250 Requested mail action okay, completed
DATA
Start mail input; end with <CRLF>.<CRLF>
Hello,
Are you coming to my graduation party this weekend?
John
.
250 Requested mail action okay, completed
QUIT
junhouse Service Closing transmission channel
```