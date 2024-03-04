import { Socket, io } from "socket.io-client"
import '../../scss/_bootstrap.scss';
import '../../scss/style.scss';
import '../../node_modules/bootstrap/js/dist/dropdown.js';
import '../../node_modules/bootstrap/js/dist/collapse.js';
import { Routes } from "./routes";
import { Router } from './router';
import { Auth, AuthEvents } from './auth';
import { Events } from '../events';
import { Response, StatusCode } from '../communication';
import { url } from "./helpers"

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
    });

    this.#auth.addEventListener(AuthEvents.Unauthenticated, () => {
      this.#socket?.close();
      this.#socket = undefined;
      window.location.href = url("/");
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
        if (res.status !== StatusCode.Ok) {
          window.location.href = url(Routes.Error);
        } else {
          this.#auth.loading = false;
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
