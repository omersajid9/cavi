import { Clip, Snippet, Variable, Variables } from "../constants/interfaces/copy/copy";
import { pushCopyCurrentVariableIndex, clearCopyCurrentHighlight, clearCopyCurrentVariable, clearCopyCurrentVariableIndex, pushCopyVariable, setCopyCurrentVariableTextToReplace } from "../redux/components/copy/copySlice";
import { store, RootState } from "../redux/store/store";

const findAllMatches = (text: string, regex: RegExp) : number[] =>
{
    return Array.from(text.matchAll(regex), (match) => match.index) as number[];
}

export const highlightAll = () =>
{
    const state: RootState  = store.getState();
    const text: string = state.copy.snippet.text;
    const highlight: number[] = state.copy.currentHighlight;
    const textToReplace: string = text.substring(highlight[0], highlight[1]);

    if (highlight[0] == highlight[1])
    {
        // console.log("Sorry, no range in highlight");
        return;
    }
    else if (!textToReplace)
    {
        // console.log("Sorry, nothing to highlight");
        store.dispatch(clearCopyCurrentVariableIndex());
        return;
    }
    store.dispatch(clearCopyCurrentVariableIndex());


    const regex: RegExp = new RegExp(""+textToReplace+"", "g");
    const matches: number[] = findAllMatches(text, regex);
    matches.forEach((index: number) => 
    {
        store.dispatch(pushCopyCurrentVariableIndex(index));
    })
    store.dispatch(setCopyCurrentVariableTextToReplace(textToReplace));
}

export const generateHighlightHtml = () : string =>
{
    const state: RootState  = store.getState();
    let origText: string = state.copy.snippet.text.replace(/[<>]/g, '~');
    const curVar: Variable = state.copy.currentVariable;
    let indexes: number[] = [...curVar.indexes];

    indexes = indexes.length > 1 ? indexes.sort((a, b) => b - a): indexes;
    indexes.forEach((index) =>
    {
        origText = origText.substring(0, index) + "<mark style='background-color:"+"blue"+";'>" + curVar.textToReplace + "</mark>" + origText.substring(index + curVar.textToReplace.length);
    })

    return origText;
}

export const createVariable = () =>
{
    store.dispatch(pushCopyVariable());
    clearCopyCurrentVariable();
    clearCopyCurrentHighlight();
}

const makeClip = () =>
{
    const state: RootState  = store.getState();
    const snippet: Snippet = state.copy.snippet;
    const variables: Variables = state.copy.variables;
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