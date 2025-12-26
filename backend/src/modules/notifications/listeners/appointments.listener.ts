import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class AppointmentListener {
  private readonly logger = new Logger(AppointmentListener.name);

  @OnEvent('appointment.created')
  handleAppointmentCreated(payload: {
    appointmentId: number;
    userId: number;
    assignedToId?: number;
  }) {
    this.logger.log(`Appointment created: ${payload.appointmentId}`);
    this.logger.log(`Created by user: ${payload.userId}`);
    if (payload.assignedToId) {
      this.logger.log(`Assigned to user: ${payload.assignedToId}`);
    }
    // Ajouter notification réelle ici
  }

  @OnEvent('appointment.updated')
  handleAppointmentUpdated(payload: {
    appointmentId: number;
    userId: number;
    assignedToId?: number;
  }) {
    this.logger.log(`Appointment updated: ${payload.appointmentId}`);
    this.logger.log(`Updated by user: ${payload.userId}`);
    if (payload.assignedToId) {
      this.logger.log(`Assigned to user: ${payload.assignedToId}`);
    }
    // Ajouter notification réelle ici
  }

  @OnEvent('appointment.deleted')
  handleAppointmentDeleted(payload: {
    appointmentId: number;
    userId: number;
    assignedToId?: number;
  }) {
    this.logger.warn(`Appointment deleted: ${payload.appointmentId}`);
    this.logger.warn(`Deleted by user: ${payload.userId}`);
    if (payload.assignedToId) {
      this.logger.warn(`Was assigned to user: ${payload.assignedToId}`);
    }
    // Ajouter notification réelle ici
  }
}
