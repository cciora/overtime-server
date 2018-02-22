//var Schema = mongoose.Schema
var graphql = require('graphql')
var GraphQLObjectType = graphql.GraphQLObjectType
var GraphQLBoolean = graphql.GraphQLBoolean
var GraphQLID = graphql.GraphQLID
var GraphQLString = graphql.GraphQLString
var GraphQLList = graphql.GraphQLList
var GraphQLNonNull = graphql.GraphQLNonNull
var GraphQLSchema = graphql.GraphQLSchema

function getDateString(dateOffset) {
    let d = new Date();
    d.setTime(d.getTime() + dateOffset * 86400000);
    var dd = d.getDate() >= 10 ? d.getDate() : '0' + d.getDate();
    var mm = d.getMonth() >= 9 ? d.getMonth() + 1 : '0' + (d.getMonth() + 1);
    var yyyy = d.getFullYear();
    return dd + '.' + mm + '.' + yyyy;
}

var nextOvertimeId = 6;
var allOvertimeEntries = [
    {
        id: 1,
        date: getDateString(0),
        startTime: '18:00',
        endTime: '21:00',
        freeTimeOn: '',
        comment: 'HZM Deployment 1'
    },
    {
        id: 2,
        date: getDateString(1),
        startTime: '18:00',
        endTime: '20:00',
        freeTimeOn: '19.10.2017',
        comment: 'HZM Deployment 2'
    },
    {
        id: 3,
        date: getDateString(2),
        startTime: '18:00',
        endTime: '20:00',
        freeTimeOn: '',
        comment: 'HZM Deployment 3'
    },
    {
        id: 4,
        date: getDateString(-31),
        startTime: '18:00',
        endTime: '20:00',
        freeTimeOn: '',
        comment: 'HZM Deployment 4'
    },
    {
        id: 5,
        date: getDateString(31),
        startTime: '18:00',
        endTime: '20:00',
        freeTimeOn: '',
        comment: 'HZM Deployment 5'
    }
];

var OvertimeType = new GraphQLObjectType({
    name: 'overtime',
    fields: () => ({
        id: {
            type: GraphQLID,
            description: 'Overtime id'
        },
        date: {
            type: GraphQLString,
            description: 'Overtime date in format dd.mm.yyyy'
        },
        startTime: {
            type: GraphQLString,
            description: 'The time when the overtime started in format hh:mm'
        },
        endTime: {
            type: GraphQLString,
            description: 'The time when the overtime started in format hh:mm'
        },
        freeTimeOn: {
            type: GraphQLString,
            description: 'The date when free time is used on behaf of the overtime (format dd.mm.yyyy)'
        },
        comment: {
            type: GraphQLString,
            description: 'Overtime comment'
        }
    })
})

var promiseAllOvertimes = () => {
    return new Promise((resolve, reject) => {
        resolve(allOvertimeEntries);
    })
}

var promiseGetOvertime = (id) => {
  return new Promise((resolve, reject) => {
    for (let i=0; i<allOvertimeEntries.length; i++){
      if (allOvertimeEntries[i].id == id) {
        resolve(allOvertimeEntries[i]);
      }
    }
    reject("Id " + id + " could not be found!");
  });
}

var QueryType = new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        overtimes: {
            type: new GraphQLList(OvertimeType),
            resolve: () => {
                return promiseAllOvertimes()
            }
        },
        overtime: {
          type: OvertimeType,
          description: "Find an Overtime by ID",
          args: {
            id: {type: new GraphQLNonNull(GraphQLID)}
          },
          resolve: (root, args) => {
            return promiseGetOvertime(args.id);
          }
        }
    })
})


var MutationAdd = {
    type: OvertimeType,
    description: 'Add an Overtime',
    args: {
        id: {
          name: 'Overtime ID',
          type: GraphQLID
        },
        date: {
            name: 'Overtime date',
            type: new GraphQLNonNull(GraphQLString)
        },
        startTime: {
            name: 'Overtime start time',
            type: new GraphQLNonNull(GraphQLString)
        },
        endTime: {
            name: 'Overtime end time',
            type: new GraphQLNonNull(GraphQLString)
        },
        freeTimeOn: {
            name: 'Overtime free time on',
            type: new GraphQLNonNull(GraphQLString)
        },
        comment: {
            name: 'Overtime comment',
            type: new GraphQLNonNull(GraphQLString)
        }
    },
    resolve: (root, args) => {
        let idx=-1;
        if (args.id) {
          for (let i=0; i<allOvertimeEntries.length; i++) {
            if (allOvertimeEntries[i].id == args.id) {
              idx = i;
            }
          }
        }
        overtime = {
          id: (idx!=-1 ? args.id : nextOvertimeId),
          date: args.date,
          startTime: args.startTime,
          endTime: args.endTime,
          freeTimeOn: args.freeTimeOn,
          comment: args.comment
        };

        return new Promise((resolve, reject) => {
            if(idx == -1) {
              allOvertimeEntries.push(overtime);
              nextOvertimeId = parseInt(overtime.id) + 1;
            } else {
              allOvertimeEntries[idx] = overtime;
            }
            resolve(overtime)
        })
    }
}

var MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: MutationAdd,
        //   destroy: MutationDestroy,
        //   save: MutationSave
    }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})
