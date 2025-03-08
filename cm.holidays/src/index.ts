import { AppDataSource } from "./data-source";
import { initEnv } from "../configEnv";
import { app } from "./main";

initEnv();

const initApp = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    app.listen(process.env.PORT);
  } catch (error: unknown) {
    console.error(error);
  }
};

(async (): Promise<void> => {
  await initApp();
})();

process.on("uncaughtException", (err: Error) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  process.exit(1);
});

process.on("unhandledRejection", (reason: Error) => {
  console.log(reason.name, reason.message);
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  process.exit(1);
});