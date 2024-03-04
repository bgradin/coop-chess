import { EventEmitter } from "node:events";
import { Socket } from "socket.io";
import { Events } from "../events";
import { GameConfiguration } from "../game";
import { Lobby } from "./lobby";
import { log } from "./logging";
import { PlayerIdentity } from "../player";
import { BadRequestResponse, Callback, GameStateResponse, OkResponse } from "../communication";
import { validateDto } from "./validation";

export enum SessionEvents {
  Close = "close",
}

export class Session extends EventEmitter {
  readonly #socket: Socket;
  readonly #lobby: Lobby;
  #identity?: PlayerIdentity;

  constructor(socket: Socket, lobby: Lobby) {
    super();

    this.#socket = socket;
    this.#lobby = lobby;

    this.#registerSocketEvents();
  }

  #close() {
    this.emit(SessionEvents.Close);
  }

  #identify(identity: PlayerIdentity, respond: Callback) {
    if (!validateDto(identity, "PlayerIdentityDto")) {
      log.warn(`Invalid identity received for socket ${this.#socket.id}`);

      respond(new BadRequestResponse());
      return;
    }

    this.#identity = identity;

    log.info(`Socket ${this.#socket.id} identified: ${this.#identity.id}`)

    respond(new OkResponse());
  }

  #createGame(config: GameConfiguration, respond: Callback) {
    if (!this.#identity) {
      log.warn(`Game creation attempted prior to identification by socket ${this.#socket.id}`);

      respond(new BadRequestResponse());
      return;
    }

    const response = this.#lobby.createGame(config, this.#identity);
    if (response instanceof GameStateResponse) {
      log.info(`Player ${this.#identity.id} (socket ${this.#socket.id}) created game ${response.game.id}`);
    }

    respond(response);
  }

  #joinGame(id: string, respond: Callback) {
    if (!this.#identity) {
      log.warn(`Game join attempted prior to identification by socket ${this.#socket.id}`);

      respond(new BadRequestResponse());
      return;
    }

    const response = this.#lobby.joinGame(id, this.#identity);
    if (response instanceof OkResponse) {
      this.#socket.join(id);

      log.info(`Player ${this.#identity.id} (socket ${this.#socket.id}) joined game ${id}`);
    }

    respond(response);
  }

  #registerSocketEvents() {
    this.#socket.on(Events.Identify, this.#identify.bind(this));
    this.#socket.on(Events.CreateGame, this.#createGame.bind(this));
    this.#socket.on(Events.JoinGame, this.#joinGame.bind(this));
    this.#socket.conn.once("close", this.#close.bind(this));
  }
}
