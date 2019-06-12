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

class OptionsTable extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      value   : '',
      loading : false,props
    };
    this.handleChange = this.handleChange.bind(this);
  }
  
  handleChange(e) {
    this.setState({value: e.target.value});
  }

  render(){
    const classes = this.props;
    let tabaleData;
    if(typeof this.props.options !== 'undefined' || this.props.options.length !== 0){
    tabaleData = 
      this.props.options.map(row => (
        <TableRow key={row.id}>
          <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
            {row.name}
          </TableCell>
          <TableCell style={styleProps.styles.tableHeader}>
          <TextField 
            id={row.id}  
            key={row.id}
            onChange={(e) => this.handleChange(e)}
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
                <strong><h2> Options</h2></strong>
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
        <input type="submit" value="Save Options" style={styleProps.styles.submitButton}/>
        </form> 
        {spinner}
      </Paper>
    );
  }          
}

export default OptionsTable;