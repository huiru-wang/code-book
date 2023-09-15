
import './App.css'
import { useState, useEffect } from "react";
import { CodeCards } from './component/CodeCards';
import { SearchBar } from './component/SearchBar';
import { CodeTags } from './component/CodeTags';
import { OptionButtons } from './component/OptionButtons';
import { CodeItem, ItemTag, DataType } from './component/types';
const { ipcRenderer } = window.require('electron');

function App() {

  const [codeData, setCodeData] = useState<CodeItem[]>([]);

  const [allCodeData, setAllCodeData] = useState<CodeItem[]>([]);

  const [allTags, setAllTags] = useState<ItemTag[]>([]);

  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    ipcRenderer.send('read-data');
    ipcRenderer.send('read-tags');

    // 监听主进程发送的消息
    ipcRenderer.on('read-data-response', (_, { data }) => {
      const codes: CodeItem[] = data["codes"];
      const tags: string[] = [...data["tags"]];
      const itemTags: ItemTag[] = tags.map(t => ({ tag: t, selected: false }))
      setAllTags(itemTags);
      setCodeData(codes);
      setAllCodeData(codes);
    });

    return () => {
      ipcRenderer.removeAllListeners('read-data-response');
    };
  }, []);

  // search keywords
  const onSearch = (currentSearchTerm: string): void => {
    if (currentSearchTerm.length !== 0) {
      const clearSelectedTags = allTags.map(item => ({ tag: item.tag, selected: false }));
      setAllTags(clearSelectedTags);
      const targetTerm = currentSearchTerm.toLowerCase();
      const filteredCodeData = allCodeData.filter(item => item.itemKey.toLowerCase().includes(targetTerm))
      setCodeData(filteredCodeData)
    } else {
      setCodeData(allCodeData)
    }
  }

  // select tag
  const onTagSelected = (selectedTag: string): void => {
    setSelectedTag(selectedTag)
    if (selectedTag !== '' && selectedTag !== undefined) {
      const filteredCodeData = allCodeData.filter(codeItem => codeItem.tag === selectedTag)
      setCodeData(filteredCodeData);
    } else {
      setCodeData(allCodeData)
    }
  }

  // add tag
  const addNewTag = (newTag: string): void => {
    if (newTag !== '' && newTag !== undefined) {
      const newTagItem: ItemTag = { tag: newTag, selected: false }
      const all = [...allTags, newTagItem];
      setAllTags(all);
      const tags: string[] = all.map(tagItem => tagItem.tag);
      ipcRenderer.send('flush-data', DataType.TAG, JSON.stringify(tags));
    }
  }

  const addNewCodeItem = (itemKey: string, itemValue: string): void => {
    let newId = 1;
    if (allCodeData.length > 0) {
      newId = allCodeData.sort((a, b) => b.itemId - a.itemId)[0].itemId + 1;
    }
    const newCodeItem: CodeItem = {
      itemId: newId,
      itemKey: itemKey,
      itemValue: itemValue,
      tag: selectedTag,
    };
    const newCodeData = [...codeData, newCodeItem];
    const newAllCodeData = [...allCodeData, newCodeItem];
    setCodeData(newCodeData);
    setAllCodeData(newAllCodeData);
    ipcRenderer.send('flush-data', DataType.CODE, JSON.stringify(newAllCodeData));
  }

  // clear one code item
  const deleteCodeItem = (target: number) => {
    const filteredData = codeData.filter(item => item.itemId !== target);
    setCodeData(filteredData);

    const allData = allCodeData.filter(item => item.itemId !== target);
    setAllCodeData(allData);

    ipcRenderer.send('flush-data', DataType.CODE, JSON.stringify(allData));
  }

  const deleteTag = (target: string) => {
    const filteredTags = allTags.filter(item => item.tag.toLowerCase() !== target.toLowerCase());
    const tags = filteredTags.map(itemTag => itemTag.tag)
    setAllTags(filteredTags)

    const filteredCodeData = codeData.filter(item => item.tag !== target);
    setCodeData(filteredCodeData);

    const filteredAllData = allCodeData.filter(item => item.tag !== target);
    setAllCodeData(filteredAllData);

    ipcRenderer.send('flush-data', DataType.CODE, JSON.stringify(filteredAllData));
    ipcRenderer.send('flush-data', DataType.TAG, JSON.stringify(tags));
  }

  return (
    <>
      <SearchBar
        onSearch={onSearch}
      />

      <OptionButtons />

      <CodeTags
        itemTags={allTags}
        onTagSelected={onTagSelected}
        deleteTag={deleteTag}
        addNewTag={addNewTag}
      />

      <CodeCards
        codeItems={codeData}
        deleteCodeItem={deleteCodeItem}
        addNewCodeItem={addNewCodeItem}
        selectedTag={selectedTag}
      />
    </>
  )
}

export default App
