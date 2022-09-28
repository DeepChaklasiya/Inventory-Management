import developmentLogger from "./developmentLogger";
import productionLogger from "./productionLogger";

let logger: any = null;

const getShortFilePath = (filename: string) => {
  const pathArr: Array<string> = filename.split(/[\\|\/]/);

  return `/${pathArr.at(-2)}/${pathArr.at(-1)}`;
};

if (process.env.NODE_ENV === "DEVELOPMENT") {
  logger = (filename: string) => {
    const log = developmentLogger(getShortFilePath(filename));
    return {
      error: (logMessage: string, error: any) => {
        log.error({
          logMessage,
          errorMessage: error.message,
          error,
        });
      },
      info: (logMessage: string, meta: any) => {
        log.info({
          logMessage,
          meta
        });
      },
      debug: (logMessage: string, meta: any) => {
        log.debug({
          logMessage,
          meta
        });
      },
    };
  };
}

if (process.env.NODE_ENV === "PRODUCTION") {
  logger = (filename: string) => {
    const log = productionLogger(getShortFilePath(filename));
    return {
      error: (logMessage: string, error: any) => {
        log.error({
          logMessage,
          errorMessage: error.message,
          error,
        });
      },
      info: (logMessage: string, meta: any) => {
        log.info({
          logMessage,
          meta,
        });
      },
      debug: (logMessage: string, meta: any) => {
        log.debug({
          logMessage,
          meta,
        });
      },
    };
  };
}

export default logger;
