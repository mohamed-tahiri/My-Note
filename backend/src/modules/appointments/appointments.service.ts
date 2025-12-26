import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { User } from '../users/entities/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(dto: CreateAppointmentDto): Promise<Appointment> {
    const user = await this.userRepository.findOneBy({ id: dto.userId });
    if (!user) throw new NotFoundException('User not found');

    let assignedTo: User | null = null;
    if (dto.assignedToId) {
      assignedTo = await this.userRepository.findOneBy({
        id: dto.assignedToId,
      });
      if (!assignedTo) throw new NotFoundException('Assigned user not found');
    }

    const appointment = this.appointmentRepository.create({
      title: dto.title,
      startAt: dto.startAt,
      endAt: dto.endAt,
      user,
      assignedTo,
    });

    const saved = await this.appointmentRepository.save(appointment);

    this.eventEmitter.emit('appointment.created', {
      appointmentId: saved.id,
      userId: user.id,
      assignedToId: assignedTo?.id,
    });

    return saved;
  }

  findAll(): Promise<Appointment[]> {
    return this.appointmentRepository.find({
      relations: ['user', 'assignedTo'],
    });
  }

  async findOne(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
      relations: ['user', 'assignedTo'],
    });
    if (!appointment) throw new NotFoundException('Appointment not found');
    return appointment;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<Appointment> {
    const appointment = await this.findOne(id);

    if (dto.userId) {
      const user = await this.userRepository.findOneBy({ id: dto.userId });
      if (!user) throw new NotFoundException('User not found');
      appointment.user = user;
    }

    if (dto.assignedToId) {
      const assignedTo = await this.userRepository.findOneBy({
        id: dto.assignedToId,
      });
      if (!assignedTo) throw new NotFoundException('Assigned user not found');
      appointment.assignedTo = assignedTo;
    }

    Object.assign(appointment, dto);

    const updated = await this.appointmentRepository.save(appointment);

    this.eventEmitter.emit('appointment.updated', {
      appointmentId: updated.id,
      userId: updated.user.id,
      assignedToId: updated.assignedTo?.id,
    });

    return updated;
  }

  async remove(id: number): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepository.remove(appointment);

    this.eventEmitter.emit('appointment.deleted', {
      appointmentId: appointment.id,
      userId: appointment.user.id,
      assignedToId: appointment.assignedTo?.id,
    });
  }
}
