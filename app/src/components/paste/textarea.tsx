import { Show } from "../../pages/paste/paste";
import { HighlightProp } from "../../helpers/copy";
import { generateHighlightHtml, generateHighlightMap } from "../../helpers/paste";
import React from 'react'
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";


interface Props
{
    show: Show;
    refresh: boolean;
    drop: boolean;
    setPrintString: (text: string, idx: number) => void;
    idx: number;
    increaseInput: () => void;
    decreaseInput: () => void;
    inputs: number;
}

interface InputState
{
    [var_name: string]: string;
}

interface State
{
    backdropHtml: string;
    scrollPosition: number;
    scrollRef: React.RefObject<HTMLDivElement>;
    show: Show;
    hm: HighlightProp[];
    drop: boolean;
    inputState: InputState;
    refresh: boolean
}

const generateInputStates = (show: Show) =>
{
    let temp: InputState = {};
    if (show.variables.length > 0) 
    {
        show.variables.forEach((vari) =>
        {
            temp[vari.name] = "a";
        })        
    }
    return temp;
}


    
class Textarea extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props)
        this.state =
        {
            show: props.show,
            backdropHtml: generateHighlightHtml(props.show),
            scrollPosition: 0,
            scrollRef: React.createRef(),
            hm: generateHighlightMap(props.show),
            drop: props.drop,
            inputState: generateInputStates(props.show),
            refresh: props.refresh
        }

        this.formatText = this.formatText.bind(this);
        this.changeState = this.changeState.bind(this);

        this.props.setPrintString(this.formatText(), this.props.idx);
        this.increaseinput = this.increaseinput.bind(this);
        this.decreaseinput = this.decreaseinput.bind(this);
    }

    increaseinput()
    {
        this.props.increaseInput();
    }
    decreaseinput()
    {
        this.props.decreaseInput();
    }

    formatText()
    {
        let snippet = this.state.show.text;
        let hm = this.state.hm.sort((a, b) => b.index - a.index);
        hm.forEach((_hm) =>
        {
            if (this.state.inputState[_hm.color] && this.state.inputState[_hm.color].length > 0) 
            {
                snippet = snippet.substring(0, _hm.index) + this.state.inputState[_hm.color] + snippet.substring(_hm.index+_hm.name.length);
            }
            else
            {
                snippet = snippet.substring(0, _hm.index) + _hm.name + snippet.substring(_hm.index+_hm.name.length);
            }
        })
        return snippet;
    }
    changeState(var_name: string, change: string)
    {
        this.state.inputState[var_name] = change;
        this.setState({ refresh: true });
        this.props.setPrintString(this.formatText(), this.props.idx);
    }

    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any)
    {
        if (prevProps.show.id != this.props.show.id) 
        {
            this.setState({show: this.props.show})
        }
    }
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        console.log("CHECKING SHOULD UPDATE?")
        // Compare the next props with the current props
        // Return true if you want the component to re-render, false otherwise
        return nextState.inputState == this.state.inputState || nextProps.show.id !== this.props.show.id || nextState.show.id != this.state.show.id || nextState.drop != this.state.drop;
    }  


    render()
    {
        return (
            <div className="papa">
            <div className="textarea_format">
                {this.state.hm.map((_hm, ind) => 
                (
                    <>
                        <span>{this.state.show.text.substring(ind == 0 ? 0 : (this.state.hm[ind - 1].index + this.state.hm[ind - 1].name.length), _hm.index)}</span>
                        <input className={`textareainput color-${_hm.color}`} placeholder={_hm.name} onChange={(e)=>this.changeState(_hm.color, e.target.value)} value={this.state.inputState[_hm.color]?this.state.inputState[_hm.color]:""} style={{ color: 'white', width: _hm.name.trim().length < 10? 70 :_hm.name.trim().length *10, borderRadius: 5, borderColor: 'transparent' }}/>
                    </>
                ))}
                {this.state.hm.length > 0 && (this.state.hm[this.state.hm.length - 1].index + this.state.hm[this.state.hm.length - 1].name.length) < this.state.show.text.length ?
                    <span>{this.state.show.text.substring(this.state.hm[this.state.hm.length - 1].index + this.state.hm[this.state.hm.length - 1].name.length)}</span> :
                    <span></span>
                }
                    {this.state.hm.length == 0 ? this.state.show.text : <></>}
            </div>
                {this.props.idx == this.props.inputs ? <div style={{ display: "flex", justifyContent: "space-around", padding: "10px 0px"}}><FaPlusCircle style={{color: "green"}} onClick={this.increaseinput}/><FaMinusCircle style={{color: "red"}} onClick={this.decreaseinput}/></div> : <></>}
            </div>
        )
    }

}
export default Textarea;
