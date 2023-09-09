import "./style.css"
import { useState } from "react";

export enum CopyModeOptions {
    SINGLE, MIXED
}


export const OptionButtons: React.FC<{ toggleShowMode: (showMode: boolean) => void, toggleCopyMode: (copyMode: CopyModeOptions) => void }> = ({ toggleShowMode, toggleCopyMode }) => {

    const [showMode, setShowMode] = useState(true);

    const [copyMode, setCopyMode] = useState(true);

    const handleShowMode = () => {
        toggleShowMode(!showMode)
        setShowMode(!showMode);
    }

    const handleCopyMode = () => {
        setCopyMode(!copyMode);
        toggleCopyMode(copyMode ? CopyModeOptions.SINGLE : CopyModeOptions.MIXED);
    }

    return (
        <>
            <div className="code-button">
                <div className="checkbox-wrapper-25" >
                    {/* <label className="code-label">ShowMode</label> */}
                    <input type="checkbox" checked={showMode} onChange={handleShowMode} />
                </div>
                <div className="checkbox-wrapper-25">
                    {/* <label className="code-label">CopyMode</label> */}
                    <input type="checkbox" checked={copyMode} onChange={handleCopyMode} />
                </div>
            </div>
        </>
    );
}