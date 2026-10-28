# Скрипт точечной настройки меню
with open(r'C:\Users\Dalogo\Desktop\game\style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# 1. Скрываем terminal-footer
if '.terminal-footer {' in css:
    css = css.replace('.terminal-footer {', '.terminal-footer {\n  display: none !important;')
else:
    css += '\n.terminal-footer { display: none !important; }\n'

# 2. Сдвигаем верхнюю шапку ниже
# Обновим #crt-terminal-display и .terminal-header
old_display = '''#crt-terminal-display {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 12px 24px 8px 32px;'''

new_display = '''#crt-terminal-display {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 38px 20px 10px 20px;'''

if old_display in css:
    css = css.replace(old_display, new_display)

# 3. Сдвигаем пункты меню левее и центрируем
old_options = '''.bunker-menu-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 4px 0;
  width: 100%;
  max-width: 375px;
  margin-left: 8px; /* Shift selection contour right */
}'''

new_options = '''.bunker-menu-options {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 6px auto 6px 10px;
  width: 100%;
  max-width: 330px;
}'''

if old_options in css:
    css = css.replace(old_options, new_options)

# 4. Центрируем предупреждение и пунктирную линию
old_warning = '''.terminal-warning-note {
  font-size: 10.5px;
  line-height: 1.35;
  color: #6ebb80;
  font-weight: bold;
  text-align: center;
  border-top: 1px dashed rgba(51, 255, 102, 0.3);
  padding-top: 3px;
  margin-right: 15px;
}'''

new_warning = '''.terminal-warning-note {
  font-size: 9.5px;
  line-height: 1.4;
  color: #6ebb80;
  font-weight: bold;
  text-align: center;
  border-top: 1px dashed rgba(51, 255, 102, 0.35);
  padding-top: 6px;
  margin: 8px auto 0 auto;
  width: 88%;
}'''

if old_warning in css:
    css = css.replace(old_warning, new_warning)

with open(r'C:\Users\Dalogo\Desktop\game\style.css', 'w', encoding='utf-8') as f:
    f.write(css)

print('SUCCESS: Menu positioning and cleanup applied.')
