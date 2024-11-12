// Add to existing file...

export const initializeBundleTables = async () => {
  try {
    const { error } = await supabase.rpc('init_bundle_tables');
    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error initializing bundle tables:', err);
    return false;
  }
};

export const createBundle = async (data: {
  user_id: string | null;
  name: string;
  breed: string;
  total_price: number;
  discount_percentage: number;
  items: Array<{
    product_id: string;
    price: number;
  }>;
}) => {
  const { user_id, name, breed, total_price, discount_percentage, items } = data;
  
  try {
    // Start a Supabase transaction
    const { data: bundle, error: bundleError } = await supabase
      .from('bundles')
      .insert({
        user_id,
        name,
        breed,
        total_price,
        discount_percentage,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (bundleError) throw bundleError;

    // Insert bundle items
    const bundleItems = items.map(item => ({
      bundle_id: bundle.id,
      product_id: item.product_id,
      price: item.price,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    const { error: itemsError } = await supabase
      .from('bundle_items')
      .insert(bundleItems);

    if (itemsError) throw itemsError;

    return bundle;
  } catch (err) {
    console.error('Error creating bundle:', err);
    throw err;
  }
};