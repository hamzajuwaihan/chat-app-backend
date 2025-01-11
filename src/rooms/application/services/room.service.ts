import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../../domain/entities/room.entity';
import { RoomMembership } from '../../domain/entities/room-membership.entity';
import { User } from '../../../users/domain/entities/user.entity';
import { CreateRoomDto } from 'src/rooms/presentation/dto/create-room.dto';
import { UpdateRoomDto } from 'src/rooms/presentation/dto/update-room.dto';
import { OwnerType, RoomRole } from 'src/rooms/domain/shared/enumerations';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(RoomMembership)
    private readonly membershipRepository: Repository<RoomMembership>,
  ) {}

  /**
   * Create a new room
   */
  async createRoom(dto: CreateRoomDto, owner: User): Promise<Room> {
    const room = this.roomRepository.create({ ...dto, owner_id: owner.id });
    await this.roomRepository.save(room);

    const role =
      dto.owner_type === OwnerType.USER ? RoomRole.OWNER : RoomRole.MEMBER;

    const ownerMembership = this.membershipRepository.create({
      user: { id: owner.id } as User,
      room: { id: room.id } as Room,
      role,
    });

    await this.membershipRepository.save(ownerMembership);
    return room;
  }
  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.find({ relations: ['memberships'] });
  }

  /**
   * Get a room by ID
   */
  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomRepository.findOneOrFail({
      where: { id },
      relations: ['memberships'],
    });

    return room;
  }

  /**
   * Update a room
   */
  async updateRoom(id: string, dto: UpdateRoomDto): Promise<Room> {
    const room = await this.getRoomById(id);
    Object.assign(room, dto);
    return this.roomRepository.save(room);
  }

  /**
   * Delete a room and remove all memberships
   */
  async deleteRoom(id: string): Promise<void> {
    const room = await this.getRoomById(id);
    await this.roomRepository.remove(room);
  }

  /**
   * Add a user to a room
   */
  async addUserToRoom(roomId: string, user: User): Promise<RoomMembership> {
    const room = await this.getRoomById(roomId);

    const existingMembership = await this.membershipRepository.findOne({
      where: { room, user },
    });
    if (existingMembership) {
      throw new BadRequestException('User is already a member of this room');
    }

    const membership = this.membershipRepository.create({ user, room });
    return this.membershipRepository.save(membership);
  }

  /**
   * Remove a user from a room
   */
  async removeUserFromRoom(roomId: string, userId: string): Promise<void> {
    const membership = await this.membershipRepository.findOne({
      where: { room: { id: roomId }, user: { id: userId } },
    });

    if (!membership) {
      throw new NotFoundException('User is not a member of this room');
    }

    await this.membershipRepository.remove(membership);
  }
}
