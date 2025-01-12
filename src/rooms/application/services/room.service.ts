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
   * Create a new room with system ownership or user ownership
   */
  async createRoom(dto: CreateRoomDto, owner: User): Promise<Room> {
    // Validate room creation
    if (!dto.name || !dto.owner_type) {
      throw new BadRequestException('Room name and owner type are required');
    }

    // Assign owner_id only for USER type, SYSTEM has no specific owner
    const room = this.roomRepository.create({
      ...dto,
      owner_id: dto.owner_type === OwnerType.USER ? owner.id : null,
    });

    await this.roomRepository.save(room);

    // Automatically add the owner as a member
    if (dto.owner_type === OwnerType.USER) {
      const ownerMembership = this.membershipRepository.create({
        user: owner,
        room,
        role: RoomRole.OWNER,
      });
      await this.membershipRepository.save(ownerMembership);
    }

    return room;
  }

  /**
   * Get all rooms
   */
  async getAllRooms(): Promise<Room[]> {
    return this.roomRepository.find();
  }

  /**
   * Get a single room by ID
   */
  async getRoomById(id: string): Promise<Room> {
    const room = await this.roomRepository.findOneOrFail({ where: { id } });

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

    // Delete all room memberships first
    await this.membershipRepository.delete({ room: { id } });

    // Delete the room itself
    await this.roomRepository.remove(room);
  }

  /**
   * Add a user to a room
   */
  async addUserToRoom(roomId: string, user: User): Promise<RoomMembership> {
    const room = await this.getRoomById(roomId);

    // Prevent duplicates
    const existingMembership = await this.membershipRepository.findOne({
      where: { room: { id: roomId }, user: { id: user.id } },
    });

    if (existingMembership) {
      throw new BadRequestException('User is already a member of this room');
    }

    const membership = this.membershipRepository.create({
      user,
      room,
      role: RoomRole.MEMBER,
    });

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

  /*
   * get a room with its members
   */
  async getRoomWithMembers(
    roomId: string,
  ): Promise<{ room: Room; members: User[] }> {
    const room = await this.getRoomById(roomId);

    const memberships = await this.membershipRepository.find({
      where: { room: { id: room.id } },
      relations: ['user'],
    });

    const members = memberships.map((membership) => membership.user);

    return {
      room,
      members,
    };
  }
}
