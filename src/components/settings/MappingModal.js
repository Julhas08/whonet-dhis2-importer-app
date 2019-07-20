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
    let modalTitle;
    if (this.props.settingType === 'multiLab') {
      modalTitle = <h3 style={styleProps.styles.cardHeaderModal}> MULTIPLE LAB-SETTING <br /> Lab Name: {orgUnitName} <br /> Lab Unique Code: {orgUnitId}<Close style={styleProps.styles.closeIcon} onClick={this.props.handleModal}/></h3>;

    } else {
      modalTitle = <h3 style={styleProps.styles.cardHeaderModal}> WHONET DHIS2 INTEGRATION APP-SETTING <br /> <Close style={styleProps.styles.closeIcon} onClick={this.props.handleModal}/></h3>;
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
                {modalTitle}
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