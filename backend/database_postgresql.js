const pg = require('pg');
const fs = require('fs');

const params = {
  host: 'sauna-matchmaking-db.cltaj2ngk5e5.eu-central-1.rds.amazonaws.com',
  port: 5432,
  user: 'master',
  database: 'sauna_production',
};

function loadPassword() {
  fs.readFile('./db_password.txt', 'utf8', (err, data) => {
    if (err) console.error(err);
    const pwdString = data.split('\n')[0];
    params.password = pwdString;
  });
}

loadPassword();

function getClient() {
  return new pg.Client(params);
}

// Returns JSON containing {name: {description: '', img_url: '', id: int}}
function getUsers(type, includeId, callback) {
  const client = getClient();
  const users = {};
  const query = {
    name: 'get-users',
    text: `
    SELECT id, name, description, img_url
    FROM Users
    LEFT OUTER JOIN Profiles ON Profiles.user_id = Users.id
    WHERE type = $1 AND active = TRUE;`,
    values: [type],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            users[row.name] = {
              description: row.description,
              img_url: row.img_url,
            };
            if (includeId) users[row.name].id = row.user_id;
          });
          callback(err2, users);
        }
        client.end();
      });
    }
  });
}

// Returns id, name and active status for all coaches and startups in form
// {
// coaches: [{name: '', id: int, active: true/false}]
// startups: [{name: '', id: int, active: true/false}]
// }
function getActiveStatuses(callback) {
  const client = getClient();
  const data = { coaches: [], startups: [] };
  const query = {
    name: 'get-activeStatuses',
    text: `
    SELECT user_id, name, type, active
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id;`,
    values: [],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (row.type === 1) {
              data.coaches.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            } else if (row.type === 2) {
              data.startups.push({
                id: row.user_id,
                name: row.name,
                active: row.active,
              });
            }
          });
          callback(err2, data);
        }
        client.end();
      });
    }
  });
}

// Changes active of user
function setActiveStatus(id, active, callback) {
  const client = getClient();
  const query = {
    name: 'set-activeStatus',
    text: `
    UPDATE Users
    SET active = $1
    WHERE id = $2;`,
    values: [active, id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          callback(err2, { status: 'success' });
        }
        client.end();
      });
    }
  });
}

// Returns JSON containing profile information based on id:
// {
// type: 'startup'/'coach',
// name: '',
// img_url: '',
// description: '',
// email: '',
// linkedin: '',
// credentials: [{company: '', position: ''}],
// }
function getProfile(id, callback) {
  const client = getClient();
  const info = {};
  const query = {
    name: 'get-profile',
    text: `
    SELECT name, img_url, description, email, website, CredentialsListEntries.title, CredentialsListEntries.content
    FROM Users
    LEFT OUTER JOIN Profiles ON Users.id = Profiles.user_id
    LEFT OUTER JOIN CredentialsListEntries ON Users.id = CredentialsListEntries.user_id
    WHERE Users.id = $1;`,
    values: [id],
  };
  client.connect((err) => {
    if (err) callback(err);
    else {
      client.query(query, (err2, res) => {
        if (err2) callback(err2);
        else {
          res.rows.forEach((row) => {
            if (info.name === undefined) {
              info.type = row.type === 1 ? 'coach' : 'startup';
              info.name = row.name;
              info.img_url = row.img_url;
              info.description = row.description;
              info.email = row.email;
              info.linkedIn = row.website;
              info.credentials = [{ company: row.title, position: row.content }];
            } else {
              info.credentials.push({ company: row.title, position: row.content });
            }
          });
          callback(err2, info);
        }
        client.end();
      });
    }
  });
}

module.exports = {
  getUsers,
  getActiveStatuses,
};
