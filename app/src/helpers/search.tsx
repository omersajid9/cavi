// import * as fs from 'graceful-fs';
import Document from "flexsearch/dist/module/document";
import { readConfigRequest, writeConfigRequest, readConfigResponse, writeConfigResponse } from 'secure-electron-store';
import { RootState, store } from "../redux/store/store";
import { Key } from "react";
import { importDbSearch } from "../redux/components/db/dbSlice";

export interface IndexedDocument 
{
    id: number,
    title: string,
    text: string
}

export const initiateIndex = () =>
{
    let index: Document = new Document<IndexedDocument, true>({
      document: {
        id: 'id',
        index: ['title','text'],
      },
      tokenize: 'forward'
    });
    return index;
}


export const exportSearchToLocal = () =>
{
    const state: RootState = store.getState();
    const search: Document = state.db.search;
    let save: any = {};
    try
    {
        search.export(
            (key: Key, data: any) => 
            {
                if (data)
                {
                    save[key] = JSON.parse(JSON.stringify(data));
                }
            }
            ).then(() =>
            {
                window.api.store.send(writeConfigRequest, "search", save);
            })
    }
    catch (error)
    {
        console.log("CONSOLE SEARCH ", error);
    }
}

export const importSearchFromLocal = () =>
{
    console.log("RETRIEVEING DOCUMENT")
    window.api.store.clearRendererBindings();
    window.api.store.onReceive(readConfigResponse, function (args: any)
    {
        let index: Document = initiateIndex();
        if (args.success && args.value)
        {
            const temp = {...args.value};
            const keys = Object.keys(temp);
            keys.forEach((key) =>
            {
                index.import(key, temp[key]);
            })
        }
        store.dispatch(importDbSearch(index));
    })
    window.api.store.send(readConfigRequest, "search");
}

// export const searchClip = (query: string) =>
// {
//     const state: RootState = store.getState();
//     console.log(state.search.index.search("l"))
//     return state.search.index;
// }


  
  