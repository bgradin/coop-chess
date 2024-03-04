import page from "page";
import { init, attributesModule, classModule, datasetModule, eventListenersModule, propsModule, VNode } from 'snabbdom';
import { Auth } from "./auth";
import { Routes } from "./routes";
import { Application } from './views/application';
import { AuthenticatedHomePage, UnauthenticatedHomePage } from "./views/homePage";
import { NotFoundPage } from "./views/notFoundPage";
import { GenericErrorPage } from "./views/genericErrorPage";
import { LoadingPage } from "./views/loadingPage";
import { BASE_PATH } from "./constants";
import { Lobby, LobbyEvents } from "./lobby";

const patch = init([
  attributesModule,
  classModule,
  datasetModule,
  eventListenersModule,
  propsModule,
]);

export class Router {
  readonly #auth: Auth;
  #page: string = "home";
  #oldNode: VNode | Element;
  #initialized: Boolean = false;
  #lobby?: Lobby;

  constructor(auth: Auth, root: Element) {
    this.#auth = auth;
    this.#oldNode = root;
    this.redraw = this.redraw.bind(this);
  }

  init() {
    if (this.#initialized) {
      return;
    }

    page.base(BASE_PATH);

    page(Routes.Home, async _ => {
      this.#page = "home";
      this.redraw();
    });

    page(Routes.Login, async _ => {
      if (this.#auth.identity) {
        page.show(Routes.Home);
      } else {
        this.#auth.login();
      }
    });

    page(Routes.Logout, async _ => {
      this.#auth.logout().then(() => {
        page.show(Routes.Home);
      });
    });

    page(Routes.Game, ctx => {
    });

    page (Routes.Error, _ =>  {
      this.#page = "error";
      this.redraw();
    });

    page(Routes.NotFound, _ => {
      this.#page = "notFound";
      this.redraw();
    });

    page({ hashbang: true, click: false });
    this.#initialized = true;
  }

  renderGenericError() {
    this.#render(<GenericErrorPage />);
  }

  setLobby(lobby?: Lobby) {
    this.#lobby?.removeEventListener(LobbyEvents.Updated, this.redraw);
    this.#lobby = undefined;

    if (lobby) {
      this.#lobby = lobby;
      this.#lobby.addEventListener(LobbyEvents.Updated, this.redraw);
    }
  }

  #getCurrentView() {
    switch (this.#page) {
      case "home":
        if (this.#auth.loading) {
          return <LoadingPage />
        }

        return this.#auth.identity && this.#lobby
          ? <AuthenticatedHomePage lobby={this.#lobby} />
          : <UnauthenticatedHomePage />;
      case "error":
        return <GenericErrorPage />
      default:
        return <NotFoundPage />;
    }
  }

  redraw() {
    this.#render(this.#getCurrentView());
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
