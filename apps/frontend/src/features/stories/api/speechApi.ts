
import { API_BASE_URL } from "../../../lib/apiConfig";

export const playSpeech = async (text : string) => {
    // const request : generateSpeechRequest = {
    //     text : text
    // }
  const response = await fetch(`${API_BASE_URL}/api/v1/generate/speech`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify(request)
    body: JSON.stringify({
      text: text,
    }),
  });

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  const audio = new Audio(url);

  audio.onended = () => {
    URL.revokeObjectURL(url);
  };

  await audio.play();
};