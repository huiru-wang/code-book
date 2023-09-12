import "./style.css"
import { GlobalContext } from '../../Context'
import { useState, useEffect, useContext, useRef } from 'react';

export interface ItemTag {
    tag: string,
    selected: boolean
}

export const CodeTags: React.FC<
    { itemTags: ItemTag[], onTagSelected: (selectedTag: string) => void, deleteTag: (tag: string) => void, addNewTag: (newTag: string) => void }> =
    ({ itemTags, onTagSelected, deleteTag, addNewTag }) => {

        // 首次传参可能为undefined，后续也不会更新，因此需要监听入参来更新
        const [itemTagList, setItemTagList] = useState(itemTags);

        const [addStatus, setAddStatus] = useState(false);

        const { clearMode, addMode, setTagChangeStatus } = useContext(GlobalContext);

        const tagInputRef = useRef(null);

        useEffect(() => {
            setItemTagList(itemTags)
        }, [itemTags])

        useEffect(() => {
            setAddStatus(false)
        }, [addMode])

        const handleClick = (itemTag: ItemTag) => {
            const tag = itemTag.tag;
            const updateItemTags: ItemTag[] = itemTagList.map(codeTag => {
                if (codeTag.tag === tag) {
                    if (codeTag.selected === true) {
                        codeTag.selected = false;
                        onTagSelected('')
                    } else {
                        codeTag.selected = true;
                        onTagSelected(tag)
                    }
                } else {
                    codeTag.selected = false;
                }
                return codeTag;
            });
            setItemTagList(updateItemTags)
        }

        const handleDelete = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, tag: string) => {
            deleteTag(tag);
            e.stopPropagation(); // 阻止事件冒泡
        }

        const toggleAddItem = () => {
            setAddStatus(true);
            // TODO focus input 
        }

        const handleFinish = (event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === 'Enter' || event.key === 'NumpadEnter') {
                addNewTag(event.target.value);
                setAddStatus(false);
                setTagChangeStatus(true);
            }
        }

        return (
            <div className='code-tags'>
                {
                    itemTagList?.map((itemTag, index) =>
                        <div className="customCheckBoxHolder" key={index} onClick={() => handleClick(itemTag)}>
                            <input
                                type="checkbox"
                                checked={itemTag.selected}
                                className="customCheckBoxInput"
                                readOnly
                            />
                            <label className="customCheckBoxWrapper">
                                <div className="customCheckBox">
                                    <div className="inner">#{itemTag.tag}</div>
                                </div>
                            </label>
                            {clearMode ? <div className="delete-icon" onClick={(e) => handleDelete(e, itemTag.tag)}>❌</div> : <></>}
                        </div>
                    )
                }
                {
                    addMode && !addStatus &&
                    <div className="customCheckBoxHolder">
                        <input
                            type="checkbox"
                            className="customCheckBoxInput"
                        />
                        <label className="customCheckBoxWrapper">
                            <div className="customCheckBox" style={{ backgroundColor: "rgba(43, 107, 190, 0.16)" }} onClick={toggleAddItem}>
                                <div className="inner">➕</div>
                            </div>
                        </label>
                    </div>
                }
                {
                    addMode && addStatus && <input
                        type="text"
                        className="customTagInput"
                        ref={tagInputRef}
                        onKeyDown={(e) => handleFinish(e)}
                    />
                }

            </div>

        )
    }