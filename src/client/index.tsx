import { init, attributesModule, classModule, datasetModule, eventListenersModule, propsModule, VNode } from 'snabbdom';
import '../../scss/_bootstrap.scss';
import '../../scss/style.scss';
import '../../node_modules/bootstrap/js/dist/dropdown.js';
import '../../node_modules/bootstrap/js/dist/collapse.js';
import { initRouting, RouteHandler, url } from './routing';
import { Auth } from './auth';
import { loadingPage } from './views/loadingPage';
import { Game } from '../game';
import { AuthenticatedHomePage, UnauthenticatedHomePage } from './views/homePage';
import { Application } from './views/application';

const patch = init([
  attributesModule,
  classModule,
  datasetModule,
  eventListenersModule,
  propsModule,
]);

class Client implements RouteHandler {
  readonly #auth: Auth = new Auth();
  readonly #games: Game[] = [];
  #oldNode: VNode | Element;

  constructor(root: HTMLElement) {
    this.#oldNode = root;

    this.#render(loadingPage());

    this.#auth.init().then(() => {
      initRouting(this);
    });
  }

  openHomePage() {
    this.#render(
      this.#auth.identity
        ? <AuthenticatedHomePage games={this.#games} />
        : <UnauthenticatedHomePage />
    );
  }

  login() {
    if (this.#auth.identity) {
      window.location.href = url("/");
    } else {
      this.#auth.login();
    }
  }

  logout() {
    this.#auth.logout().then(() => {
      window.location.href = url("/");
    });
  }

  openGame(id: string) {

  }

  open404Page() {

  }

  #render(vnode: VNode) {
    this.#oldNode = patch(
      this.#oldNode,
      <Application identity={this.#auth.identity}>
        {vnode}
      </Application>
    );
  }
}

export default async function (element: HTMLElement) {
  new Client(element);
}
