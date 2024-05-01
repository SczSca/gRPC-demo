const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

/** for a new service, what the client consumes,
 * @param port string (server address and port)
 * @param credentials credentials ()
 */
const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure());

client.createTodo({
    "id": -1,
    "text": "Sample text"
}, ( err, response ) => {
    if(err) {
        console.error(`some error: ${err.message}`);
    }else{
        console.log(`success creation item: ${JSON.stringify(response)}`);
    }
})

client.readTodos({}, (err, response) =>{
    if(err) {
        console.error(`some error: ${err.message}`);
    }else{
        // console.log(`Received from server: ${JSON.stringify(response)}`);
        // response.items.forEach( i => console.log( i.text ));
    }
})

const callObj = client.readTodosStream();

callObj.on("data", item => {
    console.log(`Received item from server: ${JSON.stringify(item)}`);
});

callObj.on("end", e => console.log("Server done"));