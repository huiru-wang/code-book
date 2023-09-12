import { GlobalContext } from '../../Context'
import { useContext, useState, useEffect, useRef } from "react";
import './style.css'

export interface CodeItem {
    itemId: number;
    itemKey: string;
    itemValue: string;
    description?: string;
    frequency: number;
    tag: string;
}

enum CopyTarget {
    KEY, VALUE
}

export const CodeCards: React.FC<{
    codeItems: CodeItem[],
    deleteCodeItem: (id: number) => void
    addNewCodeItem: (keyItem: string, valueItem: string) => void
    isTagSelected: boolean
}> = ({ codeItems, deleteCodeItem, addNewCodeItem, isTagSelected }) => {

    const { showMode, singleMode, clearMode, addMode } = useContext(GlobalContext);

    const [addStatus, setAddStatus] = useState(false);

    const keyInput = useRef<HTMLInputElement>(null);

    const valueInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setAddStatus(false)
    }, [addMode])


    const copyTextToClipboard = (codeItem: CodeItem, target: CopyTarget) => {
        const text = target === CopyTarget.KEY ? codeItem.itemKey : codeItem.itemValue;
        if (singleMode) {
            navigator.clipboard.writeText(text);
        } else {
            navigator.clipboard.writeText(codeItem.itemKey + " : " + codeItem.itemValue);
        }
    }

    const handleKeyKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            valueInput.current?.focus();
        }
    }

    const handleValueKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter' || event.key === 'NumpadEnter') {
            if (keyInput.current && valueInput.current) {
                addNewCodeItem(keyInput.current?.value, valueInput.current?.value);
            }
            setAddStatus(false);
        }
    }

    const toggleAddCodeItem = () => {
        setAddStatus(true);
    }

    return (
        <div className="code-cards">
            {
                codeItems
                    ?.sort((a: CodeItem, b: CodeItem) => b.frequency - a.frequency).slice(0, 10)
                    .map(item =>
                        <div className="code-card" key={item.itemId}>
                            <div className='card-key' onDoubleClick={() => copyTextToClipboard(item, CopyTarget.KEY)}>
                                <p>
                                    {item.itemKey}
                                </p>
                            </div>

                            <div className='card-value' onDoubleClick={() => copyTextToClipboard(item, CopyTarget.VALUE)}>
                                <input
                                    type={showMode ? "text" : "password"}
                                    disabled={true}
                                    value={item.itemValue}
                                    readOnly
                                //style={{ width: `${item.itemValue.length * 5}px` }}
                                />
                                <div className="invisible"></div>
                            </div>
                            {clearMode ? <span className="tag-delete" onClick={() => deleteCodeItem(item.itemId)}>❌</span> : <></>}
                        </div>
                    )
            }
            {
                addMode &&
                !addStatus &&
                isTagSelected &&
                <label className="customCheckBoxWrapper" style={{ marginLeft: "5px" }}>
                    <div className="customCheckBox" style={{ backgroundColor: "rgba(43, 107, 190, 0.16)", marginTop: "1.3em" }} onClick={toggleAddCodeItem}>
                        <div className="inner">➕</div>
                    </div>
                </label>
            }
            {
                addMode &&
                addStatus &&
                <div className="code-card" >
                    <div className='new-card'>
                        <input
                            type="text"
                            ref={keyInput}
                            onKeyDown={(e) => handleKeyKeyDown(e)}
                        />
                    </div>

                    <div className='new-card'>
                        <input
                            type="text"
                            ref={valueInput}
                            onKeyDown={(e) => handleValueKeyDown(e)}
                        />
                    </div>
                </div>
            }

        </div>
    )
}