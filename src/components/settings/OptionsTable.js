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
    getOptionDetails,
    getOptions,
} from '../api/API';

class OptionsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
      options: [],
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.renderOptions        = this.renderOptions.bind(this);
    this.handleSubmitOptions= this.handleSubmitOptions.bind(this);
  }

  handleInputChange(e) {
    
    /**
    * {id, value} returns the element id and input value
    * {options} store the current state elements array
    * {targetIndex} return the 
    * If there is data in the setting input text field, then update/ set the values `options` state
    * if {attributeValues} is empty, develop custom payload from configuration `config.metaAttributeName` & `config.metaAttributeUId` 
    */
    const {id, value}  = e.target;
    let options      = this.props.options;
    const targetIndex  = options.findIndex(datum => {
      return datum.id == id;
    });

    if(targetIndex !== -1){      
      if(options[targetIndex].attributeValues.length > 0 ){
        options[targetIndex].attributeValues[0].value = value;
        this.setState({options});
      } else {
        let json = { "attribute": { "name": config.metaAttributeName, "id": config.metaAttributeUId}, "value": value };
        let valueArray = options[targetIndex].attributeValues.push(json);
         valueArray= value;
        this.setState({options});
      }
     
    }
  }
  renderOptions() {
    const classes = this.props;
    const {options} = this.state;
    let content;
    console.log("this.props.options: ", this.props.options);
    if(this.props.options.length > 0){
      content = this.props.options.map(datum => {
      let editUrl = config.baseUrl+'dhis-web-maintenance/#/edit/categorySection/categoryOption/'+datum.id;
      return (
        <TableRow key={datum.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {datum.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <input type="text" id={datum.id} value={datum.attributeValues.map( val => val.value)}
            onChange={this.handleInputChange} style={styleProps.styles.inputText}/>
          </TableCell>         
        </TableRow>
      )
      });
    }
    
    let spinner;
    if(this.state.loading){
      spinner = <LinearProgress />
    }
    return (
      <Paper className={classes.root}  style={styleProps.styles.tableScroll}>
        <form onSubmit={(e) => this.handleSubmitOptions(e)} id="whonetsetting">
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h2> Attributes</h2></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h2> WHONET Codes </h2></strong> 
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
  handleSubmitOptions(e) {
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
        let j=0;
        /**
        * Iterate {updateArray} that contains the updated values from settings input
        * {getOptionDetails} returns the updated options detail
        * {customOptionsString} store the data element detail information
        * {attributeId} returns whether the existing meta attribute exist or not. If do not exist then create the `attribute` array from static configuration `config.metaAttributeUId` 
        * {jsonPayload} returns the final payload to update the meta options 
        * {metaDataUpdate} does the `PUT` operations and return messages
        * @returns j-success message and close the loader
        */
        for (let i = 0; i < updateArray.length-1; i++) { //updateArray.length-1
         
          if(/*updateArray[i].value !== '' &&*/ updateArray[i].value !== 'true' ){

            getOptionDetails(updateArray[i].id).then((response) => {
                let customOptionsString = response.data;
                let attributeId = customOptionsString.attributeValues.map( val => val.attribute.id);
                if(typeof attributeId[0] !== 'undefined'){
                  attributeId = attributeId[0];
                } else {
                  attributeId = config.metaAttributeUId;
                }
                 
                let jsonPayload = JSON.stringify({"name": customOptionsString.name,"shortName": customOptionsString.shortName,"attributeValues": [{"value": updateArray[i].value,"attribute": { "id": attributeId }}]});
                console.log("jsonPayload options: ", jsonPayload);
                  /*metaDataUpdate('api/trackedEntityAttributes/'+updateArray[i].id, jsonPayload)
                  .then((response) => {
                    console.log("Response: ", response.data);
                  });*/
              });            
            }

          j++;
        }
        if(j === updateArray.length-1){
          this.setState({
            loading: false,
          });
          swal("Successfully updated meta attribute!", {
              icon: "success",
          });
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
    
    const dataElementList = this.renderOptions();
    
    return (
      <div>
        {dataElementList}
      </div>
    );

  }          
}

export default OptionsTable;