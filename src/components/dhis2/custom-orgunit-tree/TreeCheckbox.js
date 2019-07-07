import React, { Component } from "react";

export default class TreeCheckbox extends Component {
  changeHandler = (value, id) => {
    if (value) {
      this.props.onSelect(id);
    } else {
      // handle de-select
    }
  };

  render() {
    const { rowData, selectedId } = this.props;
    const { id, name, url } = rowData;
    const isChecked = id === selectedId;

    return (
      <tr>
        <td>
          <input
            id={`checkbox_${id}`}
            checked={isChecked}
            onChange={e => this.changeHandler(e.target.checked, id)}
            type="checkbox"
            name="record"
          />
        </td>
        <td>{name}</td>
        <td>{url}</td>
      </tr>
    );
  }
}
