import React, { ChangeEvent } from "react";
import { RootState } from "../../redux/store/store";
import { ConnectedProps, connect } from "react-redux";
import * as _ from 'lodash';
import SearchTextarea from "../../components/paste/searchTextarea"
import './paste.css'
import { Variable } from "../../constants/interfaces/copy/copy";
import { initiateIndex } from "../../redux/components/search/searchSlice";
import { FaDoorOpen, FaList, FaRegWindowClose, FaSearch } from "react-icons/fa";
const mapStateToProps = (state: RootState) =>
({
    search: state.search
})

const mapDispatch = {initiateIndex};
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux
{

}

export interface Show
{
    id: string;
    title: string;
    text: string;
    variables: Variable[];
}

interface State
{
    all: Show[];
    query: string;
    search: Show[];
    searchShowIndex: number | null;
    refresh: boolean;
    listview: boolean;
}


class Paste extends React.Component<Props, State>
{
    constructor(props: Props)
    {
        super(props);

        this.state = 
        {
            all: [],
            query: "",
            search: [],
            searchShowIndex: null,
            refresh: true,
            listview: true

        }

        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.onItemClick = this.onItemClick.bind(this);

        this.refresh = this.refresh.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
        this.exit = this.exit.bind(this);
    }

    exit()
    {
        window.api.send("exit");
    }

    closeWindow()
    {
        window.api.send("close");
    }

    async onChangeQuery(event: ChangeEvent<HTMLInputElement>)
    {
        event.preventDefault();
        const {value} = event.target;
        
        if (value.length)
        {
            let index = this.props.search.search;
            const searchResult = index.search(value, ['title', 'text']);
            const shows: Show[] = [];

            if (searchResult.length > 0)
            {
                searchResult[0].result.map((_id: string) =>
                {
                    let lodash: Show = _.find(this.state.all, { id: _id }) as Show
                    if (lodash)
                    shows.push(lodash)
                })
                this.setState((_state) => ({query: value, all: _state.all, search: shows}));
            }
            else
            {
                this.setState((_state) => ({query: value, all: _state.all, search: []}));
            }
        }
        else
        {
            this.setState((_state) => ({query: value, all: _state.all, search: []}));
        }
    }

    async refresh()
    {
        // this.props.refreshIndex();
        const res = await this.props.initiateIndex()
    }

    


    async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        if (!_.isEqual(prevProps, this.props))
        {
            setTimeout(() => {
            let all = this.props.search.search.store;
            if (all)
            {    
            var resultArray = Object.keys(all).map(function (allIndex) {
                let single = all[allIndex];
                return single;
            });
                resultArray = _.uniqBy(resultArray, function(o) {return o.text+o.title+Object.keys(o.variables).join("")})
            
                this.setState({ all: resultArray });
                this.setState({search: []})
                }}, 100)
            }
    }


    async componentDidMount() 
    {
        const res = await this.props.initiateIndex()

        let index = res.payload        
    }

    onItemClick(idx: number, arr: Show[])
    {
        const stringPaste: string = arr[idx].text;
        window.api.paste(stringPaste);
    }

    render()
    {
        return (
            <React.Fragment>
                <div className='titlebar'><FaDoorOpen style={{width: "20px"}} className='title-exit'  onClick={this.exit} /><div id='app-title' style={{ userSelect: "none" }}><span className='font-color-pink'>c</span><span className='font-color-yellow'>a</span><span className='font-color-blue'>v</span><span className='font-color-grey'>i</span></div><FaRegWindowClose style={{width: "20px"}} className='title-closeme' onClick={this.closeWindow} /></div>

                <div className=" bg-black copy-body">
                    <div style={{ display: "flex", justifyContent: "space-around" }}>
                        <FaSearch style={{color: !this.state.listview ? "green": "grey"}} onClick={() => {this.setState({listview: false})}}/> <FaList style={{color: this.state.listview ? "green": "grey"}} onClick={() => {this.setState({listview: true})}}/>
                        
                    </div>
                    {!this.state.listview ?
                    
                        <div style={{marginTop: "20px"}}>
                            <input className='input' value={this.state.query} onChange={this.onChangeQuery} placeholder='Search for snippets'/>
                            {/* <table > */}
                            {
                                this.state.search.map((item, idx) => 
                                (
                                    <>
                                        <div>
                                            {/* {<tr > */}
                                                <SearchTextarea refresh={this.refresh} show={item} />
                                            {/* </tr>} */}
                                            
                                        </div>
                                    </>
                                ))
                            }
                            {/* </table> */}
                        </div>
                        :
                        <div style={{marginTop: "20px"}}>
                            {/* <table> */}
                            {
                                this.state.all.map((item, idx) => 
                                (
                                    <>
                                        <div>
                                            {/* {<tr> */}
                                                <SearchTextarea refresh={this.refresh} show={item} />
                                            {/* </tr>} */}
                                        </div>
                                    </>
                                ))
                            }
                            {/* </table> */}
                        </div>
                    }
                    

                </div>
            </React.Fragment>
        )
    }
}

export default connector(Paste);


// {this.state.searchShowIndex == idx && Object.keys(item.variables).length && Object.keys(item.variables).map((name: string) =>
//     (
//         <>
//             <h2 Style='background-color:blue !important; color: green;'>{item.variables[name].name}</h2>
//         </>
                                    {/* <tr key={idx} onClick={() => this.onItemClick(idx, this.state.all)}>{_.trim(item.text).substring(0, 60)}</tr> */}
//     ))}