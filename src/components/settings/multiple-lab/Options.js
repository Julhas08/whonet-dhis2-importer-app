import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import LinearProgress from '../../ui/LinearProgress';
import * as styleProps  from '../../ui/Styles';
import * as config  from '../../../config/Config';
import { 
    metaDataUpdate,
    getOptionSetDetails,
    getPrograms,
    getDataStoreNameSpace,
    createDateStoreNameSpace,
    getOptionSets
} from '../../api/API';

class OptionsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
      optionSets: [],
      optionSets: [],
      orgUnitId: "",
      OrgUnitName: "",
      dataStoreNamespace: [],
      mergedArrayData: [],
    };

    this.handleInputChange   = this.handleInputChange.bind(this);
    this.renderOptionSets    = this.renderOptionSets.bind(this);
    this.handleOptionsSubmit = this.handleOptionsSubmit.bind(this);
  }
  /**
  *
  *
  */
  async componentWillMount(){
    this.setState({
      orgUnitId: this.props.orgUnitId,
      OrgUnitName: this.props.OrgUnitName
    });
    let self = this;

    await getOptionSets().then((response) => {
      self.setState({
        optionSets : response.data.optionSets       
      }); 
    }).catch(error => this.setState({error: true}));


    await getDataStoreNameSpace(this.props.orgUnitId).then((response) => {
      self.setState({
        dataStoreNamespace : response.data.options      
      }); 
    }).catch(error => this.setState({error: true}));

    // Merge two array
    const mergeById = (jsonPayload1, jsonPayload2) =>
    jsonPayload1.map(itm => ({
        ...jsonPayload2.find((item) => (item.id === itm.dataElement.id) && item),
        ...itm
    }));
    let mergedArray = mergeById(this.state.optionSets, this.state.dataStoreNamespace);
    this.setState({mergedArrayData: mergedArray});

  }
  /**
  * {id, value} returns the element id and input value
  * {optionSets} store the current state elements array
  * {targetIndex} return the 
  * If there is data in the setting input text field, then update/ set the values `optionSets` state
  * if {attributeValues} is empty, develop custom payload from configuration `config.metaAttributeName` & `config.metaAttributeUId` 
  */
  handleInputChange(e) {    
    
    const {id, value}  = e.target;
    let {optionSets, dataStoreNamespace, mergedArrayData} = this.state;
    
    const targetIndex  = mergedArrayData.findIndex(datum => {
      return datum.id === id;
    });

    if(targetIndex !== -1){ 
      if(mergedArrayData[targetIndex].mapCode !== '' || typeof mergedArrayData[targetIndex].mapCode !== 'undefined' ){
        mergedArrayData[targetIndex].mapCode = value;
        this.setState({mergedArrayData});
      } else {
        mergedArrayData[targetIndex].mapCode=value;
        this.setState({mergedArrayData});
      }     
    } else {
      const targetIndex  = mergedArrayData.findIndex(datum => {
        return datum.options.id === id;
      });
      mergedArrayData[targetIndex].id=id;
      mergedArrayData[targetIndex].mapCode=value;
      this.setState({mergedArrayData});
    }
    // console.log("mergedArrayData: ", mergedArrayData);
  }
  /**
  *
  *
  *
  */
  async handleOptionsSubmit(e) {
    this.setState({ 
      loading: true,
    });
    e.preventDefault();
    let updateArray = e.target;
    const dataLength = updateArray.length;
    let updateOptionsPayload = [];
    for(let i=0; i< dataLength-1; i++) {
      await ( async(currentData, currentIndex) => {
        const optionObj = Object.entries(currentData);
        let len = optionObj.length;

        for( let j=0; j < 1; j++  ) {
          await ( async ([columnName, columnValue], index ) => {
            console.log("updateArray[i].value: ", updateArray[i].value);
            if(updateArray[i].value !== '' ){
              console.log("updateArray[i].id: ", updateArray[i].id);
              const result= await getOptionSetDetails(updateArray[i].id);
              console.log("Result: ", result);
                let optionSetDetailInfo = result.data;
                
                // Array for datastore update
                updateOptionsPayload.push({
                  "id": optionSetDetailInfo.id,
                  "name": optionSetDetailInfo.name,
                  "options": {
                    "id": updateArray[i].id,
                    "name": updateArray[i].name,
                    "code": updateArray[i].code,
                    "mapCode": updateArray[i].value,
                  }
                  
                });   
                console.log("updateOptionsPayload: ", updateOptionsPayload);             
            }    
          } ) (optionObj[j], {}, j);
        } 
        
      } ) ( updateArray[i], {}, i );
    }
    // Find the setting key exist or not
    const dataStoreNameSpace = await getDataStoreNameSpace(this.state.orgUnitId)
    .then((response) => {      
      return response.data;
    }).catch(error => {
      console.log("error.response.data.httpStatusCode: ", error.response.data.httpStatusCode);
    });
    // If there is no key exist then create first the option,element and attributes the add settings data
    if (typeof dataStoreNameSpace === 'undefined') {

      await createDateStoreNameSpace('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify(this.state.orgUnitId)).then(info=>{
          console.log("Info: ", info.data);
      });
      await metaDataUpdate('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify({"elements": [], "attributes": [],"options":updateOptionsPayload }) )
      .then((response) => {
        if(response.data.httpStatus === "OK" ){
          this.setState({
            loading: false,
          });
          swal("Setting information was updated successfully!", {
              icon: "success",
          });
        }
        console.log("Console results: ", response.data);
      }).catch(error => { 
        console.log({error}); 
        swal("Sorry! Unable to update setting information!", {
              icon: "error",
        });
      });

    } else {
      dataStoreNameSpace.elements = updateOptionsPayload;
      let finalPayload = dataStoreNameSpace;
      await metaDataUpdate('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify(finalPayload) )
      .then((response) => {
        if(response.data.httpStatus === "OK" ){
          this.setState({
            loading: false,
          });
          swal("Setting information was updated successfully!", {
              icon: "success",
          });
        }
        console.log("Console results: ", response.data);
      }).catch(error => { 
        console.log({error}); 
        swal("Sorry! Unable to update setting information!", {
              icon: "error",
        });
      });
    }
   
  }
  renderOptionSets() {
    const classes = this.props;
    let {optionSets, dataStoreNamespace, mergedArrayData} = this.state;
    //console.log("mergedArrayData: ", mergedArrayData);
    let content = optionSets.map(datum => {
      //console.log(datum.options);
      return datum.options.map(result=>{
        return (
          <TableRow key={result.id}>
            <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
              {datum.name}
            </TableCell> 
            <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
              {result.name}
            </TableCell>
            <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
              {result.code}
            </TableCell>
            <TableCell style={styleProps.styles.tableHeader}>
              <input type="text" id={datum.id}
              onChange={this.handleInputChange} style={styleProps.styles.inputText}/>
            </TableCell> 
          </TableRow>
        )
      })  
    });
    let spinner;
    if(this.state.loading){
      spinner = <LinearProgress />
    }
    return (
      <Paper className={classes.root}  style={styleProps.styles.tableScroll}>
        <form onSubmit={(e) => this.handleOptionsSubmit(e)} id="whonetsetting">
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> OPTION SETS </h3></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> OPTION NAME</h3></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> OPTION CODE</h3></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> MAP CODE </h3></strong> 
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            
            {content}             
          </TableBody>          
        </Table>
        <input type="submit" value="Save Options" style={styleProps.styles.submitButton}/>
        </form> 
        {spinner}
      </Paper>
    )
  }
  
  render(){
    
    const optionSetsList = this.renderOptionSets();
    
    return (
      <div>
        {optionSetsList}
      </div>
    );

  }          
}

export default OptionsTable;