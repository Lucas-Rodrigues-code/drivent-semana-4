


import { forbiddenError, notFoundError } from "@/errors";
import { bookingRepository } from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";

 async function findALL(userId: number) {
    const booking = await bookingRepository.findBookingWithUserId(userId);
  
    if (!booking) {
      throw notFoundError();
    }
  
    return booking
  }

  async function createBooking(userId: number, roomId: number) {
    await rules(userId,roomId)
    
    const postBooking = await bookingRepository.createBooking(userId,roomId);
    return postBooking;

  }

  async function updateBooking(userId: number, roomId: number, bookingId: number) {
    await rules(userId, roomId);
  
    const booking = await bookingRepository.findBooking(bookingId, userId);
    if (!booking) {
      throw forbiddenError();
    } 
  
    const result = await bookingRepository.updateBooking(bookingId, roomId);
    const body = { bookingId: result.id };
    return body;
  }
  

  async function rules(userId: number, roomId: number) {
    const enrollment = await enrollmentRepository.findById(userId);
    if(!enrollment) {
      throw forbiddenError();
    }
  
    const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
    if (!ticket) {
      throw forbiddenError();
    }
    if (ticket.status !== "PAID" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
      throw forbiddenError();
    } 
  
    const room = await bookingRepository.findByRoomId(roomId);
    if (!room) {
      throw notFoundError();
    } 
    if (room.Booking.length === room.capacity) {
      throw forbiddenError();
    } 
  }

  export const bookingService = {
    findALL,
    createBooking,
    updateBooking
  };
  