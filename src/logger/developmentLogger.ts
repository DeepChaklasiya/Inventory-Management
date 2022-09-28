import { createLogger, format, transports } from "winston";
import path from "path";

const developmentLogger = (filename: string) => {
  const logFormat = format.printf(
    (info: { timestamp: any; label: any; level: any; message: any }) => {
      if (typeof info.message === "object") {
        info.message = JSON.stringify(info.message, null, 2);
      }
      return `${info.timestamp} [${info.label}] [${info.level}]: ${info.message}`;
    }
  );

  return createLogger({
    level: "debug",
    format: format.combine(
      format.label({ label: filename }),
      format.colorize(),
      format.splat(),
      format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" })
    ),

    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), logFormat),
      }),
    ],
  });
};

export default developmentLogger;
