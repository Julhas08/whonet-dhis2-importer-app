import React from 'react';
import { Tabs, Tab } from '@dhis2/d2-ui-core';
import DataElementsTable from './DataElementsTable';
import AttributesTable from './AttributesTable';
import OptionsTable from './OptionsTable';
import * as config  from '../../config/Config';
import axios from 'axios';

class SettingTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {   
          dataElements: [],
          attributes: [],
          optionList: [],
        };
    }
    componentDidMount(){
        let self = this;
        axios.all([
         axios.get(config.baseUrl+'api/programs.json?filter=id:eq:'+config.programId+'&fields=id,name,programStages[id,name,programStageDataElements[dataElement[id,name,code,attributeValues[value,attribute[id,name]]]]]&paging=false',config.fetchOptions),
         // axios.get(config.baseUrl+"api/programs/'+config.programId+'.json?fields=id,name,displayName,programTrackedEntityAttributes[id,name,code,displayName]",config.fetchOptions),
         axios.get(config.baseUrl+"api/trackedEntityAttributes.json?fields=id,name,code,attributeValues[value,attribute]",config.fetchOptions),
         axios.get(config.baseUrl+'api/optionGroups/'+config.optionGroupsId+'.json?fields=id,name,code,options[:id,name,code,attributeValues]',config.fetchOptions),
        ])
        .then(axios.spread(function (elements, attributes, options) {
          self.setState({
            dataElements : elements.data.programs[0].programStages[0].programStageDataElements,
            // attributes   : attributes.data.programTrackedEntityAttributes,
            attributes   : attributes.data.trackedEntityAttributes,
            optionList   : options.data.options,        
          });      

        }))
        .catch(error => this.setState({error: true}));

        }
    render(){
        //console.log("dataElements: ", this.state.dataElements);
        //console.log("attributes: ", this.state.attributes);
        console.log("options: ", this.state.optionList);
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