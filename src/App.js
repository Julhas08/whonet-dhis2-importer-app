import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { App as D2UIApp, mui3theme as dhis2theme } from '@dhis2/d2-ui-core';
import HeaderBar from './components/dhis2/header-bar';
import OrgUnitTree from './components/dhis2/org-unit-tree';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            d2: props.d2,
            baseURL: props.baseURL
        };
    }

    getChildContext() {
        return { d2: this.state.d2 };
    }

    render() {
        if (!this.state.d2) {
            console.log('no');
            return null;
        }

        return (
            <D2UIApp>
                <MuiThemeProvider theme={createMuiTheme(dhis2theme)}>
                    <br /> <br /><br />
                    <HeaderBar d2={this.state.d2}/> 
                    <OrgUnitTree d2={this.state.d2} />
                </MuiThemeProvider>
            </D2UIApp>
        );
    }
}

App.childContextTypes = {
    d2: PropTypes.object,
};

App.propTypes = {
    d2: PropTypes.object.isRequired,
};
export default App;
