with open('game.js', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'if (winId === "win-tor") this.clearDemonicAnomaly("radio");',
    'if (winId === "win-tor") this.clearDemonicAnomaly("radio");\n    if (winId === "win-omega") document.body.classList.remove("omega-negative-active");'
)

with open('game.js', 'w', encoding='utf-8') as f:
    f.write(c)

print("Updated closeWindow in game.js")
