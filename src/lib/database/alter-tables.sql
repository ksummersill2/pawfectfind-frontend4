-- Alter bundles table to add missing columns
DO $$ 
BEGIN
    -- Add status column if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'status'
    ) THEN
        ALTER TABLE bundles ADD COLUMN status text NOT NULL DEFAULT 'active';
    END IF;

    -- Add discount_percentage if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'discount_percentage'
    ) THEN
        ALTER TABLE bundles ADD COLUMN discount_percentage integer NOT NULL DEFAULT 0;
    END IF;

    -- Add total_price if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'total_price'
    ) THEN
        ALTER TABLE bundles ADD COLUMN total_price numeric NOT NULL DEFAULT 0;
    END IF;

    -- Add breed if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'breed'
    ) THEN
        ALTER TABLE bundles ADD COLUMN breed text NOT NULL DEFAULT '';
    END IF;

    -- Add name if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'name'
    ) THEN
        ALTER TABLE bundles ADD COLUMN name text NOT NULL DEFAULT '';
    END IF;

    -- Add timestamps if they don't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE bundles ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundles' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE bundles ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- Alter bundle_items table to add missing columns
DO $$ 
BEGIN
    -- Add price if it doesn't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundle_items' AND column_name = 'price'
    ) THEN
        ALTER TABLE bundle_items ADD COLUMN price numeric NOT NULL DEFAULT 0;
    END IF;

    -- Add timestamps if they don't exist
    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundle_items' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE bundle_items ADD COLUMN created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;

    IF NOT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'bundle_items' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE bundle_items ADD COLUMN updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;
    END IF;
END $$;

-- Add indexes if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'bundles' AND indexname = 'idx_bundles_user_id'
    ) THEN
        CREATE INDEX idx_bundles_user_id ON bundles(user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_indexes 
        WHERE tablename = 'bundle_items' AND indexname = 'idx_bundle_items_bundle_id'
    ) THEN
        CREATE INDEX idx_bundle_items_bundle_id ON bundle_items(bundle_id);
    END IF;
END $$;