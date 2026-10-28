import re

css_path = r'C:\Users\Dalogo\Desktop\game\style.css'
with open(css_path, 'r', encoding='utf-8') as f:
    css = f.read()

# Заменим блок вокруг #menu-bunker-scene, #crt-screen-viewport, #menu-bunker-overlay
old_block_pattern = r'#menu-bunker-scene\s*\{.*?(?=\/\* Menu list)'

new_block = '''#menu-bunker-scene {
  position: relative;
  width: 100vw;
  height: 55.86vw; /* 1024x572 точное соотношение */
  max-height: 100vh;
  max-width: 179vh;
  background: #000000;
  box-shadow: 0 0 60px rgba(0, 0, 0, 0.98);
  overflow: hidden;
}

/* СЛОЙ 1 (z-index: 1 / Задний слой): Терминал BunkerOS под вырезом кинескопа */
#crt-screen-viewport {
  position: absolute;
  left: 21.48%;
  top: 11.36%;
  width: 47.75%;
  height: 61.89%;
  background: #040f08;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

/* СЛОЙ 2 (z-index: 2 / Передний слой): Маска 100% со всеми деталями (лампа, стол, рамка кинескопа) */
#menu-bunker-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  background: url('img/menu_bunker_mask.png') center center / 100% 100% no-repeat;
  z-index: 2;
}

/* Скрываем старые дублирующие световые оверлеи, так как лампа и тени уже в маске */
#menu-lamp-light,
#menu-table-shadow {
  display: none !important;
}

/* Эффекты стекла внутри кинескопа */
.crt-glass-curvature {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at 45% 36%,
    rgba(255, 255, 255, 0.04) 0%,
    transparent 55%
  );
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.9);
  z-index: 5;
}

.crt-scanline-raster {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%,
    rgba(0, 0, 0, 0.35) 50%
  );
  background-size: 100% 4px;
  z-index: 6;
  opacity: 0.8;
}

.crt-beam-roll {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(51, 255, 102, 0.04) 50%,
    transparent 100%
  );
  height: 35%;
  animation: crtBeamSweep 6s linear infinite;
  z-index: 7;
}

@keyframes crtBeamSweep {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(400%); }
}

/* Содержимое терминала */
#crt-terminal-display {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px 24px 8px 32px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  color: #33ff66;
  font-family: 'Courier New', 'Lucida Console', Monaco, monospace;
  text-shadow: 0 0 6px rgba(51, 255, 102, 0.88), 0 0 14px rgba(51, 255, 102, 0.5);
  box-sizing: border-box;
  animation: crtJitter50Hz 0.12s infinite;
  z-index: 4;
}

@keyframes crtJitter50Hz {
  0% { transform: translate(0, 0); }
  25% { transform: translate(0.3px, -0.2px); }
  50% { transform: translate(-0.2px, 0.3px); }
  75% { transform: translate(0.1px, 0.1px); }
  100% { transform: translate(0, 0); }
}

.terminal-header {
  text-align: center;
  flex-shrink: 0;
  margin-right: 10px;
}
.terminal-banner {
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 1.5px;
}
.terminal-subline {
  font-size: 11px;
  color: #6ebb80;
  font-weight: bold;
  margin-top: 2px;
}
.terminal-divider {
  font-size: 11px;
  color: rgba(51, 255, 102, 0.5);
  overflow: hidden;
  white-space: nowrap;
  margin-top: 1px;
}

'''

css_updated, count = re.subn(old_block_pattern, new_block, css, flags=re.DOTALL)
print('Substitutions made:', count)
if count > 0:
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(css_updated)
    print('CSS successfully updated with 2-layer clean system!')
else:
    print('ERROR: Pattern not matched!')
