ALTER TYPE "public"."product_status" ADD VALUE 'out_of_stock';--> statement-breakpoint
ALTER TYPE "public"."product_status" ADD VALUE 'in_stock';--> statement-breakpoint
ALTER TYPE "public"."product_status" ADD VALUE 'on_sale';--> statement-breakpoint
DROP TYPE "public"."locales_names";