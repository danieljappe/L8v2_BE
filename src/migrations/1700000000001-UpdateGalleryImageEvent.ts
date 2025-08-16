import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateGalleryImageEvent1700000000001 implements MigrationInterface {
    name = 'UpdateGalleryImageEvent1700000000001'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old gallery_images table if it exists
        await queryRunner.query(`DROP TABLE IF EXISTS "gallery_images"`);
        
        // Create the new gallery_images table with proper structure
        await queryRunner.query(`
            CREATE TABLE "gallery_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "filename" character varying NOT NULL,
                "url" character varying NOT NULL,
                "thumbnailUrl" character varying,
                "mediumUrl" character varying,
                "largeUrl" character varying,
                "caption" character varying,
                "eventId" uuid,
                "photographer" character varying,
                "tags" text,
                "category" character varying NOT NULL DEFAULT 'other',
                "orderIndex" integer NOT NULL DEFAULT '0',
                "isPublished" boolean NOT NULL DEFAULT false,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_gallery_images" PRIMARY KEY ("id")
            )
        `);
        
        // Add foreign key constraint for eventId
        await queryRunner.query(`
            ALTER TABLE "gallery_images" 
            ADD CONSTRAINT "FK_gallery_images_event" 
            FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE SET NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the foreign key constraint
        await queryRunner.query(`
            ALTER TABLE "gallery_images" 
            DROP CONSTRAINT "FK_gallery_images_event"
        `);
        
        // Drop the new gallery_images table
        await queryRunner.query(`DROP TABLE "gallery_images"`);
        
        // Recreate the old gallery_images table
        await queryRunner.query(`
            CREATE TABLE "gallery_images" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "eventId" uuid,
                "imageUrl" character varying NOT NULL,
                "caption" character varying,
                "uploadedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_gallery_images" PRIMARY KEY ("id")
            )
        `);
    }
}



