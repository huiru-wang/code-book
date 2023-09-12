import path from 'node:path'
import fs from 'fs';
import os from 'os';
import { IpcMainEvent } from 'electron'

interface CodeItem {
    itemId: number;
    itemKey: string;
    itemValue: string;
    description: string | undefined;
    frequency: number;
    tag: string;
}

// 样例数据
export const createExampleTags = (): string => {
    const tags: string[] = ["example", "Hello World"];
    return JSON.stringify(tags);
}

export const createExampleData = (): string => {
    const example: CodeItem[] = [
        {
            itemId: 1,
            itemKey: "Using double-click to copy the key or value",
            itemValue: "This is your example code",
            description: "This is an example",
            frequency: 0,
            tag: "example"
        },
        {
            itemId: 2,
            itemKey: "Hello Code Book👋",
            itemValue: "Hello World",
            description: "This is an example",
            frequency: 0,
            tag: "Hello World"
        }
    ];
    return JSON.stringify(example);
}

const createExampleSettings = (): string => {
    const example = {
        "showMode": true,
        "singleMode": true
    };
    return JSON.stringify(example);
}

const BASE_CODE_FOLDER_PATH = path.join(os.homedir(), '.codebook');
const CODE_DATA_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "code.json");
const CODE_TAGS_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "tags.json");
const SETTINGS_FILE_PATH = path.join(BASE_CODE_FOLDER_PATH, "settings.json");

// 读取/初始化数据文件
export const readCodeData = (event: IpcMainEvent) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }

    fs.access(CODE_DATA_FILE_PATH, fs.constants.F_OK, (err) => {
        if (err) {
            // file not exist
            const exampleData: string = createExampleData();
            fs.writeFile(CODE_DATA_FILE_PATH, exampleData, () => {
                event.reply('read-data-response', { data: exampleData });
            });
        } else {
            // read
            fs.readFile(CODE_DATA_FILE_PATH, 'utf-8', (_, data) => {
                event.reply('read-data-response', { data });
            });
        }
        console.log("read code file");
    });
}

// 读取/初始化Tag文件
export const readCodeTags = (event: IpcMainEvent) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }

    fs.access(CODE_TAGS_FILE_PATH, fs.constants.F_OK, (err) => {
        if (err) {
            const exampleTags: string = createExampleTags();
            fs.writeFile(CODE_TAGS_FILE_PATH, exampleTags, () => {
                event.reply('read-tags-response', { data: exampleTags });
            });
        } else {
            fs.readFile(CODE_TAGS_FILE_PATH, 'utf-8', (_, data) => {
                event.reply('read-tags-response', { data });
            });
        }
        console.log("read tags file");
    });
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
export const flushData = (event: IpcMainEvent, codeData: string) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }
    fs.writeFile(CODE_DATA_FILE_PATH, codeData, () => {
        event.reply('write-data-response', { done: true });
    });
    console.log("flush code file");
}

// flush Tags
export const flushTags = (event: IpcMainEvent, tags: string) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }
    fs.writeFile(CODE_TAGS_FILE_PATH, tags, () => {
        event.reply('write-tags-response', { done: true });
    });
    console.log("flush tags file");
}

// flush Config
export const flushConfig = (event: IpcMainEvent, settings: string) => {
    if (!fs.existsSync(BASE_CODE_FOLDER_PATH)) {
        fs.mkdirSync(BASE_CODE_FOLDER_PATH);
    }
    fs.writeFile(SETTINGS_FILE_PATH, settings, () => {
        event.reply('write-settings-response', { done: true });
    });
    console.log("flush settings file");
}