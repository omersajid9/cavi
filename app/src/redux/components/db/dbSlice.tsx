import { createSlice, current } from "@reduxjs/toolkit";
import { Clip } from "../../../constants/interfaces/copy/copy";
import { IndexedDocument, importSearch, initiateIndex } from "../../../helpers/search";
import Document from "flexsearch/dist/module/document";

const initialSearch: Document = initiateIndex();

const dbSlice = createSlice(
    {
        name: "db",
        initialState:
        {
            search: initialSearch
        },
        reducers:
        {
        }
    }
)

export const
{
} = dbSlice.actions;

export default dbSlice.reducer;
