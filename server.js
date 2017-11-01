// server.js

const express = require('express');
const app = express();
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json());

// Authentication middleware provided by express-jwt.
// This middleware will check incoming requests for a valid
// JWT on any routes that it is applied to.
const authCheck = jwt({
  secret: new Buffer('YOUR_AUTH0_SECRET', 'base64'),
  audience: 'YOUR_AUTH0_CLIENT_ID'
});

var contacts = [
  {
    id: 1,
    name: 'Chris Sevilleja',
    email: 'chris@scotch.io',
    image: '//gravatar.com/avatar/8a8bf3a2c952984defbd6bb48304b38e?s=200'
  },
  {
    id: 2,
    name: 'Nick Cerminara',
    email: 'nick@scotch.io',
    image: '//gravatar.com/avatar/5d0008252214234c609144ff3adf62cf?s=200'
  },
  {
    id: 3,
    name: 'Ado Kukic',
    email: 'ado@scotch.io',
    image: '//gravatar.com/avatar/99c4080f412ccf46b9b564db7f482907?s=200'
  },
  {
    id: 4,
    name: 'Holly Lloyd',
    email: 'holly@scotch.io',
    image: '//gravatar.com/avatar/5e074956ee8ba1fea26e30d28c190495?s=200'
  },
  {
    id: 5,
    name: 'Ryan Chenkie',
    email: 'ryan@scotch.io',
    image: '//gravatar.com/avatar/7f4ec37467f2f7db6fffc7b4d2cc8dc2?s=200'
  }
];

function getDateString(dateOffset){
  let d = new Date();
  d.setTime(d.getTime() + dateOffset * 86400000 );
  var dd = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
  var mm = d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1 );
  var yyyy = d.getFullYear();
  return dd + '.' + mm + '.' + yyyy;
}

function saveOvertime(o) {
  let overtime = Object.assign({}, o);
  if(overtime.id != -1) {
    for(let i=0; i<allOvertimeEntries.length; i++) {
      if(allOvertimeEntries[i].id == overtime.id) {
        allOvertimeEntries[i] = overtime;
        break;
      }
    }
  } else {
    overtime.id = ++maxOvertimeId;
    allOvertimeEntries.push(overtime);
  }
  return overtime;
}

var maxOvertimeId = 5;
var allOvertimeEntries = [
  {
    id: 1,
    date : getDateString(0),
    startTime: '18:00',
    endTime: '21:00',
    freeTimeOn: '',
    comment: 'HZM Deployment 1'
  },
  {
    id: 2,
    date : getDateString(1),
    startTime: '18:00',
    endTime: '20:00',
    freeTimeOn: '19.10.2017',
    comment: 'HZM Deployment 2'
  },
  {
    id: 3,
    date : getDateString(2),
    startTime: '18:00',
    endTime: '20:00',
    freeTimeOn: '',
    comment: 'HZM Deployment 3'
  },
  {
    id: 4,
    date : getDateString(-31),
    startTime: '18:00',
    endTime: '20:00',
    freeTimeOn: '',
    comment: 'HZM Deployment 4'
  },
  {
    id: 5,
    date : getDateString(31),
    startTime: '18:00',
    endTime: '20:00',
    freeTimeOn: '',
    comment: 'HZM Deployment 5'
  }
];

app.get('/api/contacts', (req, res) => {
  const allContacts = contacts.map(contact => { 
    return { id: contact.id, name: contact.name}
  });
  res.json(allContacts);
});

app.get('/api/contacts/:id', (req, res) => {
  res.json(contacts.filter(contact => contact.id === parseInt(req.params.id)));
});

app.get('/api/overtimes', (req, res) => {
  res.json(allOvertimeEntries);
});

app.get('/api/overtimes/:id', (req, res) => {
  var entry;
  if(req.params.id == 'new') {
    entry = {id: -1, startTime: '18:00', endTime: '18:00'};
  } else {
    entry = allOvertimeEntries.filter(entry => entry.id === parseInt(req.params.id))[0];
  }
  res.json(entry);
});

app.post('/api/overtimes/save', (req, res) => {
  res.json(saveOvertime(req.body));
});


app.listen(3001);
console.log('Listening on http://localhost:3001');