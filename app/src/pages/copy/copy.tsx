import './copy.css'
import React, { ChangeEvent, FormEvent } from "react";
import { ConnectedProps, connect } from "react-redux";
import { useConfigInMainRequest, deleteConfigRequest } from "secure-electron-store";
import { setCopySnippetTitle, setCopyCurrentVariableName, clearCopySnippet, clearCopyCurrentVariable, clearCopyCurrentHighlight } from "../../redux/components/copy/copySlice";
import { RootState, store } from "../../redux/store/store";
import Textarea from "../../components/copy/textarea";
import getFromClipboard from "../../helpers/clipboard";
import { createVariable } from '../../helpers/copy';

import { pushClip } from '../../helpers/copy';
import { FaRegWindowClose } from 'react-icons/fa';

const mapStateToProps = (state: RootState) => ({
    copy: state.copy,
})

const mapDispatch = { setCopySnippetTitle, setCopyCurrentVariableName, clearCopySnippet, clearCopyCurrentVariable, clearCopyCurrentHighlight };
const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>


interface Props extends PropsFromRedux
{

}

interface State
{
    snippetTitle: string;
    currentVariableName: string;
}

class Copy extends React.Component<Props, State>
{
    // To-do solve for type
    constructor(props: Props)
    {
        super(props);


        this.state = 
        {
            snippetTitle: "",
            currentVariableName: ""
        }
        
        // SNIPPET METHODS
        this.onChangeSnippetTitle = this.onChangeSnippetTitle.bind(this);
        this.onSubmitSnippet = this.onSubmitSnippet.bind(this);

        // VARIABLE METHODS
        this.onChangeInputName = this.onChangeInputName.bind(this);
        this.onSubmitInput = this.onSubmitInput.bind(this);

        this.onSearch = this.onSearch.bind(this);
        this.closeWindow = this.closeWindow.bind(this);
    }

    // SNIPPET METHODS
        // TITLE
    onChangeSnippetTitle(event: ChangeEvent<HTMLInputElement>)
    {
        event.preventDefault();
        const { value } = event.target;
        this.setState((_state)=> ({snippetTitle: value}));
        
    }

    closeWindow()
    {
        window.api.send("close");
    }

    async onSubmitSnippet(event: FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        this.props.setCopySnippetTitle(this.state.snippetTitle);
        window.api.store.send(deleteConfigRequest);

        await pushClip();

        this.setState((_state)=> ({currentVariableName: "", snippetTitle: ""}));

        this.props.clearCopyCurrentHighlight();
        this.props.clearCopyCurrentVariable();
        this.props.clearCopySnippet();

        window.api.store.send(useConfigInMainRequest);
        window.api.close()
    }

    // VARIABLE
        // NAME
    onChangeInputName(event: ChangeEvent<HTMLInputElement>)
    {
        event.preventDefault();
        const { value } = event.target;
        this.setState((_state)=> ({currentVariableName: value}));
        this.props.setCopyCurrentVariableName(value);
    }
    onSubmitInput(event: FormEvent<HTMLFormElement>)
    {
        event.preventDefault();
        console.log("HAPPENING")
        createVariable();
        this.props.clearCopyCurrentHighlight();
        this.props.clearCopyCurrentVariable();

    }

    onSearch()
    {
        window.api.search('hello')
        .then((results: any) => {
            // use results
            // console.log(results)
        });
    }

    async componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any) {
        // console.log("componentDidUpate")
    }

    
    async componentDidMount()
    {
        let billo = await getFromClipboard()
        console.log("MOUNT", billo)
        window.api.receive('open-copy', async () =>
        {
            console.log("CLIPBOARD MOUNT START ")
            let billo = await getFromClipboard()
            console.log("MOUNT", billo)
            // While loop for repeated cals untill we get the latest copy
            while (!billo)
            {
                billo = await getFromClipboard()
            }
            window.api.store.send(useConfigInMainRequest);
        });
    }

    render()
    {
        return (
            <React.Fragment>
                <div className='titlebar'><div></div><div>cavi</div><FaRegWindowClose style={{color: "red"}} className='title-closeme' onClick={this.closeWindow}/></div>
                <div className="copy-body" >
                        {/* SNIPPET */}
                        <div className=''>
                            <form className='mb-4' onSubmit={this.onSubmitSnippet}>
                                <input className='input-name-copy input' value={this.state.snippetTitle} onChange={this.onChangeSnippetTitle} placeholder='Enter a comment'/>

                            </form>
                            <Textarea />
                        </div>
                        
                </div>

            </React.Fragment>
        )
    }
}

export default connector(Copy);








































// import React, { useState, useEffect } from 'react';
// import Textarea from '../components/Textarea';
// import getFromClipboard from '../helper/clipboard';

// import axios from 'axios'
// // import { createHashHistory } from '@remix-run/router';


// // Todo convert form data from string to proper data type
// interface FormData
// {
//   key: string,
//   value: string,
//   variableData: VariableData[]
// }

// interface VariableData
// {
//   varName: string,
//   index: number,
//   text: string
// }

// interface Match 
// {
//   index: number;
//   text: string; 
// }

// function findAllMatches(text: string, regex: RegExp): Match[] 
// {
//   const matches: Match[] = [];
//   let match;
//   while ((match = regex.exec(text)) !== null) 
//   {
//     matches.push({index: match.index, text: match[0]});
//   }
//   return matches;
// }



// function copy()
// {
  
//     const [snippet, setSnippet] = useState("");
//     const [name, setName] = useState("");
    
//     const [variableData, setVariableData] = useState<VariableData[]>([]);

//     const [variableNames, setVariableNames] = useState<string[]>([]);

//     const colorList = ["#86a1db", "#b4dfff", "#f7ffb2", "#ffdca7", "#ffa3bf"];


//     const [currentVar, setCurrentVar] = useState("");
//     const [currentHlt, setCurrentHlt] = useState([0, 0]);

//     useEffect(() =>
//     {
//       let a: string[] = [];
//       variableData.forEach((vD) =>
//       {
//         if (!a.includes(vD.varName))
//         a.push(vD.varName)
//       })
//       setVariableNames(a)

//     })

//     const handleDelete = (varDelete: string) =>
//     {
//       var toRemove: VariableData[] = [];
//       for (let i = 0; i < variableData.length; i++)
//       {
//         const varData = variableData[i];
//         if (varData.varName == varDelete)
//         {
//           toRemove.push(varData)
//         }
//         else
//         {

//         }
//       }

//       var filteredArray = variableData;
//       toRemove.forEach((val) =>
//       {
//         filteredArray = filteredArray.filter(item => item.index != val.index);
//       })
//       if (toRemove)
//       {
//         setVariableData(filteredArray)
//       }
//     }


//     const checkValidHighlight = (selectionStart: number, selectionEnd: number) =>
//     {
//       if (variableData.length > 0)
//       {
//         var toRemove: VariableData[] = [];
//         for (let i = 0; i < variableData.length; i++)
//         {
//           const varData = variableData[i];
//           const range = [varData.index, varData.text.length + varData.index];
//           if (!(selectionStart > range[1] || selectionEnd < range[0]))
//           {
//             toRemove.push(varData);
//             console.log("CANCELLING", varData)
//           }
//           else
//           {
//             console.log("NOT CANCELLING", varData)
//           }
  
//         }
  
//         var filteredArray = variableData;
//         toRemove.forEach((val) =>
//         {
//           filteredArray = filteredArray.filter(item => item.index != val.index);
//         })
//         if (toRemove)
//         {
//           setVariableData(filteredArray)
//         }
//       }
//     }

//     // const [count, setCount] = useState([]);

//     useEffect(() =>
//     {
//         getFromClipboard(setSnippet);
//     }, [])

//     // const readGet = () =>
//     // {
//     //     axios.get("http://localhost:3000")
//     //         .then((response) =>
//     //         {
//     //         setCount(response.data.split("|"));
//     //         return null;
//     //         })
//     // // }
//     // useEffect(()=>
//     // {
//     //   console.log("USE", variableNames);
//     // }, [variableNames])

//     const handleHighlight = (event: React.KeyboardEvent<HTMLInputElement>) =>
//     {
//       if (event.key == "Enter")
//       {
//         const text = snippet;
//         const startIndex = currentHlt[0];
//         const endIndex = currentHlt[1];
    

//           const next = text.substring(startIndex, endIndex)
//           var URLRegExp = new RegExp(""+next+"", "g");
//           const res = findAllMatches(text, URLRegExp)

//           var temp: VariableData[] = [];
//           res.forEach((match) =>
//           {
//             temp.push({varName: currentVar, index: match.index, text: match.text});
//           })
      
//           setVariableData(prevData => [...prevData, ...temp]);
//           setCurrentVar("");
//           setCurrentHlt([0,0]);
//       }
//     }

//     const handleSubmit = async (event: React.KeyboardEvent<HTMLInputElement>) => 
//     {
//         if (event.key == "Enter")
//         {
//             const formdata: FormData =  {
//                 key: name,
//                 value: snippet,
//                 variableData: variableData
//             };
//             await axios.post<FormData>('http://localhost:3000/add', formdata);
//             setSnippet("");
//             setName("");
//         }
//     }
//     // const handleClear = () =>
//     // {
//     //   setSnippet("");
//     // }

//     // const handleReload = () =>
//     // {
//     //   getFromClipboard(setSnippet);
//     // }

//     return (
//         <>
//         <div className='container-copy'>          
//           <input className='input-name-copy' value={name} onChange={(e)=>setName(e.target.value)} onKeyPress={handleSubmit} placeholder='Enter a comment'/>
//           <Textarea variableData={variableData} checkValidHighlight={checkValidHighlight} text={snippet} onTextSelect={setCurrentHlt} placeholder="Enter a snippet"  />
//           {/* <div>
//             <button onClick={handleClear}>Clear</button>
//             <button onClick={handleReload}>Reload</button>
//           </div> */}
//           {/* <h2>{snippet.substring(currentHlt[0], currentHlt[1])}</h2> */}
//           <input className='input-name-copy' value={currentVar} onChange={(e)=>setCurrentVar(e.target.value)} onKeyPress={handleHighlight}  placeholder='Enter a variable name'/>
//           </div>

//           {/* {variableNames} */}

//           {variableNames?.map((item) => (
//             <>
// <div className='flex justify-center items-center gap-3' style={{display:"flex", padding:"2px 10px", width:"fit-content", color:"black", backgroundColor: colorList[variableNames.indexOf(item)]}}>
//   {item} 
//   <img style={{height:"10px", width:"10px"}} src={"./close.png"} onClick={()=>handleDelete(item)}/>
// </div>                      
//             </>
//           ))}
       
//         </>
//     )
// }

// export default copy;

//           {/* <button onClick={() => readGet()}>
//             Retrive Data
//           </button> */}
//           {/* {count.map(item => (
//           <div key={item} className="card">
//             <p>{item}</p>
//           </div>
//         ))} */}
