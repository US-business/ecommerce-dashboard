ALTER TABLE "locales" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "locales" CASCADE;--> statement-breakpoint
ALTER TABLE "categories" DROP CONSTRAINT "categories_locale_id_locales_id_fk";
--> statement-breakpoint
ALTER TABLE "products" DROP CONSTRAINT "products_locale_id_locales_id_fk";
--> statement-breakpoint
ALTER TABLE "categories" DROP COLUMN "locale_id";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "locale_id";