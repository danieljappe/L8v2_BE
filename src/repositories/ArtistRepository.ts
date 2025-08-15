import { Artist } from '../models/Artist';
import { BaseRepository } from './BaseRepository';
import { FindOptionsWhere, MoreThanOrEqual } from 'typeorm';

export class ArtistRepository extends BaseRepository<Artist> {
  constructor() {
    super(Artist);
  }

  async findByName(name: string): Promise<Artist | null> {
    return this.repository.findOneBy({ name } as FindOptionsWhere<Artist>);
  }

  async findByGenre(genre: string): Promise<Artist[]> {
    return this.repository.findBy({ genre } as FindOptionsWhere<Artist>);
  }

  async findActiveArtists(): Promise<Artist[]> {
    return this.repository.findBy({ isActive: true } as FindOptionsWhere<Artist>);
  }

  async findArtistsByRating(minRating: number): Promise<Artist[]> {
    return this.repository.findBy({ rating: MoreThanOrEqual(minRating) } as FindOptionsWhere<Artist>);
  }
} 