import "./style.css"
import { useState, useEffect } from 'react';


export interface ItemTag {
    tag: string,
    selected: boolean
}

export const CodeTags: React.FC<{ itemTags: ItemTag[], onTagSelected: (selectedTags: string[]) => void }> = ({ itemTags, onTagSelected }) => {

    // 首次传参可能为undefined，后续也不会更新，因此需要监听入参来更新
    const [itemTagList, setItemTagList] = useState(itemTags)

    useEffect(() => {
        setItemTagList(itemTags)
    }, [itemTags])


    // TODO: 可修改为仅监听label事件，而非div
    const handleToggle = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLDivElement;
        if (target.tagName === 'DIV' && target.parentElement?.tagName === 'LABEL' && target.parentElement.parentElement?.tagName === 'DIV') {
            const changedTag = target.innerText.substring(1);
            const selectedTags: string[] = [];
            const updateItemTags: ItemTag[] = itemTagList.map(codeTag => {
                if (codeTag.tag === changedTag) {
                    codeTag.selected = !codeTag.selected;
                }
                if (codeTag.selected) {
                    selectedTags.push(codeTag.tag);
                }
                return codeTag;
            });
            setItemTagList(updateItemTags)
            onTagSelected(selectedTags)
        }
    }

    return (
        <div className='code-tags'>
            {
                itemTagList?.map((itemTag, index) =>
                    <div className="customCheckBoxHolder" key={index} onClick={(e) => handleToggle(e)}>
                        <input
                            type="checkbox"
                            checked={itemTag.selected}
                            className="customCheckBoxInput"
                        />
                        <label className="customCheckBoxWrapper">
                            <div className="customCheckBox">
                                <div className="inner">#{itemTag.tag}</div>
                            </div>
                        </label>
                    </div>
                )
            }
        </div>

    )
}