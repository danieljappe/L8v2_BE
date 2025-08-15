import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1700000000000 implements MigrationInterface {
    name = 'InitialMigration1700000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "firstName" character varying,
                "lastName" character varying,
                "role" character varying NOT NULL DEFAULT 'user',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);

        // Create venues table
        await queryRunner.query(`
            CREATE TABLE "venues" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "address" character varying NOT NULL,
                "city" character varying NOT NULL,
                "state" character varying NOT NULL,
                "zipCode" character varying NOT NULL,
                "capacity" integer NOT NULL,
                "description" text,
                "imageUrl" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c3c" PRIMARY KEY ("id")
            )
        `);

        // Create artists table
        await queryRunner.query(`
            CREATE TABLE "artists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "bio" text,
                "imageUrl" character varying,
                "genre" character varying,
                "website" character varying,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c4" PRIMARY KEY ("id")
            )
        `);

        // Create events table
        await queryRunner.query(`
            CREATE TABLE "events" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "title" character varying NOT NULL,
                "description" text,
                "date" TIMESTAMP NOT NULL,
                "time" character varying NOT NULL,
                "venueId" uuid,
                "imageUrl" character varying,
                "ticketPrice" decimal(10,2),
                "maxTickets" integer,
                "status" character varying NOT NULL DEFAULT 'upcoming',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c5" PRIMARY KEY ("id")
            )
        `);

        // Create tickets table
        await queryRunner.query(`
            CREATE TABLE "tickets" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventId" uuid NOT NULL,
                "userId" uuid NOT NULL,
                "quantity" integer NOT NULL,
                "totalPrice" decimal(10,2) NOT NULL,
                "status" character varying NOT NULL DEFAULT 'active',
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c6" PRIMARY KEY ("id")
            )
        `);

        // Create gallery_images table
        await queryRunner.query(`
            CREATE TABLE "gallery_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventId" uuid,
                "imageUrl" character varying NOT NULL,
                "caption" character varying,
                "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c7" PRIMARY KEY ("id")
            )
        `);

        // Create contact_messages table
        await queryRunner.query(`
            CREATE TABLE "contact_messages" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "message" text NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c8" PRIMARY KEY ("id")
            )
        `);

        // Create event_artists table
        await queryRunner.query(`
            CREATE TABLE "event_artists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventId" uuid NOT NULL,
                "artistId" uuid NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8b2b0c3c3c3c3c3c3c3c3c3c9" PRIMARY KEY ("id")
            )
        `);

        // Add foreign key constraints
        await queryRunner.query(`
            ALTER TABLE "events" 
            ADD CONSTRAINT "FK_events_venue" 
            FOREIGN KEY ("venueId") REFERENCES "venues"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tickets" 
            ADD CONSTRAINT "FK_tickets_event" 
            FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "tickets" 
            ADD CONSTRAINT "FK_tickets_user" 
            FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "gallery_images" 
            ADD CONSTRAINT "FK_gallery_images_event" 
            FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "event_artists" 
            ADD CONSTRAINT "FK_event_artists_event" 
            FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        await queryRunner.query(`
            ALTER TABLE "event_artists" 
            ADD CONSTRAINT "FK_event_artists_artist" 
            FOREIGN KEY ("artistId") REFERENCES "artists"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);

        // Create indexes for better performance
        await queryRunner.query(`CREATE INDEX "IDX_events_date" ON "events" ("date")`);
        await queryRunner.query(`CREATE INDEX "IDX_events_venue" ON "events" ("venueId")`);
        await queryRunner.query(`CREATE INDEX "IDX_tickets_event" ON "tickets" ("eventId")`);
        await queryRunner.query(`CREATE INDEX "IDX_tickets_user" ON "tickets" ("userId")`);
        await queryRunner.query(`CREATE INDEX "IDX_gallery_images_event" ON "gallery_images" ("eventId")`);
        await queryRunner.query(`CREATE INDEX "IDX_event_artists_event" ON "event_artists" ("eventId")`);
        await queryRunner.query(`CREATE INDEX "IDX_event_artists_artist" ON "event_artists" ("artistId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign key constraints first
        await queryRunner.query(`ALTER TABLE "event_artists" DROP CONSTRAINT "FK_event_artists_artist"`);
        await queryRunner.query(`ALTER TABLE "event_artists" DROP CONSTRAINT "FK_event_artists_event"`);
        await queryRunner.query(`ALTER TABLE "gallery_images" DROP CONSTRAINT "FK_gallery_images_event"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_user"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP CONSTRAINT "FK_tickets_event"`);
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_events_venue"`);

        // Drop indexes
        await queryRunner.query(`DROP INDEX "IDX_event_artists_artist"`);
        await queryRunner.query(`DROP INDEX "IDX_event_artists_event"`);
        await queryRunner.query(`DROP INDEX "IDX_gallery_images_event"`);
        await queryRunner.query(`DROP INDEX "IDX_tickets_user"`);
        await queryRunner.query(`DROP INDEX "IDX_tickets_event"`);
        await queryRunner.query(`DROP INDEX "IDX_events_venue"`);
        await queryRunner.query(`DROP INDEX "IDX_events_date"`);

        // Drop tables
        await queryRunner.query(`DROP TABLE "event_artists"`);
        await queryRunner.query(`DROP TABLE "contact_messages"`);
        await queryRunner.query(`DROP TABLE "gallery_images"`);
        await queryRunner.query(`DROP TABLE "tickets"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "artists"`);
        await queryRunner.query(`DROP TABLE "venues"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }
}
