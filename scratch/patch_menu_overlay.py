with open(r'C:\Users\Dalogo\Desktop\game\index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '        <!-- Layer 2: CRT Curved Screen Viewport'
overlay_div = '        <div id="menu-bunker-overlay"></div>\n        <!-- Layer 2: CRT Curved Screen Viewport'

if 'id="menu-bunker-overlay"' not in html:
    html = html.replace(target, overlay_div)
    with open(r'C:\Users\Dalogo\Desktop\game\index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print('SUCCESS: menu-bunker-overlay added to index.html')
else:
    print('ALREADY PRESENT')
