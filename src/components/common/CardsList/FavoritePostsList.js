import { connect } from 'react-redux';
import { createSelector } from 'reselect';

import { UIModeSelector } from 'store/selectors/ui';
import { dataSelector } from 'store/selectors/common';
import CardsList from './CardsList.connect';

export default connect(
  createSelector(
    [dataSelector('favorites'), state => UIModeSelector('layout')(state)],
    (favorites, layout = 'list') => {
      const { isLoading, postsList } = favorites;

      return {
        isFavorite: true,
        layout,
        isLoading,
        items: postsList,
      };
    }
  )
)(CardsList);
