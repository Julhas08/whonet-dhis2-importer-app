import React from 'react';
import { OrgUnitTree } from '@dhis2/d2-ui-org-unit-tree';
class SingleSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: [],
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(event, orgUnit) {
        this.setState(state => {

            if (state.selected[0] === orgUnit.path) {
                return { selected: [] };
            }
            // Callback function return to the parent component
            if(typeof this.state.selected !== 'undefined'){
                  this.props.callbackFromParent(orgUnit.id);
            }

            return { selected: [orgUnit.path] };
        });
    }

    render() {
        return (
            <div>
                <OrgUnitTree
                    root={this.props.root}
                    onSelectClick={this.handleClick}
                    selected={this.state.selected}
                />

            </div>
        );
    }
}

export default SingleSelection;
