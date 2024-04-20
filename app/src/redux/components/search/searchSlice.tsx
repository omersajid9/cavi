import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getInitiateIndex } from "../../../helpers/search";
import Document from "flexsearch/dist/module/document";

export const initiateIndex = createAsyncThunk(
 'Document',
 async () => {
     const value = getInitiateIndex();
     const e = await value;
    return e;
 }
);


const initialSearch: Document = getInitiateIndex();

const searchSlice = createSlice(
    {
        name: "db",
        initialState:
        {
            search: initialSearch
        },
        reducers:
        {
            
        },
        extraReducers: (builder) => {
            builder
              .addCase(initiateIndex.pending, (state) => {
              })
                .addCase(initiateIndex.fulfilled, (state, action) => {
                    const fetchedData = action.payload;
                    if (typeof fetchedData === 'object' && fetchedData !== null) {
                        // Access the keys and values
                        state.search = action.payload;
                      } else {
                        console.log('COMPARE Payload is not an object:', fetchedData);
                      }
                  
                // Assuming the payload is the new search value
              })
                .addCase(initiateIndex.rejected, (state, action) => {
              });
         },
    }
)

export const
{
    
} = searchSlice.actions;

export default searchSlice.reducer;
