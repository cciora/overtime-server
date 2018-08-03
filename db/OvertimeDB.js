var AWS = require("aws-sdk");
var Config = require('../config')

if(Config.DB_INSTALLATION_TYPE == "LOCAL") {
    AWS.config.loadFromPath('./db/credentials.json');
}

var docClient = new AWS.DynamoDB.DocumentClient();

var TableNames = {OVERTIMES: "Overtimes", USERS: "Users"};

var OvertimeDB = {

    addOvertime(successFunction, errorFunction, overtime) {
        var params = {
            TableName: TableNames.OVERTIMES,
            Item: overtime
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("Added item:", JSON.stringify(params.Item, null, 2));
                successFunction(params.Item);
            }
        });
    },

    editOvertime(successFunction, errorFunction, overtime) {
        var params = {
            TableName: TableNames.OVERTIMES,
            Key: {
                "user":overtime.user,
                "id":overtime.id
            },
            UpdateExpression: "set #d=:d, startTime=:s, endTime=:e, freeTimeOn=:f, #c=:c",
            ExpressionAttributeNames:{
                "#d": "date",
                "#c": "comment"
            },
            ExpressionAttributeValues:{
                ":d":overtime.date,
                ":s":overtime.startTime,
                ":e":overtime.endTime,
                ":f":(overtime.freeTimeOn?overtime.freeTimeOn:null),
                ":c":(overtime.comment?overtime.comment:null)
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(overtime);
            }
        });
    },

    findOvertime(successFunction, errorFunction, args) {
        var params = {
            TableName: TableNames.OVERTIMES,
            Key: {
                "user": args.user,
                "id": args.id
            }
        };
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(data.Item);
            }
        });
    },

    searchOvertimes(successFunction, errorFunction, searchParams) {
        var params = {
            TableName : TableNames.OVERTIMES,
            KeyConditionExpression: "#usr= :user",
            ExpressionAttributeNames:{
                "#usr": "user"
            },
            ExpressionAttributeValues: {
                ":user":searchParams.user
            }
        };
        return docClient.query(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                errorFunction(err)
            } else {
                console.log("Query succeeded.");
                successFunction(data.Items);
            }
        });
    },

    deleteOvertime(successFunction, errorFunction, args) {
        var params = {
            TableName: TableNames.OVERTIMES,
            Key: {
                "user": args.user,
                "id": args.id
            },
            ConditionExpression:"id = :id",
            ExpressionAttributeValues: {
                ":id": args.id
            }
        };
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(data);
            }
        });
    },

    addUser(successFunction, errorFunction, user) {
        var params = {
            TableName: TableNames.USERS,
            Item: user
        };

        docClient.put(params, function(err, data) {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("Added item:", JSON.stringify(params.Item, null, 2));
                successFunction(params.Item);
            }
        });
    },

    editUser(successFunction, errorFunction, user) {
        var params = {
            TableName: TableNames.USERS,
            Key: {
                "id": user.id
            },
            UpdateExpression: "set firstName=:f, lastName=:l, roles=:r",
            ExpressionAttributeValues:{
                ":f":user.firstName,
                ":l":user.lastName,
                ":r":(user.roles ? user.roles : [])
            },
            ReturnValues:"UPDATED_NEW"
        };

        docClient.update(params, function(err, data) {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(overtime);
            }
        });
    },

    findUser(successFunction, errorFunction, args) {
        var params = {
            TableName: TableNames.USERS,
            Key: {
                "id": args.id
            }
        };
        docClient.get(params, function(err, data) {
            if (err) {
                console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(data.Item);
            }
        });
    },

    getAllUsers(successFunction, errorFunction) {
        var params = {
            TableName : TableNames.USERS
        };
        return docClient.scan(params, function(err, data) {
            if (err) {
                console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
                errorFunction(err)
            } else {
                console.log("Query succeeded.");
                successFunction(data.Items);
            }
        });
    },

    deleteUser(successFunction, errorFunction, args) {
        var params = {
            TableName: TableNames.USERS,
            Key: {
                "id": args.id
            },
            ConditionExpression:"id = :id",
            ExpressionAttributeValues: {
                ":id": args.id
            }
        };
        docClient.delete(params, function(err, data) {
            if (err) {
                console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
                errorFunction(err);
            } else {
                console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
                successFunction(data);
            }
        });
    }
}

module.exports.OvertimeDB = OvertimeDB;
