import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import swal from 'sweetalert';
import axios from 'axios';
import LinearProgress from '../ui/LinearProgress';
import * as styleProps  from '../ui/Styles';
import * as config  from '../../config/Config';

class DataElementsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);


    /*getInstance()
    .then(d2 => {
        d2.Api.getApi()  
        .put('dataElements/lIkk661BLpG',{
            method: 'PATCH',
            headers: {
            'content-type': 'application/json',
            Authorization: "Basic " + btoa("julhas:Amr@1234")   
            },
            data: '{"code": "AMR ID 111"}'
          })  
        .then(response => {
           console.log("response: ",response);
        });
    });*/
  }
  
  handleChange(e) {
    this.setState({value: e.target.value});
  }

  handleSubmit(e) {
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
        for (let i = 0; i < updateArray.length-1; i++) { //updateArray.length-1
          axios(config.baseUrl+'api/dataElements/'+updateArray[i].id, {
              method: 'PATCH',
              headers: {
              Accept: 'application/json',
              'content-type': 'application/json',
              Authorization: "Basic " + btoa("julhas:Amr@1234")   
              },
              data: JSON.stringify({"code": updateArray[i].value}),
          }).then(response => {
              console.log("Response: ", response.data);
              
          }).catch(error => {
              throw error;
          }); 
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
    const classes = this.props;
    let tabaleData;
    //console.log("dataElements: ", this.props.dataElements);
    if(typeof this.props.dataElements !== 'undefined' || this.props.dataElements.length !== 0){
    tabaleData = 
      this.props.dataElements.map( (row, index) => (
        <TableRow key={row.dataElement.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {row.dataElement.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <TextField 
            id={row.dataElement.id}  
            key={row.dataElement.id}
            onChange={(e) => this.handleChange(e)}
            name = "whonetcode[]"
            value={row.dataElement.attributeValues.map( val => val.value)}
          />
          </TableCell>
        </TableRow>
      )) 
    }
    let spinner;
    if(this.state.loading){
      spinner = <LinearProgress />
    }
    return (
      <Paper className={classes.root}  style={styleProps.styles.tableScroll}>
        <form onSubmit={(e) => this.handleSubmit(e)} id="whonetsetting">
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h2> Data Elements</h2></strong>
              </TableCell>
              <TableCell style={styleProps.styles.tableHeader}> 
                <strong><h2> WHONET Codes </h2></strong> 
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>            
            {tabaleData}             
          </TableBody>          
        </Table>
        <input type="submit" value="Save Elements" style={styleProps.styles.submitButton}/>
        </form> 
        {spinner}
      </Paper>
    );
  }          
}

export default DataElementsTable;