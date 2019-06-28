import React from 'react';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import * as styleProps  from '../ui/Styles';
import * as config  from '../../config/Config';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
export default class CsvMappingColumns extends React.Component {
	render () {
        const classes = this.props;
        let data = Object.entries(this.props.csvData);
        let mapCode = "";
        let dataValues = data.map( (value, key) =>{
            let resultMappedElement = this.props.dataElements.filter(function(element) {                
                return element.dataElement.code === value[0]
                              
            });
            let attributesFilterResult = this.props.attributes.filter(function(attribute) {
                return attribute.code === value[0];                             
            });
            if(resultMappedElement.length > 0){
                mapCode = resultMappedElement[0].dataElement.code;
            } else if(attributesFilterResult.length > 0){
                mapCode = attributesFilterResult[0].code;
            } else {
                mapCode = "";
            }
            
            return (
                <TableRow key={key}>
                  <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
                    {key+1}
                  </TableCell>
                  <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
                    {value[0]}
                  </TableCell>
                  <TableCell component="th" scope="row" style={styleProps.styles.tableHeader}>
                    <p style={styleProps.styles.colors.color2}> {mapCode} </p>
                  </TableCell>
                </TableRow>
              )
        });
        
		return (
            <div>
                <Card style={styleProps.styles.csvMappingCard}>
                    <CardText style={styleProps.styles.cardText}>
                        <h3 style={styleProps.styles.cardHeaderMapping}>FOLLOWING MAPPINGS WERE FOUND IN CSV </h3>
                        <p style={styleProps.styles.colors.color1}>{"Required Fields: " + config.requiredColumns} </p>
                        <Table className={classes.table}>
                          <TableHead>
                            <TableRow>
                              <TableCell style={styleProps.styles.tableHeader}> 
                                <strong><h3>S/N </h3></strong>
                              </TableCell>
                              <TableCell style={styleProps.styles.tableHeader}> 
                                <strong><h3>YOUR SELECTED FILE HEADER </h3></strong>
                              </TableCell>
                              <TableCell style={styleProps.styles.tableHeader}> 
                                <strong><h3> MAPPING CODE IN DHIS2 </h3></strong>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>            
                            {dataValues}             
                          </TableBody>          
                        </Table>   
                    </CardText>
                </Card>
            </div>
		);
	}
}