import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { postBooking, getBooking, putBooking } from "@/controllers/booking-controller";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("/",getBooking )
  .post("/",postBooking )
  .put("/:bookingId",putBooking );

export { bookingRouter };