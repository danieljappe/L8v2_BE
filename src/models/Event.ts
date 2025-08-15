import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Venue } from './Venue';
import { EventArtist } from './EventArtist';
import { Ticket } from './Ticket';
import { GalleryImage } from './GalleryImage';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  date!: Date;

  @Column()
  startTime!: string;

  @Column({ nullable: true })
  endTime?: string;

  @Column()
  ticketPrice!: number;

  @Column()
  totalTickets!: number;

  @Column({ default: 0 })
  soldTickets!: number;

  @Column({ nullable: true })
  imageUrl?: string;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: 'draft' })
  status!: string;

  @Column({ nullable: true })
  capacity?: number;

  @Column({ default: 0 })
  currentAttendees!: number;

  @ManyToOne(() => Venue, venue => venue.events, { nullable: true })
  @JoinColumn()
  venue?: Venue;

  @OneToMany(() => EventArtist, eventArtist => eventArtist.event)
  eventArtists!: EventArtist[];

  @OneToMany(() => Ticket, ticket => ticket.event)
  tickets!: Ticket[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
} 