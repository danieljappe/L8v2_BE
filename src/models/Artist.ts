import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { EventArtist } from './EventArtist';

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

  @Column({ nullable: true })
  socialMedia?: string;

  @Column({ nullable: true })
  genre?: string;

  @Column({ type: 'float', default: 0 })
  rating!: number;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => EventArtist, eventArtist => eventArtist.artist)
  eventArtists!: EventArtist[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 