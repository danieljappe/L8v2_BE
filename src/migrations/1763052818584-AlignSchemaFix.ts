import { MigrationInterface, QueryRunner } from "typeorm";

export class AlignSchemaFix1763052818584 implements MigrationInterface {
    name = 'AlignSchemaFix1763052818584'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper function to safely drop constraint using DO block
        const dropConstraintSafely = async (tableName: string, constraintName: string) => {
            await queryRunner.query(`
                DO $$
                BEGIN
                    IF EXISTS (
                        SELECT 1 FROM information_schema.table_constraints 
                        WHERE constraint_name = '${constraintName}' 
                        AND table_name = '${tableName}'
                    ) THEN
                        EXECUTE 'ALTER TABLE "${tableName}" DROP CONSTRAINT "${constraintName}"';
                    END IF;
                END $$;
            `);
        };

        // Drop constraints safely (only if they exist)
        await dropConstraintSafely('event_artist', 'FK_event_artists_event');
        await dropConstraintSafely('event_artist', 'FK_event_artists_artist');
        await dropConstraintSafely('gallery_image', 'FK_gallery_images_event');
        await dropConstraintSafely('event', 'FK_events_venue');
        await dropConstraintSafely('ticket', 'FK_tickets_event');
        await dropConstraintSafely('ticket', 'FK_tickets_user');
        
        // Drop indexes if they exist (using IF EXISTS for safety)
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_event_artist_event"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_event_artist_artist"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_event_date"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_event_venue"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ticket_event"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."IDX_ticket_user"`);
        
        // Drop columns if they exist
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "time"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN IF EXISTS "maxTickets"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN IF EXISTS "totalPrice"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN IF EXISTS "status"`);
        await queryRunner.query(`ALTER TABLE "venue" ADD "country" character varying`);
        await queryRunner.query(`ALTER TABLE "venue" ADD "images" text`);
        await queryRunner.query(`ALTER TABLE "venue" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "venue" ADD "latitude" double precision`);
        await queryRunner.query(`ALTER TABLE "venue" ADD "longitude" double precision`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD "performanceOrder" integer`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD "performanceTime" character varying`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD "setDuration" integer`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD "fee" integer`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "event" ADD "startTime" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "endTime" character varying`);
        await queryRunner.query(`ALTER TABLE "event" ADD "totalTickets" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "soldTickets" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "event" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "event" ADD "capacity" integer`);
        await queryRunner.query(`ALTER TABLE "event" ADD "currentAttendees" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "ticketNumber" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "price" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "isUsed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "usedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "sold" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "saleStartDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "saleEndDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" ADD "phoneNumber" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "user" ADD "isActive" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "isRead" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`CREATE TYPE "public"."contact_message_type_enum" AS ENUM('general', 'booking', 'support', 'feedback')`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "type" "public"."contact_message_type_enum" NOT NULL DEFAULT 'general'`);
        await queryRunner.query(`CREATE TYPE "public"."contact_message_status_enum" AS ENUM('pending', 'read', 'replied', 'archived')`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "status" "public"."contact_message_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "phone" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "subject" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "eventDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "artistType" character varying`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "eventDetails" text`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "budget" integer`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "adminNotes" text`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "repliedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "contact_message" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "city" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "state" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "zipCode" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "capacity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_artist" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_artist" ALTER COLUMN "artistId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gallery_image" DROP COLUMN IF EXISTS "category"`);
        await queryRunner.query(`CREATE TYPE "public"."gallery_image_category_enum" AS ENUM('event', 'venue', 'artist', 'other')`);
        await queryRunner.query(`ALTER TABLE "gallery_image" ADD "category" "public"."gallery_image_category_enum" NOT NULL DEFAULT 'other'`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "description" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "ticketPrice" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "quantity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "eventId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "userId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD CONSTRAINT "FK_0cc346514503054b3d20c3389fc" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD CONSTRAINT "FK_2332057da6b96737f522d2d595f" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery_image" ADD CONSTRAINT "FK_1f961932a7ad93669194dac5562" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_0af7bb0535bc01f3c130cfe5fe7" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_8a101375d173c39a7c1d02c9d7d" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_4bb45e096f521845765f657f5c8" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_4bb45e096f521845765f657f5c8"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP CONSTRAINT "FK_8a101375d173c39a7c1d02c9d7d"`);
        await queryRunner.query(`ALTER TABLE "event" DROP CONSTRAINT "FK_0af7bb0535bc01f3c130cfe5fe7"`);
        await queryRunner.query(`ALTER TABLE "gallery_image" DROP CONSTRAINT "FK_1f961932a7ad93669194dac5562"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP CONSTRAINT "FK_2332057da6b96737f522d2d595f"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP CONSTRAINT "FK_0cc346514503054b3d20c3389fc"`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "lastName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" ALTER COLUMN "firstName" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "userId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "ticket" ALTER COLUMN "quantity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "status" SET DEFAULT 'upcoming'`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "ticketPrice" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "gallery_image" DROP COLUMN "category"`);
        await queryRunner.query(`DROP TYPE "public"."gallery_image_category_enum"`);
        await queryRunner.query(`ALTER TABLE "gallery_image" ADD "category" character varying NOT NULL DEFAULT 'other'`);
        await queryRunner.query(`ALTER TABLE "event_artist" ALTER COLUMN "artistId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event_artist" ALTER COLUMN "eventId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "capacity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "zipCode" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "state" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "city" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "venue" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "repliedAt"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "adminNotes"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "budget"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "eventDetails"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "artistType"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "eventDate"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "subject"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."contact_message_status_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "type"`);
        await queryRunner.query(`DROP TYPE "public"."contact_message_type_enum"`);
        await queryRunner.query(`ALTER TABLE "contact_message" DROP COLUMN "isRead"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "phoneNumber"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "saleEndDate"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "saleStartDate"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "sold"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "usedAt"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "isUsed"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "ticket" DROP COLUMN "ticketNumber"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "currentAttendees"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "capacity"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "soldTickets"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "totalTickets"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "endTime"`);
        await queryRunner.query(`ALTER TABLE "event" DROP COLUMN "startTime"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP COLUMN "fee"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP COLUMN "setDuration"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP COLUMN "performanceTime"`);
        await queryRunner.query(`ALTER TABLE "event_artist" DROP COLUMN "performanceOrder"`);
        await queryRunner.query(`ALTER TABLE "venue" DROP COLUMN "longitude"`);
        await queryRunner.query(`ALTER TABLE "venue" DROP COLUMN "latitude"`);
        await queryRunner.query(`ALTER TABLE "venue" DROP COLUMN "isActive"`);
        await queryRunner.query(`ALTER TABLE "venue" DROP COLUMN "images"`);
        await queryRunner.query(`ALTER TABLE "venue" DROP COLUMN "country"`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "status" character varying NOT NULL DEFAULT 'active'`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD "totalPrice" numeric(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "event" ADD "maxTickets" integer`);
        await queryRunner.query(`ALTER TABLE "event" ADD "time" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ticket_user" ON "ticket" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ticket_event" ON "ticket" ("eventId") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_venue" ON "event" ("venueId") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_date" ON "event" ("date") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_artist_artist" ON "event_artist" ("artistId") `);
        await queryRunner.query(`CREATE INDEX "IDX_event_artist_event" ON "event_artist" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_tickets_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ticket" ADD CONSTRAINT "FK_tickets_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event" ADD CONSTRAINT "FK_events_venue" FOREIGN KEY ("venueId") REFERENCES "venue"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "gallery_image" ADD CONSTRAINT "FK_gallery_images_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD CONSTRAINT "FK_event_artists_artist" FOREIGN KEY ("artistId") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "event_artist" ADD CONSTRAINT "FK_event_artists_event" FOREIGN KEY ("eventId") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
