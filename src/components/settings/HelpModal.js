import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import Close from '@material-ui/icons/Close';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import * as styleProps  from '../ui/Styles';

class HelpModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.isModalOpen,
    };    
  }  

  render() {
    return (
      <div>
        <Modal
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
          open={this.state.open}
          onClose={this.handleClose}

        >
          <Card style={styleProps.styles.cardModal}>
              <CardText style={styleProps.styles.cardText}>
              <h3 style={styleProps.styles.cardHeaderModal}> TRACKER EVENT - WHONET DATA IMPORT HELP <Close style={styleProps.styles.closeIcon} onClick={this.props.handleModal}/></h3>
              <p style={styleProps.styles.modalInnerScroll}>
              <p> The Tracker Event Data loader handles bulk import of TEI event data based on a simple, easy-to-use csv template. </p>
              <h2> CSV Format </h2>
                <h3>Required Columns</h3>
                <ul>
                  <li> Sample collection date - </li>
                  <li> Hospital department - </li>
                  <li> Location - </li>
                  <li> Type of infection - </li>
                  <li> OPD visit / Admission date - </li>
                  <li> Lab Sample ID</li>
                  <li> Sample type  </li>
                  <li> Organism  </li>
                  <li> Identification Method  </li>
                </ul>
                <h3> Optional Columns</h3>
                <ul>
                  <li> AMR Id </li>
                  <li> Admission history  </li>
                  <li> Clinical diagnosis </li>
                  <li> Comorbidity </li>
                  <li> Patient with devices </li>
                  <li> Antibiotics / Antifungals (Taken for 3 days in last 1 month) </li>
                  <li> MIC </li>
                  <li> Results</li>
                </ul>
                <h3> Example </h3>
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell style={styleProps.styles.tableHeader}> 
                      <strong> Patint Id </strong>
                    </TableCell>
                    <TableCell style={styleProps.styles.tableHeader}> 
                      <strong> Sex  </strong> 
                    </TableCell>
                    <TableCell style={styleProps.styles.tableHeader}> 
                      <strong> Age  </strong> 
                    </TableCell>
                    <TableCell style={styleProps.styles.tableHeader}> 
                      <strong> Department  </strong> 
                    </TableCell>
                    <TableCell style={styleProps.styles.tableHeader}> 
                      <strong> Ward type  </strong> 
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>            
                  <TableRow>
                    <TableCell>
                      PATIENT_ID
                    </TableCell>
                    <TableCell>
                      SEX
                    </TableCell>
                    <TableCell>
                      AGE
                    </TableCell> 
                    <TableCell>
                      DEPARTMENT
                    </TableCell> 
                    <TableCell>
                      WARD_TYPE
                    </TableCell>          
                  </TableRow>             
                </TableBody>          
              </Table>

              <h2> Technical Requirements first time in app configuration </h2>
                <h3>Required Elements UID</h3>
                <ul>
                  <li> Program UID </li>
                  <li> Organisation Unit UID </li>
                  <li> Tracked Entity Instance UID </li>
                  <li> Tracked Entity Type UID </li>
                  <li> Program Stage UID </li>
                  <li> MetaAttribute Name - Whonet Codes</li>
                  <li> MetaAttributeU Id - "e5naGkHZ5qv" </li>
                </ul>
                <h3> Optional Elements</h3>
                <ul>
                  <li> Event Date </li>
                  <li> Incident Date </li>
                  <li> EnrollmentDate </li>
                  <li> Enrollment Status </li>
                  <li> Status </li>
                  <li> Stored By </li>
                  <li> DataValues - Data Element1 UID </li>
                  <li> DataValues - Data Element2 UID </li>
                  <li> DataValues - Data Element3 UID </li>
                  <li> Please note the Data Element UID will be part of the CSV columns </li>
                </ul>

              </p>
              </CardText>
          </Card>    
        </Modal>
      </div>
    );
  }
}

HelpModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const HelpModalWrapped = withStyles(styleProps.styles)(HelpModal);

export default HelpModalWrapped;