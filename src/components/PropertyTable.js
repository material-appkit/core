import clsx from 'clsx';

import React, { useCallback, useEffect, useState } from 'react';
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
  const classes = styles();

  const {
    data,
    inspectedObject,
    labelCellStyle,
    onRowClick,
    onSelectionClick,
    selection,
    striped,
  } = props;

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (inspectedObject) {
      const orderedKeys = Object.keys(inspectedObject).sort(
        (a, b) => a.toLowerCase().localeCompare(b.toLowerCase())
      );

      setTableData(orderedKeys.map((key) => ({
        key,
        label: key,
        value: renderValue(inspectedObject[key])
      })));
    }
  }, [inspectedObject]);


  useEffect(() => {
    if (Array.isArray(data)) {
      setTableData(data);
    }
  }, [data]);


  const handleCheckboxClick = useCallback((key) => (e) => {
    e.stopPropagation();

    if (onSelectionClick) {
      onSelectionClick(key, e.target.checked);
    }
  }, [onSelectionClick]);

  return (
    <Table className={classes.table} padding="none">
      <TableBody>
        {tableData.map((rowInfo, index) => {
          const { key, label, value } = rowInfo;

          const rowClasses = [classes.row];
          if (striped) {
            rowClasses.push(index % 2 ? classes.rowOdd : classes.rowEven);
          }

          const rowProps = { key };
          if (onRowClick) {
            rowProps.onClick = () => onRowClick(key);
            rowClasses.push(classes.rowInteractive);
          }

          return (
            <TableRow className={clsx(rowClasses)} {...rowProps}>
              {selection &&
                <TableCell className={clsx(classes.cell, classes.selectionCell)}>
                  <Checkbox
                    checked={!!selection[key]}
                    onClick={handleCheckboxClick(key)}
                    size="small"
                  />
                </TableCell>
              }

              <TableCell
                className={clsx(classes.cell, classes.labelCell)}
                style={labelCellStyle}
              >
                {label}
              </TableCell>

              <TableCell className={clsx(classes.cell, classes.valueCell)}>
                {value}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

PropertyTable.propTypes = {
  data: PropTypes.array,
  inspectedObject: PropTypes.object,
  labelCellStyle: PropTypes.object,
  onRowClick: PropTypes.func,
  onSelectionClick: PropTypes.func,
  selection: PropTypes.object,
  striped: PropTypes.bool,
};

PropertyTable.defaultProps = {
  striped: false,
};

export default React.memo(PropertyTable);
