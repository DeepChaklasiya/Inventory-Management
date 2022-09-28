const { createLogger, format, transports } = require("winston");
const { combine, timestamp, json } = format;

const productionLogger = (filename: string) => {
  return createLogger({
    level: "debug",
    format: combine(timestamp(), json(), format.label({ label: filename })),
    transports: [
      new transports.Console(),
      new transports.File({
        filename: "errors.log",
      }),
    ],
  });
};

export default productionLogger;
