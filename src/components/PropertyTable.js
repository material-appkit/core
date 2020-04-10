/**
*
* PropertyTable
*
*/

import classNames from 'classnames';

import React from 'react';
import PropTypes from 'prop-types';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';

import { titleCase } from '../util/string';

const transformModelValue = (value) => {
  switch (value) {
    case null:
      return 'null';
    case true:
      return 'True';
    case false:
      return 'False';
    default:
      return value;
  }
};

const styles = makeStyles((theme) => ({
  cell: {
    fontSize: theme.typography.pxToRem(13),
    padding: `${theme.spacing(0.5)}px ${theme.spacing(1)}px`,
  },

  labelCell: {
    fontWeight: 500,
  },

  rowOdd: {
    backgroundColor: theme.palette.grey[100],
  }
}));

function PropertyTable(props) {
  const classes = styles();

  const { inspectedObject, striped } = props;
  const keys = Object.keys(inspectedObject).sort();

  return (
    <Table>
      <TableBody>
        {keys.map((key, index) => {
          let rowClasses = [];
          if (striped && index % 2) {
            rowClasses.push(classes.rowOdd);
          }

          return (
            <TableRow key={key} className={classNames(rowClasses)}>
              <TableCell className={classNames(classes.cell, classes.labelCell)}>
                {titleCase(key)}
              </TableCell>
              <TableCell className={classes.cell}>
                {transformModelValue(inspectedObject[key])}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

PropertyTable.propTypes = {
  striped: PropTypes.bool,
  inspectedObject: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object,
  ]).isRequired,
};

PropertyTable.defaultProps = {
  striped: false,
};

export default PropertyTable;
