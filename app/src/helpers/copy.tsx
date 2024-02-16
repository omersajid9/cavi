import { Clip, Snippet, Variable, Variables } from "../constants/interfaces/copy/copy";
import { pushCopyCurrentVariableIndex, clearCopyCurrentHighlight, clearCopyCurrentVariable, clearCopyCurrentVariableIndex, pushCopyVariable, setCopyCurrentVariableTextToReplace } from "../redux/components/copy/copySlice";
import { pushDbClipboard, pushDbSearch } from "../redux/components/db/dbSlice";
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
        console.log("Sorry, no range in highlight");
        return;
    }
    else if (!textToReplace)
    {
        console.log("Sorry, nothing to highlight");
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
    const date: Date = new Date(500000000000);
    let index: number = state.db.clipCount + 1;
    const clip: Clip = 
    {
        id: index,
        snippet: snippet,
        variables: variables,
        created_at: date
    };
    return clip;
}

export const pushClip = () =>
{    
    const clip: Clip = makeClip();
    store.dispatch(pushDbClipboard(clip));
    store.dispatch(pushDbSearch(clip));

}