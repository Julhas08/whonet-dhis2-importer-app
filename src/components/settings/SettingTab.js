import React from 'react';
import { Tabs, Tab } from '@dhis2/d2-ui-core';
import Elements from './multiple-lab/Elements';
import Attributes from './multiple-lab/Attributes';
// import Options from './multiple-lab/Options';
import DataElementsTable from './DataElementsTable';
import AttributesTable from './AttributesTable';
class SettingTab extends React.Component {
    render(){
        let orgUnitId = this.props.orgUnitId;
        let orgUnitName = this.props.orgUnitName;
        let elements, attributes, options;
        if (this.props.settingType === 'multiLab') {
          elements = <Tab label='Data Elements'>
                    <Elements orgUnitId={orgUnitId} orgUnitName={orgUnitName}/> 
                  </Tab>;
          attributes = <Tab label='Attributes'>
                     <Attributes /> 
                  </Tab>;
        } else {
          elements = <Tab label='Data Elements'>
                    <DataElementsTable /> 
                  </Tab>;
          attributes = <Tab label='Attributes'>
                     <AttributesTable /> 
                  </Tab>;
        }
        return (
            <div>
                <Tabs> 
                  {elements}
                  {attributes}
                  {options}
                </Tabs>
            </div>
        );
    }
    
}

export default SettingTab;