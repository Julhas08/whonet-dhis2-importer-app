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
    getElementDetails,
    getPrograms,
    getDataStoreNameSpace,
    createDateStoreNameSpace
} from '../../api/API';

class DataElementsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
      dataElements: [],
      orgUnitId: "",
      OrgUnitName: "",
      dataStoreNamespace: [],
      mergedArrayData: [],
    };

    this.handleInputChange   = this.handleInputChange.bind(this);
    this.renderDataElements  = this.renderDataElements.bind(this);
    this.handleSubmitElements= this.handleSubmitElements.bind(this);
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
    await getPrograms().then((response) => {
      self.setState({
        dataElements : response.data.programs[0].programStages[0].programStageDataElements       
      }); 
    }).catch(error => this.setState({error: true}));

    await getDataStoreNameSpace(this.props.orgUnitId).then((response) => {
      self.setState({
        dataStoreNamespace : response.data.elements      
      }); 
    }).catch(error => this.setState({error: true}));

    // Merge two array
    const mergeById = (jsonPayload1, jsonPayload2) =>
    jsonPayload1.map(itm => ({
        ...jsonPayload2.find((item) => (item.id === itm.dataElement.id) && item),
        ...itm
    }));
    let mergedArray = mergeById(this.state.dataElements, this.state.dataStoreNamespace);
    this.setState({mergedArrayData: mergedArray});

  }
  /**
  * {id, value} returns the element id and input value
  * {dataElements} store the current state elements array
  * {targetIndex} return the 
  * If there is data in the setting input text field, then update/ set the values `dataElements` state
  * if {attributeValues} is empty, develop custom payload from configuration `config.metaAttributeName` & `config.metaAttributeUId` 
  */
  handleInputChange(e) {    
    
    const {id, value}  = e.target;
    let {dataElements, dataStoreNamespace, mergedArrayData} = this.state;
    
    const targetIndex  = mergedArrayData.findIndex(datum => {
      return datum.id === id;
    });

    if(targetIndex !== -1){ 
      if(mergedArrayData[targetIndex].sourceCode !== '' || typeof mergedArrayData[targetIndex].sourceCode !== 'undefined' ){
        mergedArrayData[targetIndex].sourceCode = value;
        this.setState({mergedArrayData});
      } else {
        mergedArrayData[targetIndex].sourceCode=value;
        this.setState({mergedArrayData});
      }     
    } else {
      const targetIndex  = mergedArrayData.findIndex(datum => {
        return datum.dataElement.id === id;
      });
      mergedArrayData[targetIndex].id=id;
      mergedArrayData[targetIndex].sourceCode=value;
      this.setState({mergedArrayData});
    }
    // console.log("mergedArrayData: ", mergedArrayData);
  }
  /**
  *
  *
  *
  */
  async handleSubmitElements(e) {
    this.setState({ 
      loading: true,
    });
    e.preventDefault();
    let updateArray = e.target;
    e.preventDefault(); 
    /*swal({
      title: "Are you sure want to update?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willUpdate) => {    
      if (willUpdate) { */ 

        const dataLength = updateArray.length;
        let updateElementsPayload = [];
        for(let i=0; i< dataLength-1; i++) {
          await ( async(currentData, currentIndex) => {
            const elementObj = Object.entries(currentData);
            let len = elementObj.length;

            for( let j=0; j < 1; j++  ) {
              await ( async ([columnName, columnValue], index ) => {
                if(updateArray[i].value !== '' ){
                  const result= await getElementDetails(updateArray[i].id);
                    let customElementString = result.data;

                    // This json payload is for dataelements code updates
                    //let jsonPayload = JSON.stringify({"name": customElementString.name,"shortName": customElementString.shortName,"aggregationType": customElementString.aggregationType,"domainType": customElementString.domainType,"valueType": customElementString.valueType,"code": updateArray[i].value});
                    
                    // Array for datastore update
                    updateElementsPayload.push({"id": customElementString.id,"name": customElementString.name,"sourceCode": updateArray[i].value,"code": customElementString.code});                
                }    
              } ) (elementObj[j], {}, j);
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
        // If there is no key exist then create first then add settings data
        if (typeof dataStoreNameSpace === 'undefined') {
          await createDateStoreNameSpace('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify(this.state.orgUnitId)).then(info=>{
              console.log("Info: ", info.data);
          });
          await metaDataUpdate('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify({"elements": updateElementsPayload}) )
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
          await metaDataUpdate('api/dataStore/whonet/'+this.state.orgUnitId, JSON.stringify({"elements": updateElementsPayload}) )
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
      /*} else {
        swal({
            title: "Your data is safe!",
            icon: "success",
        });
        this.setState({
          loading: false,
        });
      }
    });*/
    
  }
  renderDataElements() {
    const classes = this.props;
    let {dataElements, dataStoreNamespace, mergedArrayData} = this.state;
    
    let content = mergedArrayData.map(datum => {
      let editUrl = config.baseUrl+"dhis-web-maintenance/#/edit/dataElementSection/dataElement/"+datum.dataElement.id;
      //datum.dataElement.attributeValues.map( val => val.value) for meta attributes
      return (
        <TableRow key={datum.dataElement.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {datum.dataElement.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
            {datum.dataElement.code}
          </TableCell> 
          <TableCell style={styleProps.styles.tableHeader}>
            <input type="text" id={datum.dataElement.id} value={datum.sourceCode || ''}
            onChange={this.handleInputChange} style={styleProps.styles.inputText}/>
          </TableCell> 

          <TableCell style={styleProps.styles.tableHeader}>
            <a href={editUrl} target="_blank">
              <Button variant="contained" component="span" className={classes.button}>
                Edit
              </Button> 
            </a> 
          </TableCell>  

        </TableRow>
      )
    });
    let spinner;
    if(this.state.loading){
      spinner = <LinearProgress />
    }
    return (
      <Paper className={classes.root}  style={styleProps.styles.tableScroll}>
        <form onSubmit={(e) => this.handleSubmitElements(e)} id="whonetsetting">
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> ELEMENT NAME</h3></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> CODE</h3></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> WHONET CODES </h3></strong> 
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h3> EDIT IN DHIS2 </h3></strong> 
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            
            {content}             
          </TableBody>          
        </Table>
        <input type="submit" value="Save Elements" style={styleProps.styles.submitButton}/>
        </form> 
        {spinner}
      </Paper>
    )
  }
  
  render(){
    
    const dataElementList = this.renderDataElements();
    
    return (
      <div>
        {dataElementList}
      </div>
    );

  }          
}

export default DataElementsTable;