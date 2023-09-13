import { createContext, useEffect, useState, ReactNode } from 'react';
const { ipcRenderer } = window.require('electron');

interface GlobalProviderProps {
    children: ReactNode;
}

export const GlobalContext = createContext<{
    addMode: boolean
    clearMode: boolean
    showMode: boolean,
    singleMode: boolean,
    setAddMode: (value: boolean) => void,
    setClearMode: (value: boolean) => void,
    setShowMode: (value: boolean) => void,
    setSingleMode: (value: boolean) => void
}>(null);

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {

    const [addMode, setAddMode] = useState(false);

    const [clearMode, setClearMode] = useState(false);

    const [showMode, setShowMode] = useState(false);

    const [singleMode, setSingleMode] = useState(false);

    const context = { addMode, setAddMode, clearMode, setClearMode, showMode, setShowMode, singleMode, setSingleMode }

    useEffect(() => {
        ipcRenderer.send('read-settings');

        ipcRenderer.on("read-settings-response", (_, { data }) => {
            const settings = JSON.parse(data);
            setShowMode(settings["showMode"]);
            setSingleMode(settings["singleMode"]);
        })

        return () => {
            ipcRenderer.removeAllListeners('read-settings-response');
        };
    }, []);

    return (
        <GlobalContext.Provider value={context}>
            {children}
        </GlobalContext.Provider>
    );
};