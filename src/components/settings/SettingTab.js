import React from 'react';
import { Tabs, Tab } from '@dhis2/d2-ui-core';
import DataElementsTable from './DataElementsTable';
import AttributesTable from './AttributesTable';
import OptionsTable from './OptionsTable';
import * as config  from '../../config/Config';
import axios from 'axios';
import { 
    getPrograms,
    getAttributes,
    getOptionsInOptionGroups
} from '../api/API';
class SettingTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
          dataElements: [],
          attributes: [],
          optionList: [],
          error     : false,
        };
    }
    componentDidMount(){
        let self = this;
        getPrograms().then((response) => {
          self.setState({
            dataElements : response.data.programs[0].programStages[0].programStageDataElements       
          }); 
        }).catch(error => this.setState({error: true}));

        getAttributes().then((response) => {
          self.setState({
            attributes   : response.data.trackedEntityAttributes
          });
        }).catch(error => this.setState({error: true}));

        getOptionsInOptionGroups().then((response) => {
          self.setState({
            optionList   : response.data.options        
          }); 
        }).catch(error => this.setState({error: true}));
    }
    render(){
        /*console.log("dataElements: ", this.state.dataElements);
        console.log("attributes: ", this.state.attributes);
        console.log("options: ", this.state.optionList);*/
        let elementsTab, attributesTab, optionsTab;
        if(typeof this.state.dataElements !== 'undefined'){
            elementsTab = <DataElementsTable dataElements = {this.state.dataElements}/>;
        } if(typeof this.state.attributes !== 'undefined'){
            attributesTab = <AttributesTable attributes = {this.state.attributes}/>;
        } if(typeof this.state.optionList !== 'undefined'){
            optionsTab = <OptionsTable options = {this.state.optionList}/>;
        }  
        return (
            <div>
                <Tabs>
                    <Tab label='Data Elements'>
                        {elementsTab}
                    </Tab>
                    <Tab label='Attributes'>
                        {attributesTab}
                    </Tab>
                    <Tab label='Options'>
                        {optionsTab}
                    </Tab>
                </Tabs>
            </div>
        );
    }
    
}

export default SettingTab;