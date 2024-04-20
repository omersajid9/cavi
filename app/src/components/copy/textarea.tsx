import React, { Ref, useRef } from "react";
import { ConnectedProps, connect } from "react-redux";
import { UNDO, REDO, CLEAR, GROUPBEGIN, GROUPEND } from "easy-redux-undo";
import { RootState } from "../../redux/store/store";
import { setCopyCurrentHighlight, setCopyCurrentVariableName } from "../../redux/components/copy/copySlice";
import { checkValidHighlight, createVariable, generateHighlightHtml, highlightAll } from "../../helpers/copy";
import _ from "lodash";
import { FaRedoAlt, FaUndoAlt } from "react-icons/fa";


const mapStateToProps = (state: RootState) => ({
    copy: state.copy.present.copy,
    past: state.copy.past,
    present: state.copy.present,
    future: state.copy.future
})

const mapDispatch = { setCopyCurrentHighlight, setCopyCurrentVariableName, UNDO, REDO, GROUPBEGIN, GROUPEND };
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>


interface Props extends PropsFromRedux
{

}

interface State
{
    backdropHtml: string;
    scrollPositionY: number;
    scrollPositionX: number;
    scrollRef: React.RefObject<HTMLDivElement>;
    colorNames: string[];
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
            scrollPositionY: 0,
            scrollPositionX: 0,
            scrollRef: React.createRef(),
            colorNames: ['grey', 'pink', 'blue', 'green', 'yellow']

        }

        this.handleMouseUpTextarea = this.handleMouseUpTextarea.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
        this.UNDO = this.UNDO.bind(this);
        this.GROUPBEGIN = this.GROUPBEGIN.bind(this);
        this.GROUPEND = this.GROUPEND.bind(this);
        this.REDO = this.REDO.bind(this);
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
        console.log(nextProps)
        if (nextProps.copy.currentVariable.indexes.length || Object.keys(nextProps.copy.variables).length)
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
            if (prevState.scrollRef?.current)
            {
                console.log("SCORLL HEIGHT", prevState.scrollRef.current.scrollHeight);
                console.log("Client HEIGHT", prevState.scrollRef.current.clientHeight);
                console.log("OFFSET HEIGHT", prevState.scrollRef.current.offsetHeight);
                console.log("REFF POSS", prevState.scrollPositionY);

                // if (prevState.scrollRef.current.scrollHeight - prevState.scrollRef.current.clientHeight > prevState.scrollPositionY)
                // {
                    prevState.scrollRef?.current.scrollTo({top: prevState.scrollPositionY, left: prevState.scrollPositionX, behavior: 'instant'})    
                // }
                // else
                // {
                //     // var po = (Math.abs(prevState.scrollRef.current.scrollHeight +(- prevState.scrollRef.current.clientHeight + prevState.scrollRef.current.offsetHeight)*2 - prevState.scrollPositionY))
                //     // console.log("ELSING", po)
                //     prevState.scrollRef?.current.scrollTo({top: 10000, behavior: 'instant'})    
                // }
                // if (prevState.scrollPositionY udocment.getElementById("").innerHeight)
            }
        })
    }

    render()
    {
        return (
            <div className="container" >
                <div style={{display: "flex", justifyContent: "space-around"}}>
                <FaUndoAlt style={{color: "red"}} onClick={(event)=>this.UNDO(event)}/>
                <FaRedoAlt style={{color: "green"}} onClick={(event)=>this.REDO(event)}/>
                </div>
                <div className="container-copy">
                    <div className="backdrop"  ref={this.state.scrollRef}>
                        <div className="highlights" >
                            <div dangerouslySetInnerHTML={{__html: this.state.backdropHtml}} ></div>
                        </div>
                    </div>
                    <textarea id="copyTextArea"  value={this.props.copy.snippet.text} onMouseUp={this.handleMouseUpTextarea} onScroll={this.handleScroll} readOnly/>

                </div>
            </div>
        )
    }
}

export default connector(Textarea);