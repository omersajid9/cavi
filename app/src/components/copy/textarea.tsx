import React from "react";
import { RootState } from "../../redux/store/store";
import { ConnectedProps, connect } from "react-redux";
import { setCopyCurrentHighlight } from "../../redux/components/copy/copySlice";
import { generateHighlightHtml, highlightAll } from "../../helpers/copy";



const mapStateToProps = (state: RootState) => ({
    copy: state.copy
})

const mapDispatch = { setCopyCurrentHighlight };
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>


interface Props extends PropsFromRedux
{

}

interface State
{
    backdropHtml: string;
}


class Textarea extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            backdropHtml: "BOO"
        }

        this.handleMouseUpTextarea = this.handleMouseUpTextarea.bind(this);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State)
    {
        console.log("Props update", nextProps.copy)
        if (nextProps.copy.variables.length)
        {
            console.log("VARIABLESS", nextProps.copy.variables)
        }
        if (nextProps.copy.currentVariable.indexes.length)
        {
            return {backdropHtml: generateHighlightHtml()};
        }
        else
        {
            return {backdropHtml: nextProps.copy.snippet.text.replace(/(<|>)/g, '~')};
        }
    }

    handleMouseUpTextarea()
    {
        // Get textarea element
        const textarea: HTMLTextAreaElement = document.getElementById('copyTextArea') as HTMLTextAreaElement;
        // Get selection in the textarea
        let [selectionStart, selectionEnd] = [textarea?.selectionStart, textarea?.selectionEnd];
        [selectionStart, selectionEnd] = selectionEnd < selectionStart ? [selectionEnd, selectionStart] : [selectionStart, selectionEnd];
        
        // TODO: make this a function in helper/copy file
        // Handle logic before setting highlight
        // TODO: handle overlap highlight validation
        
        if (selectionStart != null &&  selectionEnd != null)
        {
            const highlight = [selectionStart, selectionEnd];
            console.log("[selectionStart, selectionEnd]", highlight);
            this.props.setCopyCurrentHighlight(highlight);
        }
        highlightAll();
    }


    render()
    {
        return (
            <div className="container">
                <div className="backdrop">
                    <div className="highlights">
                        <div dangerouslySetInnerHTML={{__html: this.state.backdropHtml}}></div>
                    </div>
                </div>
                <textarea id="copyTextArea" value={this.props.copy.snippet.text} onMouseUp={this.handleMouseUpTextarea} readOnly/>
            </div>
        )
    }
}

export default connector(Textarea);