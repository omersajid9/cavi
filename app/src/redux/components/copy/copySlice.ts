import { createSlice } from "@reduxjs/toolkit";
import { Snippet, Variable, Variables } from "../../../constants/interfaces/copy/copy";

const initialSnippet : Snippet = {title: "", text: ""};
const initialVariables : Variables = {};
const initialCurrentVariable: Variable = 
{
    name: "",
    textToReplace: "",
    indexes: []
};
const initialCurrentHighlight: number[] = [0, 0];


const copySlice = createSlice(
    {
        name: "copy",
        initialState:
        {
            snippet: initialSnippet,
            variables: initialVariables,
            currentHighlight: initialCurrentHighlight,
            currentVariable: initialCurrentVariable
        },
        
        reducers:
        {
            // copy_snippet
            setCopySnippetTitle(state, action)
            {
                state.snippet.title = action.payload;
            },
            setCopySnippetText(state, action)
            {
                state.snippet.text = action.payload;
            },
            clearCopySnippet(state)
            {
                state.snippet = initialSnippet;
            },

            // // copy_current_variable
            setCopyCurrentVariableName(state, action)
            {
                state.currentVariable.name = action.payload;
            },
            setCopyCurrentVariableTextToReplace(state, action)
            {
                state.currentVariable.textToReplace = action.payload;
            },
            pushCopyCurrentVariableIndex(state, action)
            {
                state.currentVariable.indexes.push(action.payload);
            },
            clearCopyCurrentVariableIndex(state)
            {
                state.currentVariable.indexes = [];
            },
            clearCopyCurrentVariable(state)
            {
                state.currentVariable = initialCurrentVariable;
            },

            // copy_current_highlight
            setCopyCurrentHighlight(state, action)
            {
                state.currentHighlight = action.payload;
            },
            clearCopyCurrentHighlight(state)
            {
                state.currentHighlight = initialCurrentHighlight;
            },

            // copy_current_variables
            pushCopyVariable(state)
            {
                if (!state.variables[state.currentVariable.name])
                {
                    state.variables[state.currentVariable.name] = state.currentVariable;
                }
            }

        }
    }
)

export const 
{ 
    setCopySnippetTitle, 
    setCopySnippetText, 
    clearCopySnippet,
    setCopyCurrentHighlight, 
    clearCopyCurrentHighlight, 
    setCopyCurrentVariableName, 
    setCopyCurrentVariableTextToReplace, 
    pushCopyCurrentVariableIndex,
    clearCopyCurrentVariableIndex,
    clearCopyCurrentVariable,
    pushCopyVariable
} = copySlice.actions;

export default copySlice.reducer;