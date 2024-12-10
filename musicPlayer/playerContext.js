import {  createContext, useContext } from "react";
import useMusicEngine from "./useMusicEngine";


// Context allow seperation of hook and render.
// This is needed because NowPlayingScreen should share control with playerController

const MusicControllerContext = createContext();

export const MusicControllerProvider = ({ children }) => {
    const musicHook = useMusicEngine();

    return (
        <MusicControllerContext.Provider value={musicHook}>
            {children}
        </MusicControllerContext.Provider>
    );
};

export const renderPlayerController = () => {
    const contex = useContext(MusicControllerContext);
    if (!contex) {
        throw new Error("renderPlayerController need to be wrapped by MusicControllerProvider.");
    }

    return contex;
}