export interface Snippet
{
    title: string;
    text: string;
}

export interface Variable
{
    name: string;
    textToReplace: string;
    indexes: number[];
}

export interface Variables
{
    [name: string]: Variable;
}

export interface Clip
{
    snippet: Snippet;
    variables: Variables;
}