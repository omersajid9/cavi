// import * as fs from 'graceful-fs';
import Document from "flexsearch/dist/module/document";

export interface IndexedDocument 
{
    id: number,
    title: string,
    text: string
}

export const getInitiateIndex = async () =>
{
    return await initiateIndex();
}

export const initiateIndex = async () =>
{
    let index: Document = new Document<IndexedDocument, true>({
      document: {
        id: 'id',
        index: ['title','text'],
        store: true
        // store: 'variables'
      },
      tokenize: 'full'
    });

    window.api.search('*')
        .then((results: any[]) => {
            // use results
            results.forEach((result: any) =>
            {
                let newObject = {id: result._id, title: result.snippet.title, text: result.snippet.text, variables: result.variables};
                index.append(newObject);
            })
        });
    console.log("INITIATE SEARCH INDEX PRINT HERE", index);
    return index;
}
  
  