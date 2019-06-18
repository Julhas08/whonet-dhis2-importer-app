import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as styleProps  from '../ui/Styles';

export default class ImportResults extends React.Component {
	constructor (props) {
		super(props);

	}
	render () {
		return (
            <div>
              <Table>
	          <TableBody>            
	            <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Imported
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          {this.props.teiResponse.response.imported}
		          </TableCell>
		        </TableRow>   
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Pending
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          0
		          </TableCell>
		        </TableRow>
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Updated
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          {this.props.teiResponse.response.updated}
		          </TableCell>
		        </TableRow>   
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Ignored
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          {this.props.teiResponse.response.ignored}
		          </TableCell>
		        </TableRow>
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Warning
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          0
		          </TableCell>
		        </TableRow>  
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Total
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          {this.props.teiResponse.response.total}
		          </TableCell>
		        </TableRow>            
	          </TableBody>          
	        </Table>
            </div>
		);
	}
}
