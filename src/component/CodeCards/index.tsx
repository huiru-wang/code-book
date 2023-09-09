import { CopyModeOptions } from '../OptionButtons'
import './style.css'

export interface CodeItem {
    itemId: number;
    itemKey: string;
    itemValue: string;
    description: string | undefined;
    frequency: number;
    tags: string[];
}

enum CopyTarget {
    KEY, VALUE
}


export const CodeCards: React.FC<{ codeItems: CodeItem[], typeMode: string, copyMode: CopyModeOptions }> = ({ codeItems, typeMode, copyMode }) => {

    // const deleteCodeItem = () => {
    //     return;
    // }

    const copyTextToClipboard = (codeItem: CodeItem, target: CopyTarget) => {
        const text = target === CopyTarget.KEY ? codeItem.itemKey : codeItem.itemValue;
        switch (copyMode) {
            case CopyModeOptions.SINGLE:
                navigator.clipboard.writeText(text);
                break;
            case CopyModeOptions.MIXED:
                navigator.clipboard.writeText(codeItem.itemKey + " : " + codeItem.itemValue);
                break;
        }
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
                                    type={typeMode}
                                    disabled={true}
                                    value={item.itemValue}
                                    readOnly
                                //style={{ width: `${item.itemValue.length * 5}px` }}
                                />
                                <div className="invisible"></div>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}