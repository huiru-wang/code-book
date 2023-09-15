export interface CodeItem {
    itemId: number,
    itemKey: string,
    itemValue: string,
    description?: string | undefined,
    tag: string
}

export interface ItemTag {
    tag: string,
    selected: boolean
}

export enum DataType {
    CODE = "CODE",
    TAG = "TAG",
    SETTINGS = "SETTING"
}

export enum CopyTarget {
    KEY, VALUE
}