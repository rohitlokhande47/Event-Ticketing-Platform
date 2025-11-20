// Shared types and interfaces
export interface User {
  _id: string;
  email: string;
  name: string;
}

export interface Event {
  _id: string;
  name: string;
  date: Date;
  venue: string;
  totalSeats: number;
}

export interface Ticket {
  _id: string;
  event: string;
  seatNumber: string;
  status: 'available' | 'reserved' | 'sold' | 'used';
  holder?: string;
  reservationExpiresAt?: Date;
  ticketToken?: string;
}