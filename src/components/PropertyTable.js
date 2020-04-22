/**
*
* PropertyTable
*
*/

import classNames from 'classnames';

import React from 'react';
import PropTypes from 'prop-types';

import Checkbox from '@material-ui/core/Checkbox';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

const renderValue = (value) => {
  let renderedValue = value;
  if (typeof(renderedValue) === 'object') {
    renderedValue = renderedValue.value;
  }

  switch (renderedValue) {
    case null:
      return 'null';
    case true:
      return 'True';
    case false:
      return 'False';
    default:
      return renderedValue;
  }
};

const styles = makeStyles(
  (theme) => theme.propertyTable
);


function PropertyTable(props) {
  const {
    inspectedObject,
    labelCellStyle,
    onRowClick,
    onSelectionClick,
    selection,
    striped,
  } = props;

  const keys = Object.keys(inspectedObject).sort(
    (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
  );


  const handleCheckboxClick = (key) => (e) => {
    e.stopPropagation();

    if (onSelectionClick) {
      onSelectionClick(key, e.target.checked);
    }
  };

  const classes = styles();

  return (
    <Table>
      <TableBody>
        {keys.map((key, index) => {
          const rowClasses = [];
          if (striped && index % 2) {
            rowClasses.push(classes.rowOdd);
          }

          const rowProps = { key };
          if (onRowClick) {
            rowProps.onClick = () => { onRowClick(key); };
            rowClasses.push(classes.rowInteractive);
          }

          return (
            <TableRow
              className={classNames(rowClasses)}
              {...rowProps}
            >
              {selection &&
                <TableCell className={classNames(classes.cell, classes.selectionCell)}>
                  <Checkbox
                    checked={selection.has(key)}
                    onClick={handleCheckboxClick(key)}
                    size="small"
                  />
                </TableCell>
              }

              <TableCell
                className={classNames(classes.cell, classes.labelCell)}
                style={labelCellStyle}
              >
                {key}
              </TableCell>

              <TableCell className={classes.cell}>
                {renderValue(inspectedObject[key])}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

PropertyTable.propTypes = {
  inspectedObject: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
  labelCellStyle: PropTypes.object,
  onRowClick: PropTypes.func,
  onSelectionClick: PropTypes.func,
  selection: PropTypes.object,
  striped: PropTypes.bool,
};

PropertyTable.defaultProps = {
  striped: false,
};

export default PropertyTable;
