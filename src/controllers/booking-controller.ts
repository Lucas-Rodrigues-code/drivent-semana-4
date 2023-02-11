import httpStatus from "http-status";
import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import { bookingService } from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    console.log(userId)
    try {
        const booking = await bookingService.findALL(userId)
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const roomId = req.body.roomId;
    try {
        const booking = await bookingService.createBooking(userId, roomId)
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}

export async function putBooking(req: AuthenticatedRequest, res: Response) {
    const { userId } = req;
    const roomId = req.body.roomId;
    const bookingId = Number(req.params.bookingId);
    try {
        const booking = await bookingService.updateBooking(userId, roomId, bookingId)
        return res.status(httpStatus.OK).send(booking);
    } catch (error) {
        console.log(error)
        if (error.name === "NotFoundError") {
            return res.sendStatus(httpStatus.NOT_FOUND);
        }
        return res.sendStatus(httpStatus.BAD_REQUEST);
    }
}