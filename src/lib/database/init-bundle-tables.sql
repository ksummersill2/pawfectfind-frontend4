-- Initialize bundle tables
CREATE OR REPLACE FUNCTION init_bundle_tables()
RETURNS void AS $$
BEGIN
    -- Create bundles table if it doesn't exist
    CREATE TABLE IF NOT EXISTS bundles (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id uuid REFERENCES auth.users(id),
        name text NOT NULL,
        breed text NOT NULL,
        total_price numeric NOT NULL,
        discount_percentage integer NOT NULL DEFAULT 0,
        status text NOT NULL DEFAULT 'active',
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create bundle_items table if it doesn't exist
    CREATE TABLE IF NOT EXISTS bundle_items (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        bundle_id uuid REFERENCES bundles(id) ON DELETE CASCADE NOT NULL,
        product_id uuid REFERENCES products(id) NOT NULL,
        price numeric NOT NULL,
        created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
        updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_bundles_user_id ON bundles(user_id);
    CREATE INDEX IF NOT EXISTS idx_bundle_items_bundle_id ON bundle_items(bundle_id);

    -- Enable RLS
    ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE bundle_items ENABLE ROW LEVEL SECURITY;

    -- Create RLS policies
    DO $policies$ BEGIN
        -- Bundles policies
        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundles' AND policyname = 'Public bundles are viewable by everyone'
        ) THEN
            CREATE POLICY "Public bundles are viewable by everyone" ON bundles
                FOR SELECT USING (true);
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundles' AND policyname = 'Users can insert their own bundles'
        ) THEN
            CREATE POLICY "Users can insert their own bundles" ON bundles
                FOR INSERT WITH CHECK (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundles' AND policyname = 'Users can update their own bundles'
        ) THEN
            CREATE POLICY "Users can update their own bundles" ON bundles
                FOR UPDATE USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundles' AND policyname = 'Users can delete their own bundles'
        ) THEN
            CREATE POLICY "Users can delete their own bundles" ON bundles
                FOR DELETE USING (auth.uid() = user_id);
        END IF;

        -- Bundle items policies
        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundle_items' AND policyname = 'Bundle items are viewable by everyone'
        ) THEN
            CREATE POLICY "Bundle items are viewable by everyone" ON bundle_items
                FOR SELECT USING (true);
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundle_items' AND policyname = 'Users can insert bundle items for their bundles'
        ) THEN
            CREATE POLICY "Users can insert bundle items for their bundles" ON bundle_items
                FOR INSERT WITH CHECK (
                    EXISTS (
                        SELECT 1 FROM bundles
                        WHERE id = bundle_items.bundle_id
                        AND user_id = auth.uid()
                    )
                );
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundle_items' AND policyname = 'Users can update bundle items for their bundles'
        ) THEN
            CREATE POLICY "Users can update bundle items for their bundles" ON bundle_items
                FOR UPDATE USING (
                    EXISTS (
                        SELECT 1 FROM bundles
                        WHERE id = bundle_items.bundle_id
                        AND user_id = auth.uid()
                    )
                );
        END IF;

        IF NOT EXISTS (
            SELECT FROM pg_policies WHERE tablename = 'bundle_items' AND policyname = 'Users can delete bundle items for their bundles'
        ) THEN
            CREATE POLICY "Users can delete bundle items for their bundles" ON bundle_items
                FOR DELETE USING (
                    EXISTS (
                        SELECT 1 FROM bundles
                        WHERE id = bundle_items.bundle_id
                        AND user_id = auth.uid()
                    )
                );
        END IF;
    END $policies$;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;