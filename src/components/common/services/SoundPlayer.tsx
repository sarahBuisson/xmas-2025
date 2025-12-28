import React, { useRef, useImperativeHandle, forwardRef } from "react";

type SoundPlayerHandle = {
    playSound: (url: string) => void;
};

export const SoundPlayer = forwardRef<SoundPlayerHandle>((_, ref) => {
    const audioMap = useRef<Map<string, HTMLAudioElement>>(new Map());

    useImperativeHandle(ref, () => ({
        playSound: (url: string) => {
            let audio = audioMap.current.get(url);

            if (!audio) {
                audio = new Audio(url); // Create a new audio element
                audioMap.current.set(url, audio); // Store it in the map
            }
            audio.loop=false
            audio.currentTime = 0; // Reset to start
            audio.play();
        },

        stopSound: (url: string) => {
            let audio = audioMap.current.get(url);

            if (audio) {
                console.log("stopping sound", url);
                audio.pause();
                audio.currentTime = 0; // Reset to start
            }
        }
    }));

    return null; // No visual output
});
