import path from 'node:path'
import fs from 'fs';
import os from 'os';
import { IpcMainEvent } from 'electron'
import { CodeItem, DataType } from '../src/component/types';


// 样例数据
export const createExampleData = (): string => {
    const example: CodeItem[] = [
        {
            itemId: 1,
            itemKey: "Hello Code Book👋",
            itemValue: "Hello World",
            tag: "Hello World"
        },
        {
            itemId: 2,
            itemKey: "Double-click to copy the key or value.",
            itemValue: "This is the value.",
            tag: "Double-click"
        },
        {
            itemId: 3,
            itemKey: "Toggle second button and copy.",
            itemValue: "This is the value.",
            tag: "CopyMode"
        },
        {
            itemId: 4,
            itemKey: "Toggle first button.",
            itemValue: "Now you can see me.",
            tag: "ShowMode"
        }
    ];
    return JSON.stringify(example);
}

const createExampleSettings = (): string => {
    const example = {
        "showMode": false,
        "singleMode": false
    };
    return JSON.stringify(example);
}

const BASE_CODE_FOLDER_PATH = path.join(os.homedir(), '.codebook');
const CODE_DATA_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "code.json");
const TAGS_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "tags.json");
const SETTINGS_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "settings.json");

// 读取/初始化数据文件
export const readCodeData = (event: IpcMainEvent) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }

    const data = {}

    try {
        fs.accessSync(CODE_DATA_FILE_PATH, fs.constants.F_OK)
    } catch (error) {
        const exampleData: string = createExampleData();
        fs.writeFileSync(CODE_DATA_FILE_PATH, exampleData);
    }

    try {
        fs.accessSync(TAGS_FILE_PATH, fs.constants.F_OK)
    } catch (error) {
        fs.writeFileSync(TAGS_FILE_PATH, "[]");
    }

    const codeData: string = fs.readFileSync(CODE_DATA_FILE_PATH, 'utf-8');
    const tags: string = fs.readFileSync(TAGS_FILE_PATH, 'utf-8');

    const tagSet: Set<string> = new Set(JSON.parse(tags));
    const codes: CodeItem[] = JSON.parse(codeData);
    codes.forEach(item => tagSet.add(item.tag))

    data["tags"] = tagSet;
    data["codes"] = codes;

    event.reply('read-data-response', { data });
    flushData(DataType.TAG, JSON.stringify([...tagSet]))
}


// 读取/初始化settings
export const readCodeSettings = (event: IpcMainEvent) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }

    fs.access(SETTINGS_FILE_PATH, fs.constants.F_OK, (err) => {
        if (err) {
            const exampleSettings: string = createExampleSettings();
            fs.writeFile(SETTINGS_FILE_PATH, exampleSettings, () => {
                event.reply('read-settings-response', { data: exampleSettings });
            });
        } else {
            fs.readFile(SETTINGS_FILE_PATH, 'utf-8', (_, data) => {
                event.reply('read-settings-response', { data });
            });
        }
        console.log("read settings file");
    });
}



// flush Data
export const flushData = (dataType: DataType, data: string) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }
    let path = "";
    switch (dataType) {
        case DataType.CODE:
            path = CODE_DATA_FILE_PATH;
            break;
        case DataType.TAG:
            path = TAGS_FILE_PATH;
            break;
        case DataType.SETTINGS:
            path = SETTINGS_FILE_PATH
            break;
        default:
            console.log("Data Not Supported");
            break;
    }
    fs.writeFileSync(path, data);
    console.log("flush code file");
}