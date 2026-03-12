import { supabase } from "@/integrations/supabase/client";
import { genCode } from "@/lib/househub";

export const houseService = {
  /**
   * Generates a 6-digit house code and ensures it's unique in the database.
   */
  async generateUniqueHouseCode(): Promise<string> {
    let code = "";
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      code = genCode();
      const { data, error } = await supabase
        .from("houses")
        .select("house_code")
        .eq("house_code", code)
        .maybeSingle();

      if (error) {
        console.error("Error checking house code uniqueness:", error.message);
        throw new Error("Failed to verify house code uniqueness");
      }

      if (!data) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error("Failed to generate a unique house code after multiple attempts");
    }

    return code;
  },

  /**
   * Inserts a new house into the database.
   */
  async createHouse(name: string, code: string) {
    const { data, error } = await supabase
      .from("houses")
      .insert({
        name: name.trim(),
        house_code: code,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating house in Supabase:", error.message);
      throw error;
    }

    return data;
  },
};
