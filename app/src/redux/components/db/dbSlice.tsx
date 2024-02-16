import { createSlice, current } from "@reduxjs/toolkit";
import { Clip } from "../../../constants/interfaces/copy/copy";
import { IndexedDocument, initiateIndex } from "../../../helpers/search";

const initialClipboard: Clip[] = window.api.store.initial()['clipboard'] != undefined ?
    window.api.store.initial()['clipboard'] : [];

const initialClipcount: number = window.api.store.initial()['clipCount'] != undefined ?
    window.api.store.initial()['clipCount'] : 0;

const initialSearch: Document = window.api.store.initial()['search'] != undefined ?
    window.api.store.initial()['search'] : initiateIndex();

    console.log("HEHEHEHEHHEHE", window.api.store.initial()['clipboard'], initialClipboard);
    console.log("HEHEHEHEHHEHE", window.api.store.initial()['clipCount'], typeof window.api.store.initial()['clipCount'], initialClipcount);


const dbSlice = createSlice(
    {
        name: "db",
        initialState:
        {
            clipboard: initialClipboard,
            clipCount: initialClipcount,
            search: initialSearch
        },
        reducers:
        {
            pushDbClipboard(state, action)
            {
                // console.log(current(state.clipboard))
                state.clipboard = [...state.clipboard, action.payload];
                state.clipCount += 1;
            },
            importDbClipboard(state, action)
            {
                state.clipboard = action.payload;
            },
            importDbClipCount(state, action)
            {
                state.clipCount = action.payload;
            },

            pushDbSearch(state, action)
            {
                const temp: IndexedDocument = 
                {
                    id: action.payload.id,
                    title: action.payload.snippet.title,
                    text: action.payload.snippet.text
                };
                // const s = current(state.search).clone();
                state.search.append(temp);
            },
            importDbSearch(state, action)
            {
                state.search = action.payload;
            } 
        }
    }
)

export const
{
    pushDbClipboard,
    importDbClipboard,
    importDbClipCount,
    pushDbSearch,
    importDbSearch
} = dbSlice.actions;

export default dbSlice.reducer;









