ALTER TABLE "user_subscription"
ADD COLUMN "stripe_customer_id" text NOT NULL UNIQUE,
ADD COLUMN "stripe_subscription_id" text,
ALTER COLUMN "stripe_price_id" SET NOT NULL;
