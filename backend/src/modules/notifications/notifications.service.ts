import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
// import { UpdateNotificationDto } from './dto/update-notification.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationsGateway } from './notifications.gateway';
import { User } from '../users/entities/user.entity';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly gateway: NotificationsGateway,
  ) {}

  async create(createNotificationDto: CreateNotificationDto) {
    const user = await this.userRepository.findOneBy({
      id: createNotificationDto.userId,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const notification = this.notificationRepository.create({
      content: createNotificationDto.content,
      read: false,
      user,
    });

    const saved = await this.notificationRepository.save(notification);

    this.gateway.emitNotification(user.id, {
      id: saved.id,
      content: saved.content,
      createdAt: saved.createdAt,
    });

    return saved;
  }

  async findAll() {
    return await this.notificationRepository.find({});
  }

  async findByUser(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return await this.notificationRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(notificationId: number) {
    const notification = await this.notificationRepository.findOneBy({
      id: notificationId,
    });

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    notification.read = true;
    return await this.notificationRepository.save(notification);
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} notification`;
  // }

  // update(id: number, updateNotificationDto: UpdateNotificationDto) {
  //   return `This action updates a #${id} notification`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} notification`;
  // }
}
