import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import * as styleProps  from '../ui/Styles';

export default class ImportResults extends React.Component {
	render () {
		let tableData;
		if(this.props.teiResponse.status === 'ERROR'){
			tableData = <Table>
	          <TableBody>            
	            <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Imported
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
		          0
		          </TableCell>
		        </TableRow>   
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Ignored
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          0
		          </TableCell>
		        </TableRow>
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Deleted
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		          0
		          </TableCell>
		        </TableRow>  
		        <TableRow>
		          <TableCell style={styleProps.styles.tableHeader}>
		          Error
		          </TableCell> 
		          <TableCell style={styleProps.styles.tableHeader}>
		           1
		          </TableCell>
		        </TableRow>            
	          </TableBody>          
	        </Table>
		} else {
			tableData = <Table>
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
		          Deleted
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
		}

		return (
            <div>
            	{tableData}
            </div>
		);
	}
}
