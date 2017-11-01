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