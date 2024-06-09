import PropTypes from 'prop-types';
import React, { useState } from 'react';

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = makeStyles((theme) => ({
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(0.5),
  },

  label: {
    ...theme.mixins.filterFieldLabel,

    color: theme.palette.primary.main,
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  valueLabel: theme.mixins.filterFieldValue,

  disclosureButton: {
    justifyContent: 'flex-start',
    padding: 0,
  },

  disclosureButtonStartIcon: {
    margin: 0,
  },

}));

function ExpandableBox(props) {
  const classes = styles();

  const {
    defaultExpanded = false,
  } = props;

  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div>
      <header className={classes.header}>
        <Button
          classes={{
            root: classes.disclosureButton,
            label: classes.label,
            startIcon: classes.disclosureButtonStartIcon,
          }}
          disableRipple
          disableFocusRipple
          onClick={() => setExpanded(!expanded)}
          startIcon={expanded ? (
            <ExpandMoreIcon />
          ) : (
            <ChevronRightIcon />
          )}
        >
          {props.label}
        </Button>

        {props.valueLabel &&
          <Typography className={classes.valueLabel}>
            {props.valueLabel}
          </Typography>
        }
      </header>

      {expanded &&
        props.children
      }
    </div>
  );
}

ExpandableBox.propTypes = {
  children: PropTypes.any,
  defaultExpanded: PropTypes.bool,
  label: PropTypes.string,
  valueLabel: PropTypes.string,
};


export default React.memo(ExpandableBox);
