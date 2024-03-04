import { Server as SocketServer } from 'socket.io';
import { Lobby } from './lobby';
import { log } from "./logging";
import { Session, SessionEvents } from './session';
import { Game } from '../game';
import { Events } from '../events';

const PORT = 3000;
const PRODUCTION_ORIGIN = "http://chess.gradinware.com";
const LOCALHOST_ORIGIN = "http://localhost:8080";

log.info("Application started.");

function handleUnhandledError(error: Error) {
  log.error(`${error.name}: ${error.message}` + (error.stack ? "\n" + error.stack : ""));
}

process.on("uncaughtException", handleUnhandledError);
process.on("unhandledRejection", handleUnhandledError);

process.on("exit", (code) => {
  log.info(`Application exited with code ${code}`);
});

process.on("SIGINT", () => {
  log.info("Application received SIGINT.");
  process.exit(0);
});

const origin = process.env.PRODUCTION ? PRODUCTION_ORIGIN : LOCALHOST_ORIGIN;
log.info(`Starting socket server with allowed origin: ${origin}`);

class Server {
  readonly #io: SocketServer = new SocketServer({
    cors: {
      origin,
      methods: [ "GET", "POST" ],
    },
  });
  readonly #lobby: Lobby = new Lobby(
    (game: Game) => {
      this.#io.to(game.id).emit(Events.GameUpdated, game);
    }
  );
  #sessions: Session[] = [];

  constructor() {
    this.#registerEvents();
  }

  #endSession(session: Session) {
    const index = this.#sessions.indexOf(session);
    if (index !== -1) {
      this.#sessions.splice(index, 1);
    }
  }

  #registerEvents() {
    this.#io.on("connection", (socket) => {
      const session = new Session(socket, this.#lobby);
      this.#sessions.push(session);

      log.info(`Session created: socket ${socket.id}`);

      session.on(SessionEvents.Close, () => {
        log.info(`Session ended: socket ${socket.id}`)

        this.#endSession(session);
      });
    });
  }

  run() {
    this.#io.listen(PORT);
  }
}

const server = new Server();
server.run();
