import path from "path";
import appRootPath from "app-root-path";
import { transports, createLogger, format } from "winston";
import "winston-daily-rotate-file";

const fileTransport = new transports.DailyRotateFile({
  dirname: path.join(appRootPath.toString(), "logs"),
  filename: "server-%DATE%.log",
  frequency: "1d",
  maxFiles: "14d"
});

export const log = createLogger({
  format: format.combine(
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    fileTransport,
  ],
});
