import React, { ChangeEvent } from "react";
import { RootState } from "../../redux/store/store";
import { ConnectedProps, connect } from "react-redux";
import * as _ from 'lodash';
import SearchTextarea from "../../components/paste/searchTextarea"
import './paste.css'
const mapStateToProps = (state: RootState) =>
({
    search: state.search
})

const mapDispatch = {};
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

interface Props extends PropsFromRedux
{

}

interface Show
{
    id: string;
    title: string;
    text: string;
}

interface State
{
    all: Show[];
    query: string;
    search: Show[];
    searchShowIndex: number | null;
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
            searchShowIndex: null
        }

        this.onChangeQuery = this.onChangeQuery.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
    }

    async onChangeQuery(event: ChangeEvent<HTMLInputElement>)
    {
        event.preventDefault();
        const {value} = event.target;
        
        if (value.length)
        {
            let index = await this.props.search.search;
            const searchResult = index.search([{field:'title', query: value}]);
            const shows: Show[] = [];

            searchResult[0].result.map((_id: string) =>
            {
                let lodash: Show = _.find(this.state.all, {id: _id}) as Show
                shows.push(lodash)
            })
            this.setState((_state) => ({query: value, all: _state.all, search: shows}));
        }
        else
        {
            this.setState((_state) => ({query: value, all: _state.all, search: _state.search}));
        }
    }

    async componentDidMount() 
    {
        let index = await this.props.search.search
        let all = index.store;
        var resultArray = Object.keys(all).map(function(allIndex){
            let single = all[allIndex];
            return single;
        });
        console.log("STORE", resultArray);
        
        this.setState((_state) => ({all: (resultArray)}));
    }

    onItemClick(idx: number)
    {
        const stringPaste: string = this.state.all[idx].text;
        window.api.paste(stringPaste);
    }

    render()
    {
        return (
            <React.Fragment>
                <div className=" bg-black">
                =================================================
                    <div>
                    SEARCH HERE
                        </div>

                    <input className='input-query-paste' value={this.state.query} onChange={this.onChangeQuery} placeholder='Search for snippets'/>

                    <table>
                    {
                        this.state.search.map((item, idx) => 
                        (
                            <>
                                <div>
                                    <tr key={idx} onMouseOver={() => this.setState({searchShowIndex: idx})} onMouseOut={() => this.setState({searchShowIndex: null})} onClick={() => this.onItemClick(idx)}>{item.title}</tr>
                                    {this.state.searchShowIndex == idx && <tr>{item.text}</tr>}
                                </div>
                            </>
                        ))
                    }
                    </table>

                    =================================================
                    ALL DATABASE TITLES
                    <table>
                    {
                        this.state.all.map((item, idx) => 
                        (
                            <>
                                <div>
                                    <tr key={idx} onMouseOver={() => this.setState({searchShowIndex: idx})} onMouseOut={() => this.setState({searchShowIndex: null})} onClick={() => this.onItemClick(idx)}>{item.title}</tr>
                                    {this.state.searchShowIndex == idx && <tr>{item.text}</tr>}
                                </div>
                            </>
                        ))
                    }
                    </table>

                </div>
            </React.Fragment>
        )
    }
}

export default connector(Paste);
// {/* <SearchTextarea/> */}