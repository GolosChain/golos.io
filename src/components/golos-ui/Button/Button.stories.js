import React from 'react';
import { storiesOf } from '@storybook/react';

import Button, { ButtonLink } from 'components/golos-ui/Button';
import Icon from 'components/golos-ui/Icon';

storiesOf('Golos UI/Button', module)
  .add('type', () => <Button type="submit">Подписаться</Button>)
  .add('icon', () => (
    <Button>
      <Icon name="tick" height="10" width="14" />
      &nbsp;Подписаться
    </Button>
  ))
  .add('children', () => <Button>Подписаться</Button>)

  .add('light', () => <Button light>Подписаться</Button>)
  .add('neutral', () => <Button neutral>Подписаться</Button>)

  .add('auto', () => <Button auto>Подписаться</Button>)
  .add('small', () => <Button small>Подписаться</Button>)
  .add('link', () => <ButtonLink to="/">Подписаться</ButtonLink>);
