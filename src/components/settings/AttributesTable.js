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
    getAttributeDetails,
    getAttributes,
} from '../api/API';

class AttributesTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
      attributes: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderDataElements        = this.renderDataElements.bind(this);
    this.handleSubmitAttributes= this.handleSubmitAttributes.bind(this);
  }
  componentDidMount(){
    let self = this;
      getAttributes().then((response) => {
        self.setState({
          attributes : response.data.trackedEntityAttributes
        }); 
      }).catch(error => this.setState({error: true}));
  }
  handleInputChange(e) {
    
    /**
    * {id, value} returns the element id and input value
    * {attributes} store the current state elements array
    * {targetIndex} return the 
    * If there is data in the setting input text field, then update/ set the values `attributes` state
    * if {attributeValues} is empty, develop custom payload from configuration `config.metaAttributeName` & `config.metaAttributeUId` 
    */
    const {id, value}  = e.target;
    let {attributes}   = this.state;
    const targetIndex  = attributes.findIndex(datum => {
      return datum.id === id;
    });

    if(targetIndex !== -1){      
      if(attributes[targetIndex].attributeValues.length > 0 ){
        attributes[targetIndex].attributeValues[0].value = value;
        this.setState({attributes});
      } else {
        /*let json = { "attribute": { "name": config.metaAttributeName, "id": config.metaAttributeUId}, "value": value };
        attributes[targetIndex].attributeValues.push(json);*/
        attributes[targetIndex].code = value;
        this.setState({attributes});
      }
     
    }
  }
  renderDataElements() {
    const classes = this.props;
    const {attributes} = this.state;
    let content = attributes.map(datum => {
      let editUrl = config.baseUrl+'dhis-web-maintenance/#/edit/programSection/trackedEntityAttribute/'+datum.id;
      return (
        <TableRow key={datum.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {datum.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <input type="text" id={datum.id} value={datum.code}
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
          <form onSubmit={(e) => this.handleSubmitAttributes(e)} id="whonetsetting">
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell style={styleProps.styles.tableHeader}> 
                  <strong><h3> ATTRIBUTES</h3></strong>
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
          <input type="submit" value="Save Attributes" style={styleProps.styles.submitButton}/>
          </form> 
          {spinner}
        </Paper>
      )
  }
  handleSubmitAttributes(e) {
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
        * {getAttributeDetails} returns the updated attributes detail
        * {customAttributeString} store the data element detail information
        * {attributeId} returns whether the existing meta attribute exist or not. If do not exist then create the `attribute` array from static configuration `config.metaAttributeUId` 
        * {jsonPayload} returns the final payload to update the meta attributes 
        * {metaDataUpdate} does the `PUT` operations and return messages
        * @returns j-success message and close the loader
        */

        for (let i = 0; i < updateArray.length-1; i++) { //updateArray.length-1
          let j=0;
          if(/*updateArray[i].value !== '' &&*/ updateArray[i].value !== 'true' ){

            getAttributeDetails(updateArray[i].id).then((response) => {
                let customAttributeString = response.data;
                let attributeId = customAttributeString.attributeValues.map( val => val.attribute.id);
                if(typeof attributeId[0] !== 'undefined'){
                  attributeId = attributeId[0];
                } else {
                  attributeId = config.metaAttributeUId;
                }
                 
                //let jsonPayload = JSON.stringify({"name": customAttributeString.name,"shortName": customAttributeString.shortName,"aggregationType": customAttributeString.aggregationType,"domainType": customAttributeString.domainType,"valueType": customAttributeString.valueType,"attributeValues": [{"value": updateArray[i].value,"attribute": { "id": attributeId }}]});
                let jsonPayload = JSON.stringify({"name": customAttributeString.name,"shortName": customAttributeString.shortName,"aggregationType": customAttributeString.aggregationType,"domainType": customAttributeString.domainType,"valueType": customAttributeString.valueType,"code": updateArray[i].value});
                //console.log("jsonPayload Attribute: ", jsonPayload);
                metaDataUpdate('api/trackedEntityAttributes/'+updateArray[i].id, jsonPayload)
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

export default AttributesTable;