import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import swal from 'sweetalert';
import LinearProgress from '../ui/LinearProgress';
import * as styleProps  from '../ui/Styles';
import * as config  from '../../config/Config';
import { 
    metaDataUpdate,
    getElementDetails,
    getPrograms,
} from '../api/API';

class DataElementsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
      dataElements: [],
    };

    this.handleInputChange   = this.handleInputChange.bind(this);
    this.renderDataElements  = this.renderDataElements.bind(this);
    this.handleSubmitElements= this.handleSubmitElements.bind(this);
  }
  componentWillMount(){
    let self = this;
      getPrograms().then((response) => {
        self.setState({
          dataElements : response.data.programs[0].programStages[0].programStageDataElements       
        }); 
      }).catch(error => this.setState({error: true}));
  }
  handleInputChange(e) {
    
    /**
    * {id, value} returns the element id and input value
    * {dataElements} store the current state elements array
    * {targetIndex} return the 
    * If there is data in the setting input text field, then update/ set the values `dataElements` state
    * if {attributeValues} is empty, develop custom payload from configuration `config.metaAttributeName` & `config.metaAttributeUId` 
    */
    const {id, value}  = e.target;
    let {dataElements} = this.state;
    const targetIndex  = dataElements.findIndex(datum => {
      return datum.dataElement.id === id;
    });

    if(targetIndex !== -1){ 
      if(dataElements[targetIndex].dataElement.code !== '' || typeof dataElements[targetIndex].dataElement.code !== 'undefined' ){
        dataElements[targetIndex].dataElement.code = value;
        this.setState({dataElements});
      } else {
        /*let json = { "code": { "name": config.metaAttributeName, "id": config.metaAttributeUId}, "value": value };
        dataElements[targetIndex].dataElement.attributeValues.push(json);*/
        dataElements[targetIndex].dataElement.code=value;
        this.setState({dataElements});
      }
     
    }
  }
  renderDataElements() {
    const classes = this.props;
    const {dataElements} = this.state;
    let content = dataElements.map(datum => {
      let editUrl = config.baseUrl+"dhis-web-maintenance/#/edit/dataElementSection/dataElement/"+datum.dataElement.id;
      //datum.dataElement.attributeValues.map( val => val.value) for meta attributes
      return (
        <TableRow key={datum.dataElement.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {datum.dataElement.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <input type="text" id={datum.dataElement.id} value={datum.dataElement.code || ''}
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
                <strong><h3> DATA ELEMENTS</h3></strong>
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
  handleSubmitElements(e) {
    this.setState({ // need to upgrade this logic
      loading: true,
    });
    e.preventDefault();
    let updateArray = e.target;   

    swal({
      title: "Are you sure want to update?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willUpdate) => {    
      if (willUpdate) {        
        
        /**
        * Iterate {updateArray} that contains the updated values from settings input
        * {getElementDetails} returns the updated elements detail
        * {customElementString} store the data element detail information
        * {attributeId} returns whether the existing meta attribute exist or not. If do not exist then create the `attribute` array from static configuration `config.metaAttributeUId` 
        * {jsonPayload} returns the final payload to update the meta attributes 
        * {metaDataUpdate} does the `PUT` operations and return messages
        * @returns j-success message and close the loader
        */
        for (let i = 0; i < updateArray.length-1; i++) { //updateArray.length-1
          let j=0;
          if(/*updateArray[i].value !== '' && */updateArray[i].value !== 'true' ){

            getElementDetails(updateArray[i].id).then((response) => {
                let customElementString = response.data;
                let attributeId = customElementString.attributeValues.map( val => val.attribute.id);
                if(typeof attributeId[0] !== 'undefined'){
                  attributeId = attributeId[0];
                } else {
                  attributeId = config.metaAttributeUId;
                }
                
                /**
                * This below commented json was developed for meta attributes value update 
                * Keep this code until final deployment
                */ 
                //let jsonPayload = JSON.stringify({"name": customElementString.name,"shortName": customElementString.shortName,"aggregationType": customElementString.aggregationType,"domainType": customElementString.domainType,"valueType": customElementString.valueType,"attributeValues": [{"value": updateArray[i].value,"attribute": { "id": attributeId }}]});   
                let jsonPayload = JSON.stringify({"name": customElementString.name,"shortName": customElementString.shortName,"aggregationType": customElementString.aggregationType,"domainType": customElementString.domainType,"valueType": customElementString.valueType,"code": updateArray[i].value});
                metaDataUpdate('api/dataElements/'+updateArray[i].id, jsonPayload)
                  .then((response) => {
                    console.log("Console results: ", response.data);
                  });
                if(i === j ){
                  this.setState({
                    loading: false,
                  });
                  swal("Successfully updated meta attribute!", {
                      icon: "success",
                  });
                }
              });
            j++;           

          }
         
        }
        
      } else {
        swal({
            title: "Your data is safe!",
            icon: "success",
        });
        this.setState({
          loading: false,
        });
      }
    });
    
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