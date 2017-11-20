var express = require('express')
var Schema = require('./schema')
var graphQLHTTP = require('express-graphql')

var app = express()
app.use('/', graphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}))
app.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(`GraphQL Server is now running on localhost:${process.env.PORT || 8080}`)
})




// // server.js

// const express = require('express');
// const app = express();
// const jwt = require('express-jwt');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// app.use(cors());
// app.use(bodyParser.json());

// // Authentication middleware provided by express-jwt.
// // This middleware will check incoming requests for a valid
// // JWT on any routes that it is applied to.
// const authCheck = jwt({
//   secret: new Buffer('YOUR_AUTH0_SECRET', 'base64'),
//   audience: 'YOUR_AUTH0_CLIENT_ID'
// });

// function isValidTime(t) {
//   if(t) {
//     let parts = t.split(':');
//     if (parts.length != 2) return false;

//     const h = parseInt(parts[0]);
//     const m = parseInt(parts[1]);
//     if (isNaN(h) || isNaN(m)) return false;
//     if (h < 0 || h > 23) return false; //TODO: validate for custom intervals if needed
//     if (m < 0 || m > 59) return false;
//     return true;
//   }
//   return false;
// }

// function getTimeStringInMinutes(str) {
//   const time = str.split(':');
//   return parseInt(time[0])*60 + parseInt(time[1]);
// }

// function isValidDate(date) {
//   if (date) {
//     let parts = date.split('.');
//     if (parts.length != 3) return false;
    
//     const d = parseInt(parts[0]);
//     const m = parseInt(parts[1]);
//     const y = parseInt(parts[2]);
//     if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
//     if (m < 0 || m > 12) return false;
//     if (d < 0 || d > 31) return false; //TODO: proper validation of the date in corelation with the month and year
//     return true;
//   }
//   return false;
// }

// function getEntryDurationInMinutes(e) {
//   return getTimeStringInMinutes(e.endTime) - getTimeStringInMinutes(e.startTime);
// }

// function overlappingTimeIntervals(e1, e2) {
//   const start1 = getTimeStringInMinutes(e1.startTime);
//   const end1 = getTimeStringInMinutes(e1.endTime);
//   const start2 = getTimeStringInMinutes(e2.startTime);
//   const end2 = getTimeStringInMinutes(e2.endTime);
//   if(!(start2 >= end1 || end2 <= start1)) {
//     return {isValid: false, message: 'Overlapping with another entry!' +
//       '('+e1.startTime+' -> ' + e1.endTime+') ' +
//       '('+e2.startTime+' -> ' + e2.endTime+')' };
//   }
//   return {isValid: true};
// }

// function isValidComparedToOtherEntries(overtime) {
//   let totalMinutesOnDay = getEntryDurationInMinutes(overtime);
//   for(let i=0; i<allOvertimeEntries.length; i++){
//     const entry = allOvertimeEntries[i];
//     if(entry.id !== overtime.id && entry.date === overtime.date) {
//       const overlappingCheck = overlappingTimeIntervals(entry, overtime);
//       if(!overlappingCheck.isValid) {
//         return overlappingCheck;
//       }
//       totalMinutesOnDay += getEntryDurationInMinutes(entry);
//     }
//   }
//   if(totalMinutesOnDay > 180) {
//     return {isValid: false, message: 'Maximum 3h overtime can be booked for one day! You have ' + (totalMinutesOnDay-180) + ' extra minutes!'};
//   }
//   return {isValid: true};
// }

// function isValidOvertime(overtime) {
//   if (!isValidDate(overtime.date)) {
//     return {isValid: false, message: 'The overtime date is not a valid date!'};
//   }
//   if (overtime.freeTimeOn && !isValidDate(overtime.freeTimeOn)) {
//     return {isValid: false, message: 'The freeTimeOn is not a valid date!'};
//   }
//   if (!isValidTime(overtime.startTime) || !isValidTime(overtime.endTime)) {
//     return {isValid: false, message: 'StartTime or EndTime is not valid!'};
//   }
//   if (getTimeStringInMinutes(overtime.startTime) >= getTimeStringInMinutes(overtime.endTime)) {
//     return {isValid: false, message: 'EndTime should be after StartTime!'};
//   }
//   return isValidComparedToOtherEntries(overtime);
// }

// function getDateString(dateOffset){
//   let d = new Date();
//   d.setTime(d.getTime() + dateOffset * 86400000 );
//   var dd = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
//   var mm = d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + ( d.getMonth() + 1 );
//   var yyyy = d.getFullYear();
//   return dd + '.' + mm + '.' + yyyy;
// }

// function saveOvertime(o) {
//   let overtime = Object.assign({}, o);
//   let valid = isValidOvertime(overtime);
//   if(valid.isValid) {
//     if(overtime.id != -1) {
//       for(let i=0; i<allOvertimeEntries.length; i++) {
//         if(allOvertimeEntries[i].id == overtime.id) {
//           allOvertimeEntries[i] = overtime;
//           break;
//         }
//       }
//     } else {
//       overtime.id = ++maxOvertimeId;
//       allOvertimeEntries.push(overtime);
//     }
//     valid.overtime = overtime;
//   }
//   return valid;
// }

// var maxOvertimeId = 5;
// var allOvertimeEntries = [
//   {
//     id: 1,
//     date : getDateString(0),
//     startTime: '18:00',
//     endTime: '21:00',
//     freeTimeOn: '',
//     comment: 'HZM Deployment 1'
//   },
//   {
//     id: 2,
//     date : getDateString(1),
//     startTime: '18:00',
//     endTime: '20:00',
//     freeTimeOn: '19.10.2017',
//     comment: 'HZM Deployment 2'
//   },
//   {
//     id: 3,
//     date : getDateString(2),
//     startTime: '18:00',
//     endTime: '20:00',
//     freeTimeOn: '',
//     comment: 'HZM Deployment 3'
//   },
//   {
//     id: 4,
//     date : getDateString(-31),
//     startTime: '18:00',
//     endTime: '20:00',
//     freeTimeOn: '',
//     comment: 'HZM Deployment 4'
//   },
//   {
//     id: 5,
//     date : getDateString(31),
//     startTime: '18:00',
//     endTime: '20:00',
//     freeTimeOn: '',
//     comment: 'HZM Deployment 5'
//   }
// ];

// app.get('/api/overtimes', (req, res) => {
//   res.json(allOvertimeEntries);
// });

// app.get('/api/overtimes/:id', (req, res) => {
//   var entry;
//   if(req.params.id == 'new') {
//     entry = {id: -1, startTime: '18:00', endTime: '18:00'};
//   } else {
//     entry = allOvertimeEntries.filter(entry => entry.id === parseInt(req.params.id))[0];
//   }
//   res.json(entry);
// });

// app.post('/api/overtimes/save', (req, res) => {
//   res.json(saveOvertime(req.body));
// });


// app.listen(3001);
// console.log('Listening on http://localhost:3001');