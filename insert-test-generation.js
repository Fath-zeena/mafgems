const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://awnihpkyjmycjehgsnzo.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3bmlocGt5am15Y2plaGdzbnpvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDU0ODk2NSwiZXhwIjoyMDc2MTI0OTY1fQ._S95XoYU2Gb7KO2CRNIiW_1h7whtGiZJ_wUzoYmjMqM';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function insertTestGeneration() {
  try {
    // First, try to get an existing user
    const { data: users, error: userError } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    let userId = null;
    if (users && users.length > 0) {
      userId = users[0].id;
      console.log(`Found existing user: ${userId}`);
    } else {
      console.log('No existing users found, using null for user_id (if table allows)');
    }

    const { data, error } = await supabase
      .from('presentation_generations')
      .insert({
        user_id: userId,
        input_method: 'text-to-image',
        jewelry_type: 'ring',
        output_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1024&q=80',
        output_type: 'image',
        configuration: JSON.stringify({ design: 'luxurious diamond ring with platinum band', gender: 'woman' }),
        status: 'completed',
      });

    if (error) {
      console.error('❌ Error inserting:', error);
      process.exit(1);
    }

    console.log('✓ Successfully inserted test generation:');
    console.log(JSON.stringify(data, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('❌ Unexpected error:', err);
    process.exit(1);
  }
}

insertTestGeneration();
