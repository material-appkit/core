import { observer } from 'mobx-react';

import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';


const VirtualizedList = (props) => {
  const { classes } = props;

  const loadMoreProgressIndicator = (
    <ListItem className={props.classes.loadProgressListItem} key="loadMoreProgressIndicator">
      <CircularProgress color="primary" size={30} thickness={5} />
    </ListItem>
  );

  return (
    <List className={classes.root}>
      {(props.store && props.store.items) ? (
        <InfiniteScroll
          initialLoad={false}
          pageStart={1}
          loadMore={(page) => { props.store.loadMore(page); }}
          hasMore={!props.store.isLoaded}
          loader={loadMoreProgressIndicator}
        >
          {props.store.items.map((item) => (
            <props.componentForItem
              key={item.id}
              item={item}
            />
          ))}
        </InfiniteScroll>
      ) : (
        <React.Fragment>
          {loadMoreProgressIndicator}
        </React.Fragment>
      )}
    </List>
  );
};

VirtualizedList.propTypes = {
  classes: PropTypes.object,
  componentForItem: PropTypes.func.isRequired,
  store: PropTypes.object,
};

export default withStyles((theme) => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },

  loadProgressListItem: {
    justifyContent: 'center',
  },
}))(observer(VirtualizedList));
