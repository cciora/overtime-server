//var Schema = mongoose.Schema
var graphql = require('graphql')
const uuidv4 = require('uuid/v4');
var GraphQLObjectType = graphql.GraphQLObjectType;
var GraphQLBoolean = graphql.GraphQLBoolean;
var GraphQLID = graphql.GraphQLID;
var GraphQLString = graphql.GraphQLString;
var GraphQLList = graphql.GraphQLList;
var GraphQLNonNull = graphql.GraphQLNonNull;
var GraphQLSchema = graphql.GraphQLSchema;

var OvertimeDB = require('./db/OvertimeDB');

var staticUser = "cciora";

var isValidString = function(str) {
    return str && str.trim() != "";
}

var OvertimeType = new GraphQLObjectType({
    name: 'overtime',
    fields: () => ({
        id: {
            type: GraphQLString,
            description: 'Overtime id'
        },
        user: {
            type: GraphQLString,
            description: 'User'
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
        OvertimeDB.OvertimeDB.searchOvertimes(resolve, reject, {"user":staticUser});
    })
}

var promiseGetOvertime = (id) => {
  return new Promise((resolve, reject) => {
    OvertimeDB.OvertimeDB.findOvertime(resolve, reject, {"id":id, "user":staticUser});
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
          type: GraphQLString
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
            type: GraphQLString
        },
        comment: {
            name: 'Overtime comment',
            type: GraphQLString
        }
    },
    resolve: (root, args) => {
        let isNew = !isValidString(args.id);
        overtime = {
          id: (isNew ? uuidv4() : args.id),
          user: staticUser
        };
        if (isValidString(args.date)) {
            overtime.date = args.date;
        }
        if (isValidString(args.startTime)) {
            overtime.startTime = args.startTime;
        }
        if (isValidString(args.endTime)) {
            overtime.endTime = args.endTime;
        }
        if (isValidString(args.freeTimeOn)) {
            overtime.freeTimeOn = args.freeTimeOn;
        }
        if (isValidString(args.comment)) {
            overtime.comment = args.comment;
        }

        return new Promise((resolve, reject) => {
            if(isNew) {
              OvertimeDB.OvertimeDB.addOvertime(resolve, reject, overtime);
            } else {
              OvertimeDB.OvertimeDB.editOvertime(resolve, reject, overtime);
            }
        })
    }
}

var MutationDelete = {
    type: OvertimeType,
    description: 'Delete an Overtime',
    args: {
        id: {
          name: 'Overtime ID',
          type: GraphQLString
        }
    },
    resolve: (root, args) => {
        return new Promise((resolve, reject) => {
            OvertimeDB.OvertimeDB.deleteOvertime(resolve, reject, {"id":args.id,"user":staticUser});
        })
    }
}

var MutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        add: MutationAdd,
        delete: MutationDelete
    }
})

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})
