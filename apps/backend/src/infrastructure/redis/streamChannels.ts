export function getTextStreamChannel(
    jobId: string | number
): string {

    return `text-stream:${jobId}`;

}

export type StreamEvent =
  | {
      type: "token";
      data: string;
    }
  | {
      type: "complete";
    }
  | {
      type: "error";
      message: string;
    };