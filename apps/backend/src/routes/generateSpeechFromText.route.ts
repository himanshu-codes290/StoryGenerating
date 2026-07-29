import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { TTSRequest, TTSResult} from "@repo/types/speech/tts.types"
import { generateSpeech } from "../services/generateTextToSpeech.service.js";

export async function generateSpeechRoute(app : FastifyInstance)
{
    app.post("/generate/speech", async (request : FastifyRequest<{Body : TTSRequest }>, reply : FastifyReply) => {
        // const { text } = request.body as { text: string };

        // const stream = await createAudioStreamFromText(text);


        // reply.header("Content-Type", "audio/mpeg");
        // reply.header("Transfer-Encoding", "chunked");

        // for await (const chunk of stream) {
        //     reply.raw.write(chunk);
        // }

        // reply.raw.end();
        const result = await generateSpeech(request.body);

        reply.header("Content-Type", result.contentType);

        return reply.send(result.stream);
    })
}
