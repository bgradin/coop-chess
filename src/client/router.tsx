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
import { url } from "./helpers"

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


  constructor(auth: Auth, root: Element) {
    this.#auth = auth;
    this.#oldNode = root;
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
        window.location.href = url("/");
      } else {
        this.#auth.login();
      }
    });

    page(Routes.Logout, async _ => {
      this.#auth.logout().then(() => {
        window.location.href = url("/");
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

    page({ hashbang: true });
    this.#initialized = true;
  }

  renderGenericError() {
    this.#render(<GenericErrorPage />);
  }

  #getCurrentView() {
    switch (this.#page) {
      case "home":
        if (this.#auth.loading) {
          return <LoadingPage />
        }

        return this.#auth.identity
          ? <AuthenticatedHomePage games={[]} />
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
