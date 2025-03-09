import { personRouter } from "./person";
import { serviceRouter } from "./service";
import { roleRouter } from "./role";
import { holidayTypeRouter } from "./holidayType";
import { holidayRequestRouter } from "./HolidayRequest";
import { Router } from "express";
import { postRouter } from "./post";

const allRoutes = Router();

allRoutes
  .use("/employee", personRouter)
  .use("/service", serviceRouter)
  .use("/post", postRouter)
  .use("/role", roleRouter)
  .use("/holidayType", holidayTypeRouter)
  .use("/holidayRequest", holidayRequestRouter);

export { allRoutes };