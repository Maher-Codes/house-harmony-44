import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://dtxrzojypppeunbesurn.supabase.co";
const supabaseKey = "sb_publishable_8rE1DBqt_KsGRbrNgQt1gg__HEQyp9B";

export const supabase = createClient(supabaseUrl, supabaseKey);
