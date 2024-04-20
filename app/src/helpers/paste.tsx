import { values } from "lodash";
import { Variable, Variables } from "../constants/interfaces/copy/copy";
import { Show } from "../pages/paste/paste";
import { HighlightProp } from "./copy";

export const generateHighlightHtml = (_show: Show) : string =>
{
    let show: Show = _show;
    let origText: string = show.text.replace(/[<>]/g, '~');

    let highlightMap: HighlightProp[] = [];
    let variables: Variable[] = values(show.variables);
    variables.forEach((vari) =>
    {
        vari.indexes.forEach((index) =>
        {
            highlightMap.push({ name: vari.textToReplace, index: index, color: vari.name });
        })
    })

    highlightMap = highlightMap.length > 1 ? highlightMap.sort((a, b) => b['index'] - a['index']): highlightMap;
    highlightMap.forEach((m) =>
    {
        origText = origText.substring(0, m['index']) + '<span class="color-'+m['color']+'">' + m['name'] + "</span>" + origText.substring(m['index'] + m['name'].length);
    })
    return origText;

}

export const generateHighlightMap = (_show: Show): HighlightProp[] =>
{
    let show: Show = _show;
    let origText: string = show.text.replace(/[<>]/g, '~');

    let highlightMap: HighlightProp[] = [];
    let variables: Variable[] = values(show.variables);
    variables.forEach((vari) =>
    {
        vari.indexes.forEach((index) =>
        {
            highlightMap.push({ name: vari.textToReplace, index: index, color: vari.name });
        })
    })

    highlightMap = highlightMap.length > 1 ? highlightMap.sort((a, b) => a['index'] - b['index']): highlightMap;
    return highlightMap;
}