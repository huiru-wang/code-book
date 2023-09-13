
import './App.css'
import { useState, useEffect } from "react";
import { CodeCards, CodeItem } from './component/CodeCards';
import { SearchBar } from './component/SearchBar';
import { CodeTags, ItemTag } from './component/CodeTags';
import { OptionButtons } from './component/OptionButtons';
const { ipcRenderer } = window.require('electron');

function App() {

  const [codeData, setCodeData] = useState<CodeItem[]>([]);

  const [allCoedData, setAllCodeData] = useState<CodeItem[]>([]);

  const [allTags, setAllTags] = useState<ItemTag[]>([]);

  const [selectedTag, setSelectedTag] = useState('')

  useEffect(() => {
    ipcRenderer.send('read-data');
    ipcRenderer.send('read-tags');

    // 监听主进程发送的消息
    ipcRenderer.on('read-data-response', (_, { data }) => {
      const codes: CodeItem[] = JSON.parse(data);
      setCodeData(codes);
      setAllCodeData(codes);
    });

    ipcRenderer.on("read-tags-response", (_, { data }) => {
      const tags: string[] = JSON.parse(data);
      const itemTags: ItemTag[] = tags.map(t => ({ tag: t, selected: false }))
      setAllTags(itemTags);
    })

    return () => {
      ipcRenderer.removeAllListeners('read-data-response');
      ipcRenderer.removeAllListeners('read-tags-response');
    };
  }, []);

  // search keywords
  const onSearch = (currentSearchTerm: string): void => {
    if (currentSearchTerm.length !== 0) {
      const targetTerm = currentSearchTerm.toLowerCase();
      const filteredCodeData = allCoedData.filter(item => item.itemKey.toLowerCase().includes(targetTerm))
      setCodeData(filteredCodeData)
    } else {
      setCodeData(allCoedData)
    }
  }

  // select tag
  const onTagSelected = (selectedTag: string): void => {
    setSelectedTag(selectedTag)
    if (selectedTag !== '' && selectedTag !== undefined) {
      const filteredCodeData = allCoedData.filter(codeItem => codeItem.tag === selectedTag)
      setCodeData(filteredCodeData);
    } else {
      setCodeData(allCoedData)
    }
  }

  const addNewTag = (newTag: string): void => {
    if (newTag !== '' && newTag !== undefined) {
      const newTagItem: ItemTag = { tag: newTag, selected: false }
      setAllTags(preTags => [...preTags, newTagItem]);
      const tags: string[] = allTags.map(tagItem => tagItem.tag);
      ipcRenderer.send('flush-tags', JSON.stringify(tags));
    }
  }

  const addNewCodeItem = (itemKey: string, itemValue: string): void => {
    const newId: number = allCoedData.sort((a, b) => b.itemId - a.itemId)[0].itemId + 1;
    const newCodeItem: CodeItem = {
      itemId: newId,
      itemKey: itemKey,
      itemValue: itemValue,
      frequency: 0,
      tag: selectedTag,
    };
    setCodeData(preData => [...preData, newCodeItem]);
    setAllCodeData(preData => [...preData, newCodeItem]);
    ipcRenderer.send('flush-data', JSON.stringify(allCoedData));

  }

  // clear one code item
  const deleteCodeItem = (target: number) => {
    const filteredData = codeData.filter(item => item.itemId !== target);
    setCodeData(filteredData);

    const allData = allCoedData.filter(item => item.itemId !== target);
    setAllCodeData(allData);

    ipcRenderer.send('flush-data', JSON.stringify(allData));
  }

  const deleteTag = (target: string) => {
    const filteredTags = allTags.filter(item => item.tag.toLowerCase() !== target.toLowerCase());
    const tags = filteredTags.map(itemTag => itemTag.tag)
    setAllTags(filteredTags)

    const filteredCodeData = codeData.filter(item => item.tag !== target);
    setCodeData(filteredCodeData);

    const filteredAllData = allCoedData.filter(item => item.tag !== target);
    setAllCodeData(filteredAllData);

    ipcRenderer.send('flush-data', JSON.stringify(filteredAllData));
    ipcRenderer.send('flush-tags', JSON.stringify(tags));
  }

  return (
    <>
      <SearchBar onSearch={onSearch} />

      <OptionButtons />

      <CodeTags itemTags={allTags} onTagSelected={onTagSelected} deleteTag={deleteTag} addNewTag={addNewTag} />

      <CodeCards codeItems={codeData} deleteCodeItem={deleteCodeItem} addNewCodeItem={addNewCodeItem} isTagSelected={selectedTag !== '' && selectedTag !== undefined} />
    </>
  )
}

export default App
