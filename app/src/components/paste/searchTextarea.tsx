import React from "react";
import { Show } from "../../pages/paste/paste";
import Textarea from "./textarea";
import { FaBackspace, FaRegTrashAlt, FaTrash, FaTrashAlt, FaTrashRestore } from "react-icons/fa";
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
        this.setState((state) => ({show: state.show, drop: state.drop, refresh: state.refresh, print_string: state.print_string, inputs: state.inputs + 1}))
    }

    decreaseInput()
    {
        if (this.state.inputs > 0)
        this.setState((state) => ({show: state.show, drop: state.drop, refresh: state.refresh, print_string: state.print_string, inputs: state.inputs - 1}))
    }

    setPrintString(text: string, idx: number)
    {
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
                printing += t + "\n";
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
        var logic = this.state.inputs != nextState.inputs || this.state.drop != nextState.drop  || (nextState.refresh != this.state.refresh && nextState.refresh == true) || nextState.show.id != this.state.show.id || nextProps.show.id !== this.props.show.id
        return logic
        // Compare the next props with the current props
        // Return true if you want the component to re-render, false otherwise
        // return nextState.inputState == this.state.inputState || nextProps.show.id !== this.props.show.id || nextState.show.id != this.state.show.id || nextState.drop != this.state.drop;
    }  
    


    render()
    {
        return (
            <div onMouseOver={() => this.setState({ drop: true })} onMouseOut={() => this.setState({ drop: false })} style={{width: "100%"}}>
                {this.state.show ?
                <div style={{ display: "flex", justifyContent: "space-between", width: "100%", margin: "0px" }}>
                    <div><span onClick={this.onTitleClick} style={{ fontWeight: 'bold' }} onMouseOver={() => this.setState({ drop: true })} onMouseOut={() => this.setState({ drop: false })}>{this.state.show.title.substring(0, 40)}{this.props.show.title.length>40?"...":""} </span><span style={{marginLeft: "20px"}}>({this.state.show.variables.length} var)</span></div>
                    <FaRegTrashAlt className="paste-delete" onClick={() => this.onDeleteClick(this.state.show.id)} /> 
                </div>
                    :
                    <></>}
                {this.state.drop && this.state.show ? 
                    <p style={{overflow: "hidden", width: "100%"}} >
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
