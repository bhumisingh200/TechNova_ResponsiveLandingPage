const net = require('net');
const tls = require('tls');
const fs = require('fs');
const path = require('path');

const EMAILS_DIR = path.join(__dirname, 'sent_emails');
if (!fs.existsSync(EMAILS_DIR)) {
  fs.mkdirSync(EMAILS_DIR, { recursive: true });
}

function writeEmailToFile(to, subject, htmlBody) {
  const filename = `${Date.now()}-${to.replace(/[^a-zA-Z0-9.-]/g, '_')}.html`;
  const filePath = path.join(EMAILS_DIR, filename);
  const content = `To: ${to}
Subject: ${subject}
Date: ${new Date().toString()}
--------------------------------------------------
${htmlBody}
`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`[Mail Mock] Email written to: ${filePath}`);
}

async function sendMail({ to, subject, html }) {
  // Always write to file for inspection and verification
  writeEmailToFile(to, subject, html);

  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.log('[Mail] SMTP configuration is missing or incomplete in environment. Simulating success.');
    return { success: true, simulated: true };
  }

  return new Promise((resolve, reject) => {
    let socket;
    let step = 0;
    const secure = process.env.SMTP_SECURE === 'true' || port === 465;
    const log = [];
    
    function send(data) {
      log.push(`C: ${data}`);
      socket.write(data + '\r\n');
    }

    const connectionOptions = { host, port };
    
    if (secure) {
      socket = tls.connect(port, host, { rejectUnauthorized: false }, onConnect);
    } else {
      socket = net.connect(connectionOptions, onConnect);
    }

    socket.setEncoding('utf8');

    function onConnect() {
      log.push(`S: [Connected]`);
    }

    socket.on('data', (chunk) => {
      log.push(`S: ${chunk.trim()}`);
      const line = chunk.trim();
      const code = parseInt(line.substring(0, 3));

      try {
        if (step === 0 && (code === 220)) {
          send(`EHLO localhost`);
          step = 1;
        } else if (step === 1 && code === 250) {
          if (!secure && line.includes('STARTTLS')) {
            send('STARTTLS');
            step = 2;
          } else {
            send('AUTH LOGIN');
            step = 3;
          }
        } else if (step === 2 && code === 220) {
          // Upgrade connection to TLS
          const tlsSocket = tls.connect({
            socket: socket,
            rejectUnauthorized: false
          }, () => {
            log.push('S: [TLS Handshake Completed]');
          });
          tlsSocket.setEncoding('utf8');
          socket = tlsSocket;
          // Re-wire events to the upgraded socket
          tlsSocket.on('data', socket.listeners('data')[0]);
          tlsSocket.on('error', socket.listeners('error')[0]);
          tlsSocket.on('close', socket.listeners('close')[0]);
          send('EHLO localhost');
          step = 1.5;
        } else if (step === 1.5 && code === 250) {
          send('AUTH LOGIN');
          step = 3;
        } else if (step === 3 && code === 334) {
          send(Buffer.from(user).toString('base64'));
          step = 4;
        } else if (step === 4 && code === 334) {
          send(Buffer.from(pass).toString('base64'));
          step = 5;
        } else if (step === 5 && code === 235) {
          send(`MAIL FROM:<${user}>`);
          step = 6;
        } else if (step === 6 && code === 250) {
          send(`RCPT TO:<${to}>`);
          step = 7;
        } else if (step === 7 && code === 250) {
          send('DATA');
          step = 8;
        } else if (step === 8 && code === 354) {
          const headers = [
            `From: "Technova Portal" <${user}>`,
            `To: <${to}>`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            'Content-Type: text/html; charset=utf-8',
            '',
            html,
            '.'
          ].join('\r\n');
          send(headers);
          step = 9;
        } else if (step === 9 && code === 250) {
          send('QUIT');
          step = 10;
        } else if (step === 10 && code === 221) {
          socket.end();
          resolve({ success: true, log });
        } else if (code >= 400) {
          socket.end();
          reject(new Error(`SMTP Error: ${line}\nLog:\n${log.join('\n')}`));
        }
      } catch (err) {
        socket.end();
        reject(err);
      }
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

module.exports = { sendMail };
