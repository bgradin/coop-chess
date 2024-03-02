import { VNode } from 'snabbdom';
import { Navigation } from '../navigation';
import { Renderer } from '../interfaces';
import layout from './layout';
import { renderGame } from './game';
import { renderHome } from './home';

export default function view(navigation: Navigation): VNode {
  return layout(navigation, selectRenderer(navigation)(navigation));
}

const selectRenderer = (navigation: Navigation): Renderer => {
  if (navigation.page == 'game') return navigation.game ? renderGame(navigation.game) : renderLoading;
  if (navigation.page == 'home') return renderHome;
  return renderNotFound;
};

const renderLoading: Renderer = _ => loadingBody();

const renderNotFound: Renderer = _ => <h1>Not found</h1>;

export const loadingBody = () => <div className='loading'>{ spinner() }</div>;

export const spinner = () =>
  <div className='spinner-border text-primary' role='status'>
    <span className='visually-hidden'>
      Loading...
    </span>
  </div>;