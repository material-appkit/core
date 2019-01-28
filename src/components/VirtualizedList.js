import { observer } from 'mobx-react';

import PropTypes from 'prop-types';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';

import CircularProgress from '@material-ui/core/CircularProgress';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import withStyles from '@material-ui/core/styles/withStyles';

class VirtualizedList extends React.Component {
  constructor(props) {
    super(props);

    this.loadMoreProgressIndicator = (
      <ListItem className={props.classes.loadProgressListItem} key="loadMoreProgressIndicator">
        <CircularProgress color="primary" size={30} thickness={5} />
      </ListItem>
    );
  }

  render() {
    const { classes } = this.props;

    return (
      <List className={classes.list}>
        {(this.props.store && this.props.store.items) ? (
          <InfiniteScroll
            initialLoad={false}
            pageStart={1}
            loadMore={(page) => { this.props.store.loadMore(page); }}
            hasMore={!this.props.store.isLoaded}
            loader={this.loadMoreProgressIndicator}
          >
            {this.props.store.items.map((item) => (
              <this.props.componentForItem
                key={item.id}
                item={item}
                onItemClick={this.props.onItemClick}
                contextProvider={this.props.itemContextProvider}
              />
            ))}
          </InfiniteScroll>
        ) : (
          <React.Fragment>
            {this.loadMoreProgressIndicator}
          </React.Fragment>
        )}
      </List>
    );
  }
}

VirtualizedList.propTypes = {
  classes: PropTypes.object.isRequired,
  componentForItem: PropTypes.func.isRequired,
  itemContextProvider: PropTypes.func,
  onItemClick: PropTypes.func,
  selectionMode: PropTypes.oneOf(['single', 'multiple']),
  store: PropTypes.object.isRequired,
};

VirtualizedList.defaultProps = {
  selectionMode: 'single',
};

export default withStyles((theme) => ({
  list: theme.listView.list,

  loadProgressListItem: {
    justifyContent: 'center',
  },
}))(observer(VirtualizedList));
