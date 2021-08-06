//importing path,sqlite,express js,sqlite3
const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

//creating instance use of json
const app = express();
app.use(express.json());

//creating dataPath
const dataPath = path.join(__dirname, "todoApplication.db");
let dataBase = null;

//initialize database and server
const initializeDatabaseAndServer = async () => {
  try {
    dataBase = await open({
      filename: dataPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at localhost 3000");
    });
  } catch (error) {
    console.log("error");
    process.exit(1);
  }
};
initializeDatabaseAndServer();

//creating output format
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

function validateStatus(request, response, next) {
  const requestBody = request.query;
  let possibleList = ["TO DO", "IN PROGRESS", "DONE"];

  if (requestBody.status !== undefined) {
    console.log(true);
    if (
      possibleList.some((eachElement) => eachElement === requestBody.status)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    next();
  }
}

function validatePriority(request, response, next) {
  const requestBody = request.query;
  let possibleList = ["HIGH", "MEDIUM", "LOW"];
  if (requestBody.priority !== undefined) {
    if (
      possibleList.some((eachElement) => eachElement === requestBody.priority)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else {
    next();
  }
}
function validateCategory(request, response, next) {
  let possibleList = ["WORK", "HOME", "LEARNING"];
  const requestBody = request.query;
  if (requestBody.category !== undefined) {
    if (
      possibleList.some((eachElement) => eachElement === requestBody.category)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    next();
  }
}
function validateDueDate(request,response,next){
    const requestQuery=request.query
    if (requestQuery.due_date!==undefined) {
        if(){
            
        }else{
            response.status(400)
            response.send("Invalid Due Date")
        }
    }else{
        next()
    }
}
function validateStatusForPut(request, response, next) {
  const requestBody = request.body;
  let possibleList = ["TO DO", "IN PROGRESS", "DONE"];

  if (requestBody.status !== undefined) {
    console.log(true);
    if (
      possibleList.some((eachElement) => eachElement === requestBody.status)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else {
    next();
  }
}

function validatePriorityForPut(request, response, next) {
  const requestBody = request.body;
  let possibleList = ["HIGH", "MEDIUM", "LOW"];
  if (requestBody.priority !== undefined) {
    if (
      possibleList.some((eachElement) => eachElement === requestBody.priority)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else {
    next();
  }
}
function validateCategoryForPut(request, response, next) {
  let possibleList = ["WORK", "HOME", "LEARNING"];
  const requestBody = request.body;
  if (requestBody.category !== undefined) {
    if (
      possibleList.some((eachElement) => eachElement === requestBody.category)
    ) {
      next();
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    next();
  }
}

//possible functions
const possibleFunction1 = (requestBody) => {
  return requestBody.status !== undefined;
};

const possibleFunction2 = (requestBody) => {
  return requestBody.priority !== undefined;
};

const possibleFunction3 = (requestBody) => {
  return requestBody.category !== undefined;
};

const possibleFunction4 = (requestBody) => {
  return requestBody.status !== undefined && requestBody.priority !== undefined;
};

const possibleFunction5 = (requestBody) => {
  return requestBody.status !== undefined && requestBody.category !== undefined;
};

const possibleFunction6 = (requestBody) => {
  return (
    requestBody.priority !== undefined && requestBody.category !== undefined
  );
};

const possibleFunction7 = (requestBody) => {
  return (
    requestBody.status !== undefined &&
    requestBody.category !== undefined &&
    requestBody.priority !== undefined
  );
};

//creating API 1
app.get(
  "/todos/",
  validateStatus,
  validatePriority,
  validateCategory,
  async (request, response) => {
    const {
      search_q = "",
      category,
      priority,
      status,
      dueDate,
    } = request.query;
    let getQuery = null;
    switch (true) {
      case possibleFunction1(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            status='${status}'
            `;
        break;
      case possibleFunction2(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            priority='${priority}'
            `;
        break;
      case possibleFunction3(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            category='${category}'
            `;
        break;
      case possibleFunction4(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and 
            status='${status}' and
            priority='${priority}'
            `;
        break;
      case possibleFunction5(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            status='${status}' and
            category='${category}' 
            `;
        break;
      case possibleFunction6(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            priority='${priority}' and
            category='${category}'
            `;
        break;
      case possibleFunction7(request.query):
        getQuery = `
            select * from todo where
            todo like '%${search_q}%' and
            status='${status}' and
            priority='${priority}' and
            category='${category}'
            `;
        break;
      default:
        getQuery = `
            select * from todo where
            todo like '%${search_q}%'
            `;
        break;
    }
    const getResponse = await dataBase.all(getQuery);
    response.send(getResponse.map((each) => outputFormat(each)));
  }
);

//creating API 2
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getQuery = `
  select * from todo where
  id=${todoId}
  `;
  const getResponse = await dataBase.get(getQuery);
  response.send(outputFormat(getResponse));
});

//creating API 3
app.get("/agenda/", async (request, response) => {
  const { dueDate } = request.query;
  const getQuery = `
    select * from todo where
    due_date=${dueDate}
    `;
  const getResponse = await dataBase.get(getQuery);
  response.send(outputFormat(getResponse));
});

//creating api 4
app.post(
  "/todos/",
  validateStatusForPut,
  validatePriorityForPut,
  validateCategoryForPut,
  async (request, response) => {
    const { id, todo, priority, status, category, dueDate } = request.body;
    console.log(request.body);
    const postQuery = `
  insert into todo(id,todo,category,priority,status,due_date)
  values(
      ${id},
      '${todo}',
      '${category}',
      '${priority}',
      '${status}',
      ${dueDate}
  )
  `;
    await dataBase.run(postQuery);
    response.send("Todo Successfully Added");
  }
);

//creating API 5
app.put(
  "/todos/:todoId/",
  validateStatusForPut,
  validateCategoryForPut,
  validatePriorityForPut,
  async (request, response) => {
    const { todoId } = request.params;
    const requestBody = request.body;
    let updateWord = "";
    let putQuery = null;
    console.log(request.body);
    console.log(todoId);
    if (requestBody.status !== undefined) {
      putQuery = `
        update todo
        set
            status ='${requestBody.status}'
        where
        id=${todoId}
        `;
      updateWord = "Status";
    } else if (requestBody.priority !== undefined) {
      putQuery = `
        update todo
        set
            priority='${requestBody.priority}' 
        where
        id=${todoId}
        `;
      updateWord = "Priority";
    } else if (requestBody.category) {
      putQuery = `
        update todo 
        set
            category='${requestBody.category}'
        where
        id=${todoId}
        `;
      updateWord = "Category";
    } else if (requestBody.todo !== undefined) {
      putQuery = `
        update todo
        set
            todo='${requestBody.todo}' 
        where
        id=${todoId}
        `;
      updateWord = "Todo";
    } else {
      putQuery = `
        update todo
        set
            due_date='${requestBody.due_date}'
        where id=${todoId}
        `;
      updateWord = "Due Date";
    }
    console.log(updateWord);
    await dataBase.run(putQuery);
    response.send(`${updateWord} Updated`);
  }
);

//creating API 6
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteQuery = `
    delete from todo
    where id=${todoId}
    `;
  await dataBase.run(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
