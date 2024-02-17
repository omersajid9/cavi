import React, { Ref, useRef } from "react";
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
    scrollPosition: number;
    scrollRef: React.RefObject<HTMLDivElement>;
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
            scrollPosition: 0,
            scrollRef: React.createRef()

        }

        this.handleMouseUpTextarea = this.handleMouseUpTextarea.bind(this);
        this.handleScroll = this.handleScroll.bind(this);
    }

    static getDerivedStateFromProps(nextProps: Props, prevState: State)
    {
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
            this.props.setCopyCurrentHighlight(highlight);
        }
        highlightAll();
    }

    handleScroll(e: any) 
    {
        this.setState((_state) => ({scrollPosition: e.target.scrollTop, backdropHtml: _state.backdropHtml, scrollRef: _state.scrollRef}))
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
        requestAnimationFrame(() =>
        {
            if (prevState.scrollRef?.current)
            {
                prevState.scrollRef?.current.scrollTo({top: prevState.scrollPosition, behavior: 'instant'})
            }
        })
    }

    render()
    {
        return (
            <div className="container">
                <div className="backdrop" ref={this.state.scrollRef}>
                    <div className="highlights">
                        <div dangerouslySetInnerHTML={{__html: this.state.backdropHtml}}></div>
                    </div>
                </div>
                <textarea id="copyTextArea" value={this.props.copy.snippet.text} onMouseUp={this.handleMouseUpTextarea} onScroll={this.handleScroll} readOnly/>
            </div>
        )
    }
}

export default connector(Textarea);