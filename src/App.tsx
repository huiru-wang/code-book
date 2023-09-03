
import './App.css'
import { useState, useEffect } from "react";
import { CodeCards, CodeItem } from './component/CodeCards';
import { SearchBar } from './component/SearchBar';
import { CodeTags, ItemTag } from './component/CodeTags';
const { ipcRenderer } = window.require('electron');

function App() {

  const [codeData, setCodeData] = useState<CodeItem[]>([]);

  const [allCoedData, setAllCodeData] = useState<CodeItem[]>([]);

  const [allTags, setAllTags] = useState<ItemTag[]>([]);

  const [, setErrorMessage] = useState('');

  useEffect(() => {
    ipcRenderer.send('read-code-file');
    // 监听主进程发送的消息
    ipcRenderer.on('read-code-file-response', (_, { data, error }) => {
      if (error) {
        setErrorMessage(error);
      } else {
        console.log(data);
        const codes: CodeItem[] = JSON.parse(data);
        const tags = Array.from(new Set(codes.flatMap(codeItem => codeItem.tags)));
        const itemTags: ItemTag[] = tags.map(tag => ({ tag: tag, selected: false }))
        setCodeData(codes);
        setAllCodeData(codes);
        setAllTags(itemTags);
      }
    });
    return () => {
      ipcRenderer.removeAllListeners('read-code-file-response');
    };
  }, []);

  // TODO: 搜索模式：key、value、mixed
  const onSearch = (currentSearchTerm: string): void => {
    if (currentSearchTerm.length !== 0) {
      const targetTerm = currentSearchTerm.toLowerCase();
      const filteredCodeData = allCoedData.filter(item => item.itemKey.toLowerCase().includes(targetTerm))
      setCodeData(filteredCodeData)
    } else {
      setCodeData(allCoedData)
    }
  }

  const onTagSelected = (selectedTags: string[]): void => {
    if (selectedTags.length !== 0) {
      const filteredCodeData = allCoedData.filter(codeItem => codeItem.tags.find(tag => selectedTags.includes(tag)) !== undefined)
      setCodeData(filteredCodeData);
    } else {
      setCodeData(allCoedData)
    }
  }

  // TODO: form add new code item
  // const addNewCode = (itemKey: string, itemValue: string, description: string | undefined) => {
  //   const newId: number = allCoedData.sort((a, b) => a.itemId - b.itemId)[0].itemId + 1;
  //   const newCodeItem: CodeItem = {
  //     itemId: newId,
  //     itemKey: itemKey,
  //     itemValue: itemValue,
  //     description: description,
  //     frequency: 0,
  //     tags: [],
  //   };
  //   allCoedData.push(newCodeItem);
  //   setAllCodeData(allCoedData);
  // }

  // const deleteCodeItem = (itemKey: string) => {
  //   return;
  // }

  return (
    <>
      <SearchBar onSearch={onSearch} />

      <CodeTags itemTags={allTags} onTagSelected={onTagSelected} />

      <CodeCards codeItems={codeData} />
    </>
  )
}

export default App
