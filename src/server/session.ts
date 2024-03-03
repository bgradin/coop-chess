import { EventEmitter } from "node:events";
import { Socket } from "socket.io";
import { Events } from "../events";
import { GameConfiguration } from "../game";
import { Lobby } from "./lobby";
import { PlayerIdentity } from "../player";
import { BadRequestResponse, Callback, OkResponse } from "../communication";
import { validateDto } from "./validation";

export enum SessionEvents {
  Close = "close",
}

export class Session extends EventEmitter {
  readonly #socket: Socket;
  readonly #lobby: Lobby;
  #id: PlayerIdentity;

  constructor(socket: Socket, lobby: Lobby, id: PlayerIdentity) {
    super();

    this.#socket = socket;
    this.#lobby = lobby;
    this.#id = id;

    this.#registerSocketEvents();
  }

  #close() {
    this.emit(SessionEvents.Close);
  }

  #identify(id: PlayerIdentity, respond: Callback) {
    if (!validateDto(id, "PlayerIdentityDto")) {
      respond(new BadRequestResponse());
      return;
    }

    this.#id = id;
    respond(new OkResponse());
  }

  #createGame(config: GameConfiguration, respond: Callback) {
    const response = this.#lobby.createGame(config, this.#id);
    respond(response);
  }

  #joinGame(id: string, respond: Callback) {
    const response = this.#lobby.joinGame(id, this.#id);
    if (response instanceof OkResponse) {
      this.#socket.join(id);
    }

    respond(response);
  }

  #registerSocketEvents() {
    this.#socket.conn.on(Events.Identify, this.#identify);
    this.#socket.conn.on(Events.CreateGame, this.#createGame);
    this.#socket.conn.on(Events.JoinGame, this.#joinGame);
    this.#socket.conn.on("close", this.#close);
  }
}
