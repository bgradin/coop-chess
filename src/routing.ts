import { Navigation } from './navigation';
import page from 'page';

export default function (navigation: Navigation) {
  page.base(BASE_PATH);
  page('/', async ctx => {
    // Remove OAuth token if it exists
    if (ctx.querystring.includes('code=liu_')) {
      history.pushState({}, '', BASE_PATH || '/');
    }
    navigation.openHome();
  });
  page('/login', async _ => {
    if (navigation.auth.me) return page('/');
    await navigation.auth.login();
  });
  page('/logout', async _ => {
    await navigation.auth.logout();
    location.href = BASE_PATH;
  });
  page('/game/:id', ctx => {
    navigation.openGame(ctx.params.id);
  });
  page({ hashbang: true });
}

export const BASE_PATH = location.pathname.replace(/\/$/, '');

export const url = (path: string) => `${BASE_PATH}${path}`;
export const href = (path: string) => ({ href: url(path) });