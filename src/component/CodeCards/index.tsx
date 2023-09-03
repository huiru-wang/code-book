import './style.css'

export interface CodeItem {
    itemId: number;
    itemKey: string;
    itemValue: string;
    description: string | undefined;
    frequency: number;
    tags: string[];
}

export const CodeCards: React.FC<{ codeItems: CodeItem[] }> = ({ codeItems }) => {

    // const deleteCodeItem = () => {
    //     return;
    // }

    // TODO: 同时copy选项
    // const handleCopyPair = () => {
    //     return;
    // }

    return (
        <div className="code-cards">
            {
                codeItems
                    ?.sort((a: CodeItem, b: CodeItem) => b.frequency - a.frequency).slice(0, 10)
                    .map(item =>
                        <div className="code-card" key={item.itemId}>
                            <div className='card-key'>
                                <p onDoubleClick={(e: any) => navigator.clipboard.writeText(e.target.innerText)}>
                                    {item.itemKey}
                                </p>
                            </div>
                            {/* TODO password visible mode: 显示、不显示 */}
                            <div className='card-value' onDoubleClick={(e: any) => navigator.clipboard.writeText(e.target.value)}>
                                <input
                                    type="password"
                                    disabled={true}
                                    value={item.itemValue}
                                    readOnly
                                    style={{ width: `${item.itemValue.length * 5}px` }}
                                />
                                <div className="invisible"></div>
                            </div>
                        </div>
                    )
            }
        </div>
    )
}