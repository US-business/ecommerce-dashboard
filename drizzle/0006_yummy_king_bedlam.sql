ALTER TABLE "products" ALTER COLUMN "color" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "image_alt" text[];--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "details_en" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "details_ar" jsonb;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "offer_en" varchar(200);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "offer_ar" varchar(200);--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "image_name";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "size";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "material";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "material_ar";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "badge";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "badge_ar";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "capacity";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "weight";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "dimensions";