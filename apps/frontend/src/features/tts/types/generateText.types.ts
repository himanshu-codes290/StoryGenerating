export type GenerateTextRequest = {
    text: string;
    task: string;
    tone?: string;
};

export type GenerateTextResponse = {
    jobId: string;
    status: string;
    streamUrl: string;
};

export type GenerateTextCallbacks = {
    onToken: (token: string) => void;
    onComplete: () => void;
    onError: (message: string) => void;
};