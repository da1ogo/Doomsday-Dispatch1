import json

db_path = r"c:\Users\Dalogo\Desktop\game\database.js"
with open(db_path, "r", encoding="utf-8") as f:
    db_content = f.read()

with open(r"c:\Users\Dalogo\Desktop\game\scratch\procedural_dispatches.json", "r", encoding="utf-8") as f:
    procedural_pool = json.load(f)

# Create JS code for PROCEDURAL_DISPATCH_DATABASE and getDayDispatches
pool_js = f"""

// =========================================================================
// PROCEDURAL DISPATCHES DATABASE ({len(procedural_pool)} UNIQUE VARIANTS)
// =========================================================================
const PROCEDURAL_DISPATCH_DATABASE = {json.dumps(procedural_pool, ensure_ascii=False, indent=2)};

function getDayDispatches(day, seenDispatchIds = []) {{
  // 1. Get story dispatches for this day
  const story = DISPATCH_DATABASE.filter(d => d.day === day);
  story.forEach(d => d.isStory = true);

  // 2. Need exactly 7 dispatches total per day
  const needed = Math.max(0, 7 - story.length);
  const picked = [];

  const unseenPool = PROCEDURAL_DISPATCH_DATABASE.filter(d => !seenDispatchIds.includes(d.id));
  const pool = unseenPool.length >= needed ? unseenPool : PROCEDURAL_DISPATCH_DATABASE;

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (let i = 0; i < needed && i < shuffled.length; i++) {{
    const disp = JSON.parse(JSON.stringify(shuffled[i]));
    disp.day = day;
    
    // Add functional callbacks
    disp.onFulfill = (game, alloc) => {{
      game.modifyRating("gos", disp.isFraud ? -10 : 5);
      if (disp.sectorId) {{
        const sec = game.getSector(disp.sectorId);
        if (sec) {{
          if (disp.req.fuel) sec.heat = Math.min(100, (sec.heat || 70) + 15);
          if (disp.req.food) sec.food = Math.min(100, (sec.food || 70) + 15);
          if (disp.req.meds) sec.sanitation = Math.min(100, (sec.sanitation || 70) + 20);
          if (disp.req.water) sec.water = Math.min(100, (sec.water || 70) + 15);
        }}
      }}
      game.logEvent(`[НАКЛАДНАЯ ПОДПИСАНА]: Ресурсы направлены по заявке [${{disp.sender}}].`);
    }};

    disp.onReject = (game) => {{
      if (disp.isFraud) {{
        game.logEvent(`[ОТКАЗАНО В СНАБЖЕНИИ]: Фальшивая заявка [${{disp.sender}}] отклонена. Склад спасен от растраты.`);
      }} else {{
        game.modifyRating("gos", -10);
        if (disp.sectorId) {{
          const sec = game.getSector(disp.sectorId);
          if (sec) {{
            sec.deadToday = (sec.deadToday || 0) + 2;
            sec.population = Math.max(0, sec.population - 2);
            sec.totalDead = (sec.totalDead || 0) + 2;
            game.totalCasualties = (game.totalCasualties || 0) + 2;
          }}
        }}
        game.logEvent(`[ОТКАЗАНО]: В секторе [${{disp.sender}}] зафиксированы потери из-за дефицита снабжения.`);
      }}
    }};

    picked.push(disp);
  }}

  return [...story, ...picked];
}}
"""

if "const PROCEDURAL_DISPATCH_DATABASE" not in db_content:
    with open(db_path, "a", encoding="utf-8") as f:
        f.write(pool_js)
    print("Injected PROCEDURAL_DISPATCH_DATABASE and getDayDispatches into database.js successfully.")
else:
    print("PROCEDURAL_DISPATCH_DATABASE already exists in database.js.")
