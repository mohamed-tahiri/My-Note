import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class AppointmentListener {
  private readonly logger = new Logger(AppointmentListener.name);

  constructor(private readonly notificationService: NotificationsService) {}

  @OnEvent('appointment.created')
  async handleAppointmentCreated(payload: {
    appointmentId: number;
    title: string;
    userId: number;
    assignedToId?: number;
  }) {
    // Notification pour le créateur
    await this.notificationService.create({
      userId: payload.userId,
      content: `Appointment "${payload.title}" created successfully.`,
    });

    // Notification pour la personne assignée
    if (payload.assignedToId && payload.assignedToId !== payload.userId) {
      await this.notificationService.create({
        userId: payload.assignedToId,
        content: `A new appointment "${payload.title}" has been assigned to you.`,
      });
    }
  }

  @OnEvent('appointment.updated')
  async handleAppointmentUpdated(payload: {
    appointmentId: number;
    title: string;
    userId: number;
    assignedToId?: number;
  }) {
    this.logger.log(
      `Processing update notification for appointment: ${payload.appointmentId}`,
    );

    // Notification au propriétaire/modificateur
    await this.notificationService.create({
      userId: payload.userId,
      content: `Your appointment "${payload.title}" has been updated.`,
    });

    // Notification à la personne assignée si elle est différente
    if (payload.assignedToId && payload.assignedToId !== payload.userId) {
      await this.notificationService.create({
        userId: payload.assignedToId,
        content: `The appointment "${payload.title}" assigned to you has been modified.`,
      });
    }
  }

  @OnEvent('appointment.deleted')
  async handleAppointmentDeleted(payload: {
    appointmentId: number;
    title: string;
    userId: number;
    assignedToId?: number;
  }) {
    this.logger.warn(
      `Processing delete notification for appointment: ${payload.appointmentId}`,
    );

    // Notification au propriétaire
    await this.notificationService.create({
      userId: payload.userId,
      content: `Appointment "${payload.title}" has been canceled/deleted.`,
    });

    // Notification à la personne qui était assignée
    if (payload.assignedToId && payload.assignedToId !== payload.userId) {
      await this.notificationService.create({
        userId: payload.assignedToId,
        content: `The appointment "${payload.title}" assigned to you has been canceled.`,
      });
    }
  }
}
