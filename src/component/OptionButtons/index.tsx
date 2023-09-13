import "./style.css"
import { GlobalContext } from '../../Context'
import { useContext } from "react";
const { ipcRenderer } = window.require('electron');

export const OptionButtons = () => {

    const { showMode, setShowMode } = useContext(GlobalContext);

    const { singleMode, setSingleMode } = useContext(GlobalContext);

    const { addMode, setAddMode, clearMode, setClearMode } = useContext(GlobalContext);

    const toggleShowMode = () => {
        const currentStatus = !showMode;
        setShowMode(currentStatus);
        flushSettings(currentStatus, singleMode);
    }

    const toggleSingleMode = () => {
        const currentStatus = !singleMode;
        setSingleMode(currentStatus);
        flushSettings(showMode, currentStatus);
    }

    const flushSettings = (showMode: boolean, singleMode: boolean) => {
        const settings = {
            "showMode": showMode,
            "singleMode": singleMode
        }
        ipcRenderer.send('flush-settings', JSON.stringify(settings));
    }

    const handleAddMode = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        if (!clearMode) {
            setAddMode(!addMode);
        } else {
            e.preventDefault();
        }
    }

    const handleClearMode = (e: React.MouseEvent<HTMLLabelElement, MouseEvent>) => {
        if (!addMode) {
            setClearMode(!clearMode);
        } else {
            e.preventDefault();
        }
    }

    return (
        <>
            <div className="code-button">
                <div className="switch-button">
                    <div className="checkbox-wrapper-25" >
                        <input type="checkbox" checked={showMode} onClick={toggleShowMode} readOnly />
                    </div>
                    <div className="checkbox-wrapper-25">
                        <input type="checkbox" checked={singleMode} onClick={toggleSingleMode} readOnly />
                    </div>
                </div>
                {/* 添加模式、删除模式 */}
                <div className="mode-button">
                    <div className="checkbox-wrapper-8">
                        <input type="checkbox" id="cb3-0" className="tgl tgl-skewed" checked={addMode} readOnly />
                        <label
                            htmlFor="cb3-0"
                            data-tg-on="Done"
                            data-tg-off="Add"
                            className="tgl-btn"
                            onClick={(e) => handleAddMode(e)}
                        ></label>
                    </div>
                    <div className="checkbox-wrapper-8">
                        <input type="checkbox" id="cb3-1" className="tgl tgl-skewed" checked={clearMode} readOnly />
                        <label
                            htmlFor="cb3-1"
                            data-tg-on="Done"
                            data-tg-off="Clear"
                            className="tgl-btn"
                            onClick={(e) => handleClearMode(e)}
                        ></label>
                    </div>
                </div>

            </div>
        </>
    );
}