import {buildApp} from "./app.js";
import {env} from "./config/env.js";

const app = buildApp();

async function start() {
    try{
        await app.listen({
            port: env.PORT,
            host: env.HOST
        });
        console.log("server running on port 3000");
    } catch (error){
        app.log.error(error);
        process.exit(1);
    }
}

start();