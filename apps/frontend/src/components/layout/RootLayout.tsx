import { Outlet } from "react-router-dom";
import {Navbar} from "../layout/Navbar";

export function RootLayout() {
    return (
        <>
            <Navbar />

            <main className="py-8">
                <Outlet />
            </main>
        </>
    );
}