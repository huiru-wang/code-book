import { createContext, useEffect, useState } from 'react';
const { ipcRenderer } = window.require('electron');

export const GlobalContext = createContext({});

export const GlobalProvider: React.FC<JSX.Element> = ({ children }) => {

    const [addMode, setAddMode] = useState(false);

    const [clearMode, setClearMode] = useState(false);

    const [codeChangeStatus, setCodeChangeStatus] = useState(false);

    const [tagChangeStatus, setTagChangeStatus] = useState(false);

    const [showMode, setShowMode] = useState(false);

    const [singleMode, setSingleMode] = useState(false);

    const context = { showMode, setShowMode, singleMode, setSingleMode, addMode, setAddMode, clearMode, setClearMode, codeChangeStatus, setCodeChangeStatus, tagChangeStatus, setTagChangeStatus }

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