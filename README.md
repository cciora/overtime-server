# overtime-server
# start with: node server.js

# graphQL + mongoDB example: https://www.compose.com/articles/using-graphql-with-mongodb/

# nodeJS + DynamoDB example: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/GettingStarted.NodeJs.04.html

# settup local DynamoDB: https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html

<!-- query Query {
  overtimes {
    id, comment, date, startTime, endTime, freeTimeOn, user
  }
}

query QueryId {
  overtime (id: "06bab8a5-b17a-4c91-a5a1-740d6c52362e") {
    id, comment, date, startTime, endTime, freeTimeOn, user
  }
}

mutation Delete {
  delete (id: "813a1571-2122-42b1-a108-0e1aaeced78f"){
    id
  }
}

mutation Add {
  add (
    date: "20.02.2018",
    startTime: "18:00",
    endTime: "20:00",
    comment: "Test",
    freeTimeOn: "13.03.2018"
  ) {
    id
  }
} -->