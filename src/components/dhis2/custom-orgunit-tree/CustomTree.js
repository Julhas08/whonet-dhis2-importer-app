import React, { Component } from "react";
import TreeCheckbox from "./TreeCheckbox";

export default class CustomOrgUnitTreeView extends Component {
  constructor (props) {
    super(props);
    this.state = {
      visible: true
    }
  }
  changeHandler = (value, id) => {
    if (value) {
      this.props.onSelect(id);
    } else {
      // handle de-select
    }
  };  
  render=()=>{
    var children;
    // const isChecked = index === selectedId;
    if (this.props.node.children != null) {
      children = this.props.node.children.map(function(node, index) {
        return <li key={index}><CustomOrgUnitTreeView node={node} /></li>
      });
    }

    var style = {};
    if (!this.state.visible) {
      style.display = "none";
    }

    return (
      <div>
        <h5 onClick={this.toggle}>
          {this.props.node.name}
        </h5>
        <ul style={style}>
          {children}
        </ul>
      </div>
    );
  }
  toggle=()=>{
    this.setState({visible: !this.state.visible});
  }
}
