const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
var { timber } = require('./timber');

const SCOPES = [
    'https://www.googleapis.com/auth/drive',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/spreadsheets.readonly'
];

const TOKEN_PATH = 'token.json';

let oAuth2Client;
let _token;

fs.readFile('credentials.json', (err, content) => {
  if (err) return timber.error('Error loading client secret file:', {err});
  authorize(JSON.parse(content));
});


function authorize(credentials) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[0]);

  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err)
      return getNewToken(oAuth2Client);
    _token = JSON.parse(token);
    oAuth2Client.setCredentials(_token);
  });
}

function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return timber.error('Error while trying to retrieve access token', {err});
      oAuth2Client.setCredentials(token);
      _token = token;
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return timber.error("Error while trying store the Token", {err});
        timber.info('Token stored to', {TOKEN_PATH});
      });
    });
  });
}

function getSheets(spreadsheetId, range, callback) {
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client
  });
  sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  }, callback);
}


function appendValues(spreadsheetId, range, values, callback ) {
  let resource = {
    values,
  };
  const sheets = google.sheets({
    version: 'v4',
    auth: oAuth2Client
  });
  return new Promise( (resolve, reject) => {
    sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "USER_ENTERED",
      resource
      }, (err, result) => {
        if (err) {
          return reject(err)
        }
        return resolve(result)
      });
  }) 
}

exports.getSheets = getSheets
exports.appendValues = appendValues