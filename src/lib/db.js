import { supabase } from "@/utils/supabase";

export async function fetchRecycleIds() {
  const { data, error } = await supabase.from("recycleitems").select("id");
  if (error) throw error;
  return new Set(data.map((row) => row.id));
}

export async function fetchCharacters() {
  const { data, error } = await supabase.from("wakfuchars").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function fetchDungeons() {
  const { data, error } = await supabase.from("wakfudungs").select("*").order("id");
  if (error) throw error;
  return data;
}

export async function fetchRewards() {
  const { data, error } = await supabase.from("wakfurewards").select("*");
  if (error) throw error;
  return data;
}

export async function fetchBuilds() {
  const { data, error } = await supabase.from("wakfubuilds").select(`*, wakfubuild_sockets (*)`);
  if (error) throw error;
  return data;
}

export async function addRecycleItem(itemId) {
  const { error } = await supabase.from("recycleitems").insert({ id: parseInt(itemId) });
  if (error) throw error;
}

export async function removeRecycleItem(itemId) {
  const { error } = await supabase.from("recycleitems").delete().eq("id", parseInt(itemId));
  if (error) throw error;
}

export async function deleteReward(id) {
  const { error } = await supabase.from("wakfurewards").delete().eq("id", id);
  if (error) throw error;
}

export async function resetRewards() {
  const { error } = await supabase.from("wakfurewards").delete().gt("id", 0);
  if (error) throw error;
}

export async function updateStasis(id, val) {
  const { error } = await supabase.from("wakfurewards").update({ stasis: val }).eq("id", id);
  if (error) throw error;
}

export async function togglePadreAusente(characterId, newRole) {
  const { error } = await supabase.from("wakfuchars").update({ charrole: newRole }).eq("id", characterId);
  if (error) throw error;
}

export async function addDungeonReward(dungId, charId, stasis) {
  const { error } = await supabase.from("wakfurewards").insert({
    char: parseInt(charId),
    dung: parseInt(dungId),
    stasis: parseInt(stasis),
  });
  if (error) throw error;
}

export async function addDungeonTeamReward(dungId, teamMembers, stasis) {
  const inserts = teamMembers.map((char) => ({
    char: parseInt(char.id),
    dung: parseInt(dungId),
    stasis: parseInt(stasis),
  }));
  const { error } = await supabase.from("wakfurewards").insert(inserts);
  if (error) throw error;
}

export async function addBuild(characterId, level, equipment, socketsData) {
  const cleanEq = {};
  for (const [key, val] of Object.entries(equipment)) {
    if (val) cleanEq[key] = typeof val === "string" ? val.trim() : val;
  }

  const { data: build, error } = await supabase
    .from("wakfubuilds")
    .insert({ character: parseInt(characterId), level: parseInt(level), ...cleanEq })
    .select()
    .single();

  if (error) throw error;

  const socketInserts = [];
  for (const [eq, slots] of Object.entries(socketsData)) {
    for (const slot of slots) {
      if (slot.level > 0) {
        socketInserts.push({
          build_id: build.id,
          equipment: eq,
          slot_index: slot.slot_index,
          level: slot.level,
          color: slot.color,
        });
      }
    }
  }

  if (socketInserts.length > 0) {
    const { error: sockErr } = await supabase.from("wakfubuild_sockets").insert(socketInserts);
    if (sockErr) throw sockErr;
  }

  return build;
}
