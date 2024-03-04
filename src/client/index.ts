import { Socket, io } from "socket.io-client"
import '../../scss/_bootstrap.scss';
import '../../scss/style.scss';
import '../../node_modules/bootstrap/js/dist/dropdown.js';
import '../../node_modules/bootstrap/js/dist/collapse.js';
import { Router } from './router';
import { Auth, AuthEvents } from './auth';
import { Events } from '../events';
import { Response, StatusCode } from '../communication';
import { showGenericError } from "./helpers"
import { Lobby } from "./lobby";
import { Routes } from "./routes";

const SERVER_DOMAIN = `${location.hostname}:3000/`;

class Client {
  readonly #auth: Auth = new Auth();
  readonly #router: Router;
  #socket?: Socket;

  constructor(root: HTMLElement) {
    this.#router = new Router(this.#auth, root);
    this.#router.init();

    this.#auth.addEventListener(AuthEvents.Authenticated, () => {
      this.#router.redraw();
      this.#socket = io(SERVER_DOMAIN);
      this.#socket.on("connect", () => {
        this.#identify()
          .catch(() => {
            this.#router.renderGenericError();
          });
      });

      this.#socket.on("disconnect", () => {
        this.#auth.loading = true;
        this.#router.redraw();
      });
    });

    this.#auth.addEventListener(AuthEvents.Unauthenticated, () => {
      this.#socket?.close();
      this.#socket = undefined;
      this.#router.setLobby(undefined);
      page.show(Routes.Home);
    });

    this.#auth.init()
      .then(() => {
        this.#router.redraw();
      })
      .catch(() => {
        this.#router.renderGenericError();
      });
  }

  async #identify() {
    return new Promise<void>((resolve, reject) => {
      if (!this.#auth.identity || !this.#socket) {
        reject();
        return;
      }

      this.#socket.emit(Events.Identify, this.#auth.identity, (res: Response) => {
        if (res.status !== StatusCode.Ok || !this.#socket) {
          showGenericError();
        } else {
          this.#auth.loading = false;
          this.#router.setLobby(new Lobby(this.#socket));
          this.#router.redraw();
          resolve();
        }
      });
    });
  }
}

export default async function (element: HTMLElement) {
  new Client(element);
}
