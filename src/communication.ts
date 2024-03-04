import { Game } from "./game";

export enum StatusCode {
  BadRequest = 400,
  NotFound = 404,
  Error = 500,
  Ok = 200,
}

export abstract class Response {
  abstract status: StatusCode;
}

export class ErrorResponse extends Response {
  readonly status: StatusCode = StatusCode.Error;
}

export class BadRequestResponse extends ErrorResponse {
  readonly status: StatusCode = StatusCode.BadRequest;
}

export class NotFoundResponse extends ErrorResponse {
  readonly status: StatusCode = StatusCode.NotFound;
}

export class OkResponse extends Response {
  readonly status: StatusCode = StatusCode.Ok;
}

export class DataResponse<T> extends OkResponse {
  readonly data: T;

  constructor(data: T) {
    super();

    this.data = data;
  }
}

export class GameStateResponse extends OkResponse {
  readonly game: Game;

  constructor(game: Game) {
    super();

    this.game = game;
  }
}

export type Callback = (response: Response) => void;
