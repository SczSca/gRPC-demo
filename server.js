const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
//communication between services will be plaintext | use createSsl
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), errorFunction);
server.addService(todoPackage.Todo.service,
{
    "createTodo": createTodo,
    "readTodos": readTodos,
    "readTodosStream": readTodosStream
});


const todos = [];

function createTodo(call, callback) {
    const todoItem = {
        "id": todos.length + 1,
        "text": call.request.text
    }
    todos.push(todoItem);
    callback(null, todoItem);
}

function readTodos(call, callback) {
    callback(null, {"items": todos})
}

function readTodosStream(call, callback) {
    todos.forEach(item => call.write(item));
    call.end();
}

function errorFunction(err, port) {
    if (err) {
        console.error(`Server error: ${err.message}`);
    } else {
        console.log(`Server bound on port: ${port}`);
    }
}