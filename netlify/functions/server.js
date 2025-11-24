// const serverless = require('serverless-http');
// const app = require('../../index'); 

// module.exports.handler = serverless(app);

const serverless = require('serverless-http');
const { app, connectDB } = require('../../index'); 
let cachedHandler;

async function connectAndGetHandler() {
    await connectDB(); 
    return serverless(app);
}
module.exports.handler = async (event, context) => {
    if (!cachedHandler) {
        cachedHandler = await connectAndGetHandler();
    }
    
    return cachedHandler(event, context);
};