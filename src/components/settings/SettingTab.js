import React from 'react';
import { Tabs, Tab } from '@dhis2/d2-ui-core';
import DataElementsTable from './DataElementsTable';
import AttributesTable from './AttributesTable';
import axios from 'axios';
class SettingTab extends React.Component {
    render(){
        return (
            <div>
                <Tabs>
                    <Tab label='Data Elements'>
                        <DataElementsTable />
                    </Tab>
                    <Tab label='Attributes'>
                        <AttributesTable />
                    </Tab>
                </Tabs>
            </div>
        );
    }
    
}

export default SettingTab;