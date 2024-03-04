import { ClockMode } from "./clock";
import { PlayerIdentity } from "./player";

export enum GameType {
  Coop = "coop",
}

export interface GameConfiguration {
  type: GameType;
  clockMode: ClockMode;
  limit: number;
  increment?: number;
}

export class Game {
  readonly id: string;
  readonly host: PlayerIdentity;
  readonly config: GameConfiguration;
  readonly players: PlayerIdentity[] = [];
  started: boolean = false;

  constructor(id: string,config: GameConfiguration, host: PlayerIdentity) {
    this.id = id;
    this.config = config;
    this.host = host;
    this.players.push(this.host);
  }
}
