import { prisma } from "@/config";

async function findBookingWithUserId(userId: number) {
    return await prisma.booking.findFirst({
        where: {
            userId
        },
        select: {
            id: true,
            Room: true
        },

    });
}

async function createBooking(userId: number, roomId: number) {
    return await prisma.booking.create({
        data: {
            userId, roomId
        }
    });
}

async function findByRoomId(id: number) {
    return await prisma.room.findUnique({
      where: { id },
      include: { Booking: true }
    });
  }

  async function findBooking(id: number, userId: number) {
    return await prisma.booking.findFirst({
      where: { id, userId }
    });
  }

  async function updateBooking(id: number, roomId: number) {
    return await prisma.booking.update({
      where: { id },
      data: { roomId }
    });
  }

export const bookingRepository = {
    findBookingWithUserId,
    createBooking,
    findByRoomId,
    findBooking,
    updateBooking
}
