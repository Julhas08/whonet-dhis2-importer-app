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

class AttributesTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,props
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(id, e) {
    if(e.target.value !== null || e.target.value !== ''){
      console.log("id: ", id);
      console.log("e.target.value: ", e.target.value);
      this.setState({value: e.target.value});
    }
    
  }
  render(){
    const classes = this.props;
    let tabaleData;
    //console.log("this.props.attributes: ", this.props.attributes);
    if(typeof this.props.attributes !== 'undefined' || this.props.attributes.length !== 0){
    /*this.props.attributes.map(row => (
      
      axios.get(config.baseUrl+'api/trackedEntityAttributes/'+row.id+'.json?fields=id,code,name', config.fetchOptions)
      .then(function (response) {
        // handle success
        console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      }) 
    ))*/ 
    tabaleData = 
      this.props.attributes.map(row => (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {row.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <TextField 
            id={row.id}  
            key={row.id}
            onMouseLeave={(e) => this.handleChange(row.id, e)}
            name = "whonetcode[]"
            value={row.attributeValues.map( val => val.value)}
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
                <strong><h2> Atrributes</h2></strong>
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
        <input type="submit" value="Save Attributes" style={styleProps.styles.submitButton}/>
        </form> 
        {spinner}
      </Paper>
    );
  }          
}

export default AttributesTable;