import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TaskListener {
  private readonly logger = new Logger(TaskListener.name);

  @OnEvent('task.created')
  handleTaskCreated(payload: { taskId: number; assigneeId: number }) {
    this.logger.log(
      `Task created! Task ID: ${payload.taskId}, Assignee ID: ${payload.assigneeId}`,
    );
  }

  @OnEvent('task.updated')
  handleTaskUpdated(payload: { taskId: number }) {
    this.logger.log(`Task updated! Task ID: ${payload.taskId}`);
  }

  @OnEvent('task.deleted')
  handleTaskDeleted(payload: { taskId: number }) {
    this.logger.log(`Task deleted! Task ID: ${payload.taskId}`);
  }
}
