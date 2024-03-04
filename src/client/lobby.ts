import { Socket } from "socket.io-client";
import { Game, GameConfiguration, GameType } from "../game";
import { Events } from "../events";
import { GameStateResponse, Response, StatusCode } from "../communication";
import { showGenericError } from "./helpers";
import { ClockMode } from "../clock";

export enum LobbyEvents {
  Updated = "upd",
}

export class Lobby extends EventTarget {
  readonly games: Game[] = [];
  #socket: Socket;

  constructor(socket: Socket) {
    super();

    this.#socket = socket;

    this.createGame = this.createGame.bind(this);
    this.joinGame = this.joinGame.bind(this);
  }

  createGame() {
    const config: GameConfiguration = {
      type: GameType.Coop,
      clockMode: ClockMode.Live,
      limit: 10,
      increment: 0,
    };

    this.#socket.emit(Events.CreateGame, config, (response: Response) => {
      if (response.status === StatusCode.Ok) {
        this.games.push((response as GameStateResponse).game);
        this.dispatchEvent(new Event(LobbyEvents.Updated));
      } else {
        showGenericError();
      }
    });
  }

  joinGame() {

  }
}
