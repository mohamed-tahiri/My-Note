import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationsService } from '../notifications.service';

@Injectable()
export class TaskListener {
  private readonly logger = new Logger(TaskListener.name);

  constructor(private readonly notificationService: NotificationsService) {}

  @OnEvent('task.created')
  async handleTaskCreated(payload: { taskId: number; assigneeId: number }) {
    await this.notificationService.create({
      userId: payload.assigneeId,
      content: `Task ${payload.taskId} created`,
    });

    this.logger.log(
      `Task created! Task ID: ${payload.taskId}, Assignee ID: ${payload.assigneeId}`,
    );
  }

  @OnEvent('task.updated')
  async handleTaskUpdated(payload: { taskId: number; assigneeId: number }) {
    await this.notificationService.create({
      userId: payload.assigneeId,
      content: `Task ${payload.taskId} updated`,
    });

    this.logger.log(`Task updated! Task ID: ${payload.taskId}`);
  }

  @OnEvent('task.deleted')
  async handleTaskDeleted(payload: { taskId: number; assigneeId: number }) {
    await this.notificationService.create({
      userId: payload.assigneeId,
      content: `Task ${payload.taskId} deleted`,
    });

    this.logger.log(`Task deleted! Task ID: ${payload.taskId}`);
  }
}
