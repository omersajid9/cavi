import React, { ChangeEvent, Ref, useRef } from "react";
import { ConnectedProps, connect } from "react-redux";
import { UNDO, REDO, CLEAR, GROUPBEGIN, GROUPEND } from "easy-redux-undo";
import { RootState } from "../../redux/store/store";
import { setCopyCurrentHighlight, setCopyCurrentVariableName, clearCopyCurrentVariableIndex } from "../../redux/components/copy/copySlice";
import { checkValidHighlight, createVariable, generateHighlightHtml, highlightAll } from "../../helpers/copy";
import _ from "lodash";
import { FaEdit, FaRedoAlt, FaUndoAlt } from "react-icons/fa";


const mapStateToProps = (state: RootState) => ({
    copy: state.copy.present.copy,
    past: state.copy.past,
    present: state.copy.present,
    future: state.copy.future
})

const mapDispatch = { setCopyCurrentHighlight, setCopyCurrentVariableName, clearCopyCurrentVariableIndex, UNDO, REDO, GROUPBEGIN, GROUPEND };
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>


interface Props extends PropsFromRedux
{
    onTextChange: (event: ChangeEvent<HTMLTextAreaElement>)=>void
}

interface State
{
    backdropHtml: string;
    scrollPositionY: number;
    scrollPositionX: number;
    scrollRef: React.RefObject<HTMLDivElement>;
    colorNames: string[];
    textarea: string;
    edit: boolean;
}


class Textarea extends React.Component<Props, State>
{
    // scrollRef: React.RefObject<HTMLDivElement>;
    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            backdropHtml: "BOO",
            textarea: props.copy.snippet.text,
            scrollPositionY: 0,
            scrollPositionX: 0,
            scrollRef: React.createRef(),
            colorNames: ['grey', 'pink', 'blue', 'green', 'yellow'],
            edit: false

        }
        console.log("INIT", props.copy.snippet.text)

        this.handleMouseUpTextarea = this.handleMouseUpTextarea.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.UNDO = this.UNDO.bind(this);
        this.GROUPBEGIN = this.GROUPBEGIN.bind(this);
        this.GROUPEND = this.GROUPEND.bind(this);
        this.REDO = this.REDO.bind(this);

        this.handleChangeTextarea = this.handleChangeTextarea.bind(this);

        this.edit = this.edit.bind(this);


    }

    edit()
    {
        var elem = document.getElementById('copyTextArea') as HTMLTextAreaElement
        var icon = document.querySelector("svg.copy-edit") as SVGAElement;
        if (this.state.edit)
        {
            icon.setAttribute('fill', 'grey');
            this.GROUPEND()
            this.setState({ edit: false });
            elem.readOnly = true; 
        }
        else
        {
            icon.setAttribute('fill', 'blue');
            this.GROUPBEGIN()
            this.setState({ edit: true });
            elem.readOnly = false
        }
    }

    REDO(event: any)
    {
        event.preventDefault();
        this.props.REDO();
    }

    GROUPBEGIN()
    {
        this.props.GROUPBEGIN();
    }

    GROUPEND()
    {
        this.props.GROUPEND();
    }

    UNDO(event: any)
    {
        event.preventDefault();
        this.props.UNDO();
    }

    

    static getDerivedStateFromProps(nextProps: Props, prevState: State)
    {
        if (nextProps.copy.currentVariable.indexes.length || Object.keys(nextProps.copy.variables).length)
        {
            return {backdropHtml: generateHighlightHtml(), textarea: nextProps.copy.snippet.text};
        }
        else
        {
            return {backdropHtml: nextProps.copy.snippet.text.replace(/(<|>)/g, '~'), textarea: nextProps.copy.snippet.text};
        }
    }

    handleChangeTextarea(event: ChangeEvent<HTMLTextAreaElement>)
    {
        this.props.clearCopyCurrentVariableIndex();
        this.setState({ textarea: event.target.value });
        this.props.onTextChange(event);
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
        ;
        if (selectionStart != null &&  selectionEnd != null && checkValidHighlight(selectionStart, selectionEnd))
        {
            this.GROUPBEGIN();
            let len = Object.keys(this.props.copy.variables).length;
            this.props.setCopyCurrentVariableName(this.state.colorNames[len]);    
            const highlight = [selectionStart, selectionEnd];
            this.props.setCopyCurrentHighlight(highlight);
            highlightAll();
            createVariable();
            this.GROUPEND();
            var sel = document.getSelection();
            if (sel)
            {
                sel.removeAllRanges();
            }
        }
    }

    handleScroll(e: any) 
    {

        this.setState((_state) => ({scrollPositionY: e.target.scrollTop, scrollPositionX: e.target.scrollLeft, backdropHtml: _state.backdropHtml, scrollRef: _state.scrollRef}))
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        requestAnimationFrame(() =>
        {
            if (this.state.scrollRef?.current)
            {

                this.state.scrollRef?.current.scrollTo({top: this.state.scrollPositionY, left: this.state.scrollPositionX, behavior: 'instant'})    
            }
        })
    }

    render()
    {
        return (
            <>
                <div style={{display: "flex", justifyContent: "space-around", margin: "14px 0px", width: "100%"}}>
                <FaUndoAlt className="copy-undo" style={{width: "30vw"}} onClick={(event)=>this.UNDO(event)}/>
                    <FaEdit className="copy-edit" style={{ width: "30vw", fill: this.state.edit ? "blue !important": "grey !important" }} onClick={this.edit}/>
                    <FaRedoAlt className="copy-redo" style={{ width: "30vw" }} onClick={(event) => this.REDO(event)} />
                </div>

            <div className="container" >
                <div className="container-copy">
                    <div className="backdrop"  ref={this.state.scrollRef}>
                        <div className="highlights" >
                            <div dangerouslySetInnerHTML={{__html: this.state.backdropHtml}} ></div>
                        </div>
                    </div>
                    <textarea id="copyTextArea" readOnly value={this.state.textarea} onChange={this.handleChangeTextarea} onMouseUp={this.handleMouseUpTextarea} onScroll={this.handleScroll}/>
                </div>

                </div>

            </>
        )
    }
}

export default connector(Textarea);