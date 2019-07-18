import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Card from 'material-ui/Card/Card';
import CardText from 'material-ui/Card/CardText';
import Tabs from './SettingTab';
import Close from '@material-ui/icons/Close';
import * as styleProps  from '../ui/Styles';

class MappingModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: props.isModalOpen,
    };    
  }  

  render() {
    let orgUnitId = this.props.orgUnitId;
    let orgUnitName = this.props.orgUnitName;
    let modalTitle ="";
    if (this.props.settingType === 'multiLab') {
      modalTitle = "MULTIPLE LAB-SETTING";

    } else {
      modalTitle = "WHONET DHIS2 INTEGRATION APP-SETTING";
    }
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
                <h3 style={styleProps.styles.cardHeaderModal}> {modalTitle} <br /> Lab Name: {orgUnitName} <br /> Lab Unique Code: {orgUnitId}<Close style={styleProps.styles.closeIcon} onClick={this.props.handleModal}/></h3>
                <Tabs settingType={this.props.settingType} orgUnitId={orgUnitId} orgUnitName={orgUnitName}/>
              </CardText>
          </Card>    
        </Modal>
      </div>
    );
  }
}

MappingModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

// We need an intermediary variable for handling the recursive nesting.
const MappingModalWrapped = withStyles(styleProps.styles)(MappingModal);

export default MappingModalWrapped;