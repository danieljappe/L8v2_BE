import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EventArtist } from './EventArtist';

interface SocialMedia {
  platform: string;
  url: string;
}

@Entity()
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ nullable: true })
  website?: string;

  @Column({ type: 'json', nullable: true })
  socialMedia?: SocialMedia[];

  @Column({ nullable: true })
  genre?: string;

  @OneToMany(() => EventArtist, eventArtist => eventArtist.artist)
  eventArtists!: EventArtist[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 