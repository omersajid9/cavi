import { clone } from "lodash";
import { Clip, Snippet, Variable, Variables } from "../constants/interfaces/copy/copy";
import { pushCopyCurrentVariableIndex, clearCopyCurrentHighlight, clearCopyCurrentVariable, clearCopyCurrentVariableIndex, pushCopyVariable, setCopyCurrentVariableTextToReplace, removeCopyVariableIndex } from "../redux/components/copy/copySlice";
import { store, RootState } from "../redux/store/store";
import * as _ from 'lodash'

const findAllMatches = (text: string, regex: RegExp) : number[] =>
{
    return Array.from(text.matchAll(regex), (match) => match.index) as number[];
}

export const highlightAll = () =>
{
    const state: RootState  = store.getState();
    const text: string = state.copy.present.copy.snippet.text;
    const highlight: number[] = state.copy.present.copy.currentHighlight;
    const textToReplace: string = text.substring(highlight[0], highlight[1]);

    if (highlight[0] == highlight[1])
    {
        return;
    }
    else if (!textToReplace)
    {
        store.dispatch(clearCopyCurrentVariableIndex());
        return;
    }
    store.dispatch(clearCopyCurrentVariableIndex());


    const regex: RegExp = new RegExp(""+_.escapeRegExp(textToReplace)+"", "g");
    const matches: number[] = findAllMatches(text, regex);

    var indexes: number[] = [];

    if (state.copy.present.copy.variables)
    {
        Object.keys(state.copy.present.copy.variables).forEach((var_name) =>
        {
            let variable: Variable = state.copy.present.copy.variables[var_name];
            variable.indexes.forEach((index) =>
            {
                indexes.push(index);
            })
        })     
    }
    
        
    matches.forEach((index: number) => 
    {
        console.log(indexes, index, !indexes.length, indexes.indexOf(index))
        if (indexes.length == 0 || indexes.indexOf(index) < 0) {
            store.dispatch(pushCopyCurrentVariableIndex(index));
        }
        else
        {
            console.log("PROBLEM HAPPENING")
        }
    })
    store.dispatch(setCopyCurrentVariableTextToReplace(textToReplace));
}

export interface HighlightProp
{
    name: string;
    index: number;
    color: string;
}

export const generateHighlightHtml = () : string =>
{
    const state: RootState  = store.getState();
    let origText: string = state.copy.present.copy.snippet.text.replace(/[<>]/g, '~');
    const curVar: Variable = state.copy.present.copy.currentVariable;
    let indexes: number[] = [...curVar.indexes];

    let highlightMap: HighlightProp[] = [];

    // indexes.forEach((index) =>
    // {
    //     highlightMap.push({ name: curVar.textToReplace, index: index, color: 'grey'});
    // })

    let variables: Variables = state.copy.present.copy.variables;
    Object.keys(variables).forEach((var_name) =>
    {
        let variable: Variable = variables[var_name];
        variable.indexes.forEach((index) =>
        {
            highlightMap.push({ name: variable.textToReplace, index: index, color: variable.name });
        })
    })

    highlightMap = highlightMap.length > 1 ? highlightMap.sort((a, b) => b['index'] - a['index']): highlightMap;
    highlightMap.forEach((m) =>
    {
        origText = origText.substring(0, m['index']) + '<mark class="color-'+m['color']+'">' + m['name'] + "</mark>" + origText.substring(m['index'] + m['name'].length);
    })
    return origText;
}

interface highlightToRemove
{
    var_name: string;
    indexes: number[];
}

export const checkValidHighlight = (selectionStart: number, selectionEnd: number) =>
{
    const state: RootState = store.getState();
    const variables: Variables = {...state.copy.present.copy.variables};

    if (!(state.copy.present.copy.currentHighlight[0] == selectionStart && state.copy.present.copy.currentHighlight[1] == selectionEnd) && selectionStart != selectionEnd) 
    {
        var toRemove: highlightToRemove[] = [];
        Object.keys(variables).forEach((variable_name) =>
        {
            var temp: highlightToRemove = { var_name: variable_name, indexes: [] };

            variables[variable_name].indexes.forEach((index) =>
            {
                const range = [index, index + variables[variable_name].textToReplace.length];
                if (!(selectionStart > range[1] || selectionEnd < range[0]) || selectionStart == range[0])
                {
                    temp.indexes.push(index);
                }
            })
            if (temp.indexes.length > 0)
            {
                toRemove.push(temp);
            }
        })
        
        const varry = clone(variables);
        if (toRemove.length > 0)
        {
            toRemove.forEach((rem) =>
            {
                rem['indexes'].forEach((ind) =>
                {
                    store.dispatch(removeCopyVariableIndex({'var_name': rem['var_name'], 'ind': ind}))
                    // varry[rem['var_name']].indexes = varry[rem['var_name']].indexes.filter(item => item != ind);
                })
            })
            return false;
        }
        else
        {
            return true;
        }
        // store.dispatch(setCopyVariable(varry));
    }
    else
    {
        return false;
        }
}

// const checkValidHighlight = (selectionStart: number, selectionEnd: number) =>
// {
//   if (variableData.length > 0)
//   {
//     var toRemove: VariableData[] = [];
//     for (let i = 0; i < variableData.length; i++)
//     {
//       const varData = variableData[i];
//       const range = [varData.index, varData.text.length + varData.index];
//       if (!(selectionStart > range[1] || selectionEnd < range[0]))
//       {
//         toRemove.push(varData);
//         console.log("CANCELLING", varData)
//       }
//       else
//       {
//         console.log("NOT CANCELLING", varData)
//       }

//     }

//     var filteredArray = variableData;
//     toRemove.forEach((val) =>
//     {
//       filteredArray = filteredArray.filter(item => item.index != val.index);
//     })
//     if (toRemove)
//     {
//       setVariableData(filteredArray)
//     }
//   }
// }


export const createVariable = () =>
{
    store.dispatch(pushCopyVariable());
    clearCopyCurrentVariable();
    clearCopyCurrentHighlight();
}

const makeClip = () =>
{
    const state: RootState  = store.getState();
    const snippet: Snippet = state.copy.present.copy.snippet;
    const variables: Variables = state.copy.present.copy.variables;
    const clip: Clip = 
    {
        snippet: snippet,
        variables: variables,
    };
    return clip;
}

export const pushClip = async () =>
{    
    const clip: Clip = makeClip();
    try
    {
        const z = await window.api.pushClipToDB({clip: clip});
    }
    catch(error)
    {
        console.log("Error in onsearch");
    }
}