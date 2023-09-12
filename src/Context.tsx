import { createContext, useEffect, useState, ReactNode } from 'react';
const { ipcRenderer } = window.require('electron');

export const GlobalContext = createContext<{
    addMode: boolean
    clearMode: boolean
    codeChangeStatus: boolean
    showMode: boolean,
    singleMode: boolean,
}>({
    addMode: false,
    clearMode: false,
    codeChangeStatus: false,
    showMode: false,
    singleMode: false
});

export const GlobalProvider: React.FC = ({ children }) => {

    const [addMode, setAddMode] = useState(false);

    const [clearMode, setClearMode] = useState(false);

    const [codeChangeStatus, setCodeChangeStatus] = useState(false);


    const [showMode, setShowMode] = useState(false);

    const [singleMode, setSingleMode] = useState(false);

    const context = { showMode, setShowMode, singleMode, setSingleMode, addMode, setAddMode, clearMode, setClearMode, codeChangeStatus, setCodeChangeStatus }

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