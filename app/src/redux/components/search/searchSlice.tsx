import { createSlice } from "@reduxjs/toolkit";
import { initiateIndex } from "../../../helpers/search";
import Document from "flexsearch/dist/module/document";

const initialSearch: Document = initiateIndex();

const searchSlice = createSlice(
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
} = searchSlice.actions;

export default searchSlice.reducer;
