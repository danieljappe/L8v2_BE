import { Venue } from '../models/Venue';
import { BaseRepository } from './BaseRepository';
import { FindOptionsWhere, MoreThanOrEqual } from 'typeorm';

export class VenueRepository extends BaseRepository<Venue> {
  constructor() {
    super(Venue);
  }

  async findByName(name: string): Promise<Venue | null> {
    return this.repository.findOneBy({ name } as FindOptionsWhere<Venue>);
  }

  async findByAddress(address: string): Promise<Venue[]> {
    return this.repository.findBy({ address } as FindOptionsWhere<Venue>);
  }

  async findActiveVenues(): Promise<Venue[]> {
    return this.repository.findBy({ isActive: true } as FindOptionsWhere<Venue>);
  }

  async findByCity(city: string): Promise<Venue[]> {
    return this.repository.findBy({ city } as FindOptionsWhere<Venue>);
  }

  async findByCapacity(minCapacity: number): Promise<Venue[]> {
    return this.repository.findBy({ capacity: MoreThanOrEqual(minCapacity) } as FindOptionsWhere<Venue>);
  }

  async findByLocation(latitude: number, longitude: number, radiusInKm: number): Promise<Venue[]> {
    // This would typically use geospatial queries
    // For now, we'll return an empty array as this requires additional setup
    return [];
  }
} 