import { EventEmitter } from "node:events";
import { BadRequestResponse, NotFoundResponse, GameStateResponse, Response } from "../communication";
import { Game, GameConfiguration } from "../game";
import { validateConfig } from "./validation";
import { PlayerIdentity } from "../player";

export type GameUpdateFn = (game: Game) => void;

export enum LobbyEvents {
  GameUpdate = "gu"
}

export class Lobby extends EventEmitter {
  #games: Game[] = [];
  #sendUpdateEvent: GameUpdateFn;

  constructor(sendUpdateEvent: GameUpdateFn) {
    super();

    this.#sendUpdateEvent = sendUpdateEvent;
  }

  createGame(config: GameConfiguration, host: PlayerIdentity): Response {
    if (!validateConfig(config)) {
      return new BadRequestResponse();
    }

    if (this.#games.some(game => game.host.id === host.id)) {
      return new BadRequestResponse();
    }

    const game = new Game(config, host);
    this.#games.push(game);
    return new GameStateResponse(game);
  }

  joinGame(id: string, playerId: PlayerIdentity): Response {
    if (!id || typeof id !== "string") {
      return new BadRequestResponse();
    }

    const game = this.#games.find(game => game.id === id);
    if (!game) {
      return new NotFoundResponse();
    }

    const player = game.players.find(p => p.id === playerId.id);
    if (!player) {
      game.players.push(playerId);
    }

    this.#sendUpdateEvent(game);

    return new GameStateResponse(game);
  }
}
