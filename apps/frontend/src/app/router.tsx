import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/RootLayout";
import { HomePage } from "@/pages/HomePage";
import { StoryPage } from "@/pages/StoryPage";
import { TextToSpeechPage } from "@/pages/TextToSpeechPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            {
                index: true,
                element: <HomePage />
            },
            {
                path: "story",
                element: <StoryPage />
            },
            {
                path: "tts",
                element: <TextToSpeechPage />
            }
        ]
    }
]);