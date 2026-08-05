import {buildApp} from "./app.js";
import {env} from "./config/env.js";
import "./worker/storyGeneration.worker.js"
import "./worker/textGeneration.worker.js"

const app = buildApp();

async function start() {
    try{
        await app.listen({
            port: env.PORT,
            host: env.HOST
        });
        console.log(`server running on port ${env.PORT}`);
    } catch (error){
        app.log.error(error);
        process.exit(1);
    }
}

start();