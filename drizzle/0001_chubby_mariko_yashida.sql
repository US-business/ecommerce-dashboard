CREATE TYPE "public"."locales_names" AS ENUM('English', 'العربية');--> statement-breakpoint
CREATE TABLE "locales" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(5) DEFAULT 'ar' NOT NULL,
	"name" "locales_names" DEFAULT 'العربية' NOT NULL,
	"dir" varchar(3) DEFAULT 'rtl' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD COLUMN "locale_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "locale_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_locale_id_locales_id_fk" FOREIGN KEY ("locale_id") REFERENCES "public"."locales"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_locale_id_locales_id_fk" FOREIGN KEY ("locale_id") REFERENCES "public"."locales"("id") ON DELETE no action ON UPDATE no action;