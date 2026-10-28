import re

path = r'C:\Users\Dalogo\Desktop\game\index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

target = '<div id="menu-bunker-scene">'
replacement = '''<div id="menu-bunker-scene">
        <!-- СЛОЙ 2 (z-index: 2): Передняя маска с вырезом монитора -->
        <div id="menu-bunker-overlay"></div>'''

if 'id="menu-bunker-overlay"' not in html:
    html = html.replace(target, replacement, 1)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('SUCCESS: menu-bunker-overlay added to index.html!')
else:
    print('ALREADY EXISTS')
