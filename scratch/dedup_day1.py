with open('game.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace any duplicate block
needle = """    if (this.day === 1) {
      const lockedMsg = document.getElementById("tor-market-locked");
      const unlockedMsg = document.getElementById("tor-market-unlocked");
      const signalStatus = document.getElementById("tor-signal-status");
      if (lockedMsg) {
        lockedMsg.style.display = "block";
        lockedMsg.innerHTML = `<div style="color: #ff9900; padding: 25px; text-align: center; font-family: monospace; font-size: 11px; line-height: 1.6;">
          <strong>[ПРИКАЗ КОМЕНДАТУРЫ №12]:</strong><br><br>
          Радиоузел законсервирован на регламентное техническое обслуживание до Смены №2.<br><br>
          Доступ к радиоэфиру в первый рабочий день строго воспрещен.
        </div>`;
      }
      if (unlockedMsg) unlockedMsg.style.display = "none";
      if (signalStatus) {
        signalStatus.textContent = "[ОПЕЧАТАНО] Радиоузел законсервирован до Смены №2";
        signalStatus.style.color = "#ff9900";
      }
      return;
    }"""

normalized = content.replace("\r\n", "\n")
double = needle + "\n" + needle
if double in normalized:
    normalized = normalized.replace(double, needle, 1)
    with open('game.js', 'w', encoding='utf-8') as f:
        f.write(normalized)
    print("DEDUP_SUCCESS")
else:
    print("Not found double")
