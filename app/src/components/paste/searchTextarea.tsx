import React from "react";
import { Show } from "../../pages/paste/paste";
import Textarea from "./textarea";
import { FaBackspace } from "react-icons/fa";
interface Props 
{
    show: Show;
    refresh: () => {}
}



interface State
{
    show: Show;
    drop: boolean;
    refresh: boolean;
    inputs: number;
    print_string: [string];
}


class SearchTextarea extends React.Component<Props, State>
{

    constructor(props: Props)
    {
        super(props);
        this.state =
        {
            show: props.show,
            drop: false,
            refresh: true,
            print_string: [""],
            inputs: 0
        }

        this.onTitleClick = this.onTitleClick.bind(this);
        this.setPrintString = this.setPrintString.bind(this);

        this.increaseInput = this.increaseInput.bind(this);
        this.decreaseInput = this.decreaseInput.bind(this);
    }

    increaseInput()
    {
        console.log("MEMEME")
        this.setState((state) => ({show: state.show, drop: state.drop, refresh: state.refresh, print_string: state.print_string, inputs: state.inputs + 1}))
    }

    decreaseInput()
    {
        if (this.state.inputs > 0)
        this.setState((state) => ({show: state.show, drop: state.drop, refresh: state.refresh, print_string: state.print_string, inputs: state.inputs - 1}))
    }

    setPrintString(text: string, idx: number)
    {
        console.log("SET PRINT STRING TRIGGERED", text)
        var change = this.state.print_string;
        change[idx] = text;
        this.setState({ print_string: change });
    }


    async onDeleteClick(id: string)
    {
        await window.api.deleteClip(id);
        this.props.refresh();
    }

    onTitleClick()
    {
        var printing = "";
        var text = this.state.print_string;
        text.forEach((t) =>
            {
                printing += t;
        })
        window.api.paste(printing);
    }


    componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any)
    {
        if (prevProps.show.id != this.props.show.id) 
        {
            this.setState({show: this.props.show})
        }
    }
    shouldComponentUpdate(nextProps: Props, nextState: State) {
        console.log("TRYING", "this state", this.state, "next state", nextState)
        var logic = this.state.inputs != nextState.inputs || this.state.drop != nextState.drop  || (nextState.refresh != this.state.refresh && nextState.refresh == true) || nextState.show.id != this.state.show.id || nextProps.show.id !== this.props.show.id
        console.log("REFRESH ", logic ? "true": "false")
        return logic
        // Compare the next props with the current props
        // Return true if you want the component to re-render, false otherwise
        // return nextState.inputState == this.state.inputState || nextProps.show.id !== this.props.show.id || nextState.show.id != this.state.show.id || nextState.drop != this.state.drop;
    }  
    


    render()
    {
        return (
            <div onMouseOver={() => this.setState({ drop: true })} onMouseOut={() => this.setState({ drop: false })}>
                <div style={{display: "flex", justifyContent: "space-between", width: "80vw", margin: "0px"}}>
                    <h1 onClick={this.onTitleClick} style={{ fontWeight: 'bold' }} onMouseOver={() => this.setState({ drop: true })} onMouseOut={() => this.setState({ drop: false })}>{this.state.show.title.substring(0, 40)}{this.props.show.title.length>40?"...":""}</h1>
                    <FaBackspace style={{color: "red"}}  onClick={()=> this.onDeleteClick(this.state.show.id)}/> 
                </div>
                {this.state.drop ? 
                    <p style={{overflow: "hidden"}} >
                        {
                            [...Array(this.state.inputs + 1)].map((_, idx) =>
                            (
                                <>
                                    <Textarea inputs={this.state.inputs} increaseInput={this.increaseInput} decreaseInput={this.decreaseInput} key={idx} idx={idx} show={this.state.show} drop={this.state.drop} refresh={this.state.refresh} setPrintString={this.setPrintString} />
                                </>
                            ))
                        }
                
            </p>
                
                : <></>}
            </div>
        )
    }
}

export default SearchTextarea;

{/* <tr key={idx} onMouseOver={() => this.setState({searchShowIndex: idx})} onMouseOut={() => this.setState({searchShowIndex: null})} onClick={() => this.onItemClick(idx, this.state.search)}>{item.title}</tr> */}
