//importing Express
const express = require("express");

//creating instance
const app = express();

//importing sqlite,sqlite3 and path
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

//use of json in script
app.use(express.json());

//creating path
const dataPath = path.join(__dirname, "todoApplication.db");

//initialize database
let dataBase = null;

//initialize database and server
const initializeDataBaseAndServer = async () => {
  try {
    dataBase = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at 3000 port");
    });
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};
initializeDataBaseAndServer();

//checking the invalid statements
const validStatus = (requestQuery) => {
  let listElement = ["TO DO", "IN PROGRESS", "DONE"];
  return;
  listElement.some((element) => element === requestQuery.status);
};

const validPriority = (requestQuery) => {
  let list = ["HIGH", "MEDIUM", "LOW"];
  return;
  listElement.some((eachElement) => eachElement === requestQuery.priority);
};

const validCategory = (requestQuery) => {
  let list = ["WORK", "HOME", "LEARNING"];
  return;
  listElement.some((eachElement) => eachElement === requestQuery.category);
};

/*validate function
function validate(request, response, next) {
  const requestQuery = request.query;
  if (requestQuery !== undefined) {
    next();
  }
}
*/
//functions
const possibleFunction1 = (requestQuery) => {
  return (
    requestQuery.category === undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status !== undefined
  );
};

const possibleFunction2 = (requestQuery) => {
  return (
    requestQuery.category === undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status === undefined
  );
};

const possibleFunction3 = (requestQuery) => {
  return (
    requestQuery.category === undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined
  );
};

const possibleFunction4 = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status === undefined
  );
};

const possibleFunction5 = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority === undefined &&
    requestQuery.status !== undefined
  );
};

const possibleFunction6 = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status === undefined
  );
};

const possibleFunction7 = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined
  );
};

//creating output Format
const outputFormat = (dbObject) => {
  return {
    id: dbObject.id,
    todo: dbObject.todo,
    priority: dbObject.priority,
    category: dbObject.category,
    status: dbObject.status,
    dueDate: dbObject.due_date,
  };
};

//creating API 1
app.get("/todos/", async (request, response) => {
  const requestQuery = request.query;
  console.log(requestQuery);
  let getQuery;
  switch (true) {
    case possibleFunction1(requestQuery):
      if (validStatus(requestQuery)) {
        getQuery = `select * from todo where
                todo='${requestQuery.todo}' and
                status='${requestQuery.status}'`;
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case possibleFunction2(requestQuery):
      if (validPriority(requestQuery)) {
        getQuery = `select * from todo where
            todo='${requestQuery.todo}' and 
            priority='${requestQuery.priority}'`;
      } else {
        response.status(400);
        response.send("Invalid Todo Priority");
      }
      break;

    case possibleFunction3(requestQuery):
      if (validStatus(requestQuery)) {
        if (validPriority(requestQuery)) {
          getQuery = `select * from todo where
                    todo='${requestQuery.todo}' and 
                    priority='${requestQuery.priority}' and 
                    status='${requestQuery.status}'`;
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case possibleFunction4(requestQuery):
      if (validCategory(requestQuery)) {
        getQuery = `select * from todo where
                todo='${requestQuery.todo}' and
                category='${requestQuery.category}'`;
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case possibleFunction5(requestQuery):
      if (validStatus(requestQuery)) {
        if (validCategory(requestQuery)) {
          getQuery = `select * from todo where
                    todo='${requestQuery.todo}' and 
                    category='${requestQuery.category}' and
                    status='${requestQuery.status}'`;
        } else {
          response.status(400);
          response.send("Invalid Todo Category");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Status");
      }
      break;

    case possibleFunction6(requestQuery):
      if (validCategory(requestQuery)) {
        if (validPriority(requestQuery)) {
          getQuery = `select * from todo where
                    todo='${requestQuery.todo}' and 
                    category='${requestQuery.category}' and
                    priority='${requestQuery.priority}'`;
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    case possibleFunction7(requestQuery):
      if (validCategory(requestQuery)) {
        if (validPriority(requestQuery)) {
          if (validStatus(requestQuery)) {
            getQuery = `select * from todo where
                        todo='${requestQuery.todo}' and
                        category='${requestQuery.category}' and
                        priority='${requestQuery.priority}' and
                        status='${requestQuery.status}'`;
          } else {
            response.status(400);
            response.send("Invalid Todo Status");
          }
        } else {
          response.status(400);
          response.send("Invalid Todo Priority");
        }
      } else {
        response.status(400);
        response.send("Invalid Todo Category");
      }
      break;

    default:
      getQuery = `select from todo where
            todo='${requestQuery.todo}'`;
      break;
  }

  const getResponse = await dataBase.all(getQuery);
  response.send(getResponse.map((eachElement) => outputFormat(eachElement)));
});

//creating API2
