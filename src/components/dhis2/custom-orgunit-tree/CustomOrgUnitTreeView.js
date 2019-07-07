import React, { Component } from "react";
import TreeCheckbox from "./TreeCheckbox";

export default class CustomOrgUnitTreeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: 0
    };
  }

  changeHandler = (id,value) => {
    this.setState({
      selectedId: id
    });
    this.props.callbackFromParent(id);
  };

  render() {
    let treeBox;
    if(typeof this.props.orgUnits !== 'undefined' || this.props.orgUnits.isArray()){
      treeBox = this.props.orgUnits.map(rowData => (
        <TreeCheckbox
          key={rowData.id}
          selectedId={this.state.selectedId}
          rowData={rowData}
          onSelect={this.changeHandler}
        />
      ))
    }
    return (
      <table>
        <tbody>
          {treeBox}
        </tbody>
      </table>
    );
  }
}
