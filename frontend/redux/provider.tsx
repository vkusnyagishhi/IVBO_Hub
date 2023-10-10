"use client";

import { store } from "./store";
import { Provider as RawProvider } from "react-redux";

export function Provider({ children }: { children: React.ReactNode }) {
    return <RawProvider store={store}>{children}</RawProvider>;
}