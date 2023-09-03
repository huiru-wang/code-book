interface CodeItem {
    itemId: number;
    itemKey: string;
    itemValue: string;
    description: string | undefined;
    frequency: number;
    tags: string[];
}

export const createExampleData = (): string => {
    const example: CodeItem[] = [
        {
            itemId: 1,
            itemKey: "Using double-click to copy the key or value",
            itemValue: "This is your example code",
            description: "This is an example",
            frequency: 0,
            tags: ["example"]
        },
        {
            itemId: 2,
            itemKey: "Hello Code Book👋",
            itemValue: "Hello World",
            description: "This is an example",
            frequency: 0,
            tags: ["Hello World"]
        }
    ];
    return JSON.stringify(example);
}