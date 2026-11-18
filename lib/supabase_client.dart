import 'package:supabase/supabase.dart';
import 'package:ubi_container_new/supabase_config.dart';

final SupabaseClient supabaseClient = SupabaseClient(
  SupabaseConfig.url,
  SupabaseConfig.publishableKey,
);
