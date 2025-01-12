import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../../domain/entities/country.entity';
import { Room } from 'src/rooms/domain/entities/room.entity';
import * as countryData from './data/country.json';
import * as roomData from './data/room.json';
import {
  OwnerType,
  RoomVisibility,
} from 'src/rooms/domain/shared/enumerations';
@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
  ) {}
  async run() {
    Logger.log('🌍 Seeding countries...');

    const countryCount = await this.countryRepository.count();
    if (countryCount === 0) {
      Logger.log(`🌍 Seeding ${countryData.length} countries...`);
      await this.countryRepository.save(countryData);
      Logger.log('✅ Countries seeded successfully.');
    } else {
      Logger.log('⚠️ Countries already exist. Skipping seeding.');
    }

    Logger.log('🏠 Seeding rooms...');

    // ✅ Convert room JSON values to match the Room entity
    const formattedRooms = roomData.map((room) => ({
      ...room,
      visibility:
        RoomVisibility[room.visibility as keyof typeof RoomVisibility], // Convert to enum
      owner_type: OwnerType[room.owner_type as keyof typeof OwnerType], // Convert to enum
    }));

    // ✅ Seed Rooms
    const roomCount = await this.roomRepository.count();
    if (roomCount === 0) {
      Logger.log(`🏠 Seeding ${formattedRooms.length} rooms...`);
      await this.roomRepository.save(formattedRooms);
      Logger.log('✅ Rooms seeded successfully.');
    } else {
      Logger.log('⚠️ Rooms already exist. Skipping seeding.');
    }
  }
}
