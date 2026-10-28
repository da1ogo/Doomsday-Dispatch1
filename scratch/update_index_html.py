import re

html_path = r"c:\Users\Dalogo\Desktop\game\index.html"
with open(html_path, "r", encoding="utf-8") as f:
    html = f.read()

# 1. Add desktop icon for minigame icon-flappy (after icon-calc)
flappy_icon = """      <!-- 13. Minigame Flappy Probe Icon -->
      <div class="desktop-icon" id="icon-flappy" title="«Пневмозонд-98»: ретро-тренажер реакции">
        <div class="icon-img-svg">
          <svg viewBox="0 0 32 32">
            <rect x="4" y="4" width="24" height="24" rx="2" fill="#152615" stroke="#000" stroke-width="1.5"/>
            <rect x="9" y="11" width="14" height="10" rx="3" fill="#ffcc00" stroke="#000" stroke-width="1.2"/>
            <circle cx="18" cy="15" r="2.5" fill="#000"/>
            <polygon points="9,16 4,12 4,20" fill="#ff3322"/>
          </svg>
        </div>
        <div class="icon-label">Зонд.exe</div>
      </div>"""

if "id=\"icon-flappy\"" not in html:
    # insert before the closing of desktop-icons
    html = html.replace(
        "    </div> <!-- End .desktop-icons -->",
        flappy_icon + "\n    </div> <!-- End .desktop-icons -->"
    )
    print("1. Added icon-flappy to desktop-icons.")

# 2. Add #win-flappy window
flappy_window = """    <!-- ======================================================================
         WINDOW: MINIGAME «ПНЕВМОЗОНД-98» (FLAPPY BIRD)
         ====================================================================== -->
    <div class="window" id="win-flappy" style="top: 80px; left: 320px; width: 340px; height: 460px; display: none; z-index: 99990;">
      <div class="window-header" style="background: linear-gradient(90deg, #103310, #1b661b);">
        <div class="window-title">🎮 Пневмозонд-98 (Тренажер Реакции)</div>
        <div class="window-controls">
          <button class="win-btn win-close" data-win="win-flappy">X</button>
        </div>
      </div>
      <div class="window-content" style="background: #0d1a10; color: #aaffcc; padding: 10px; display: flex; flex-direction: column; align-items: center; justify-content: space-between;">
        <div style="width: 100%; display: flex; justify-content: space-between; font-family: 'VT323', monospace; font-size: 15px; margin-bottom: 6px;">
          <span>ДИСТАНЦИЯ: <strong id="flappy-score" style="color: #ffff00;">0 м</strong></span>
          <span>РЕКОРД: <strong id="flappy-best" style="color: #33ff66;">0 м</strong></span>
        </div>
        <canvas id="flappy-canvas" width="300" height="340"></canvas>
        <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <span style="font-size: 10px; color: #88c0a0;">Клик мышью или ПРОБЕЛ</span>
          <button class="btn-win" id="btn-flappy-restart" style="font-size: 11px; padding: 3px 12px; font-weight: bold;">[ СТАРТ / СБРОС ]</button>
        </div>
      </div>
    </div>"""

if "id=\"win-flappy\"" not in html:
    html = html.replace(
        "    <!-- ======================================================================\n         WINDOW: OMEGA PROTOCOL TERMINAL",
        flappy_window + "\n\n    <!-- ======================================================================\n         WINDOW: OMEGA PROTOCOL TERMINAL"
    )
    print("2. Added win-flappy window markup.")

# 3. Add 3 action buttons to win-omega
omega_old = """      <div class="window-content" style="background: #020c05; color: #33ff66; font-family: 'Courier New', monospace; padding: 12px; font-size: 12px; overflow-y: auto;">
        <div id="omega-terminal-text" style="line-height: 1.6; white-space: pre-wrap;"></div>
      </div>"""

omega_new = """      <div class="window-content" style="background: #020c05; color: #33ff66; font-family: 'Courier New', monospace; padding: 12px; font-size: 12px; display: flex; flex-direction: column; justify-content: space-between; height: calc(100% - 30px); box-sizing: border-box;">
        <div id="omega-terminal-text" style="line-height: 1.5; white-space: pre-wrap; overflow-y: auto; flex: 1; border: 1px dashed rgba(51,255,102,0.3); padding: 8px; margin-bottom: 10px;"></div>
        <div style="background: #051408; border: 1px solid #00aa33; padding: 8px; display: flex; flex-direction: column; gap: 6px;">
          <div style="font-size: 11px; font-weight: bold; color: #ffff00; text-align: center;">[ ВЫБОР ДЕЙСТВИЯ ОПЕРАТОРА ОМЕГА-ПРОТОКОЛА ]</div>
          <div style="display: flex; gap: 6px; justify-content: center;">
            <button class="btn-win" id="btn-omega-reroute" style="background: #113311; color: #33ff66; font-size: 10px; padding: 5px 8px; font-weight: bold;">
              [ 1. ПЕРЕХВАТ СТРЕЛКИ «КОВЧЕГА» ]
            </button>
            <button class="btn-win" id="btn-omega-leak" style="background: #332200; color: #ffcc00; font-size: 10px; padding: 5px 8px; font-weight: bold;">
              [ 2. СЛИВ АРХИВА В БУНКЕРНУЮ СЕТЬ ]
            </button>
            <button class="btn-win" id="btn-omega-purge" style="background: #330000; color: #ff6666; font-size: 10px; padding: 5px 8px; font-weight: bold;">
              [ 3. УНИЧТОЖЕНИЕ ДАННЫХ И СЛЕДОВ ]
            </button>
          </div>
        </div>
      </div>"""

if "btn-omega-reroute" not in html:
    html = html.replace(omega_old, omega_new, 1)
    print("3. Added 3 interactive action buttons to win-omega.")

# 4. Add conduits panel to win-map
map_supply_end = """                <button class="btn-win" id="btn-map-dispatch-supply" style="width: 100%; color: #006600; font-weight: bold; font-size: 10px; padding: 4px;">
                  [ ОТГРУЗИТЬ В СЕКТОР ]
                </button>
              </div>"""

map_conduits_markup = """                <button class="btn-win" id="btn-map-dispatch-supply" style="width: 100%; color: #006600; font-weight: bold; font-size: 10px; padding: 4px;">
                  [ ОТГРУЗИТЬ В СЕКТОР ]
                </button>
              </div>

              <!-- Infrastructure Conduits & Switches -->
              <div class="map-conduits-panel">
                <div style="font-weight: bold; color: #ffcc00; font-size: 11px; margin-bottom: 2px;">
                  ⚙️ ИНФРАСТРУКТУРНЫЕ МАГИСТРАЛИ:
                </div>
                <div class="conduit-row">
                  <span style="color: #ff6666; font-size: 11px;">🔥 ТЕПЛОТРАССА:</span>
                  <button class="conduit-switch-btn active" id="btn-conduit-heat" data-mode="mine">
                    В ШАХТУ [РЕЖИМ А]
                  </button>
                </div>
                <div class="conduit-row">
                  <span style="color: #ffea00; font-size: 11px;">⚡ ЭНЕРГОСЕТЬ:</span>
                  <button class="conduit-switch-btn active" id="btn-conduit-power" data-mode="water">
                    ВОДООЧИСТКА [РЕЖИМ А]
                  </button>
                </div>
                <div class="conduit-row">
                  <span style="color: #66ccff; font-size: 11px;">💧 ГИДРОСЕТЬ:</span>
                  <button class="conduit-switch-btn active" id="btn-conduit-hydro" data-mode="hydro">
                    ГИДРОПОНИКА [РЕЖИМ А]
                  </button>
                </div>
              </div>"""

if "map-conduits-panel" not in html:
    html = html.replace(map_supply_end, map_conduits_markup, 1)
    print("4. Added map-conduits-panel to win-map.")

# 5. Update stationary tutorial manual win-tutorial with 7 focused chapters
tutorial_content = """        <div class="inset-panel" style="flex: 1; overflow-y: auto; background: #fffffa; padding: 12px; font-size: 11px; line-height: 1.5; color: #111;">
          
          <div style="text-align: center; border-bottom: 2px solid #800000; padding-bottom: 6px; margin-bottom: 12px;">
            <div style="font-size: 14px; font-weight: 900; color: #800000; letter-spacing: 1px;">
              ГЛАВНОЕ УПРАВЛЕНИЕ БУНКЕРНЫХ ПОСЕЛЕНИЙ СССР
            </div>
            <div style="font-size: 10px; color: #555; text-transform: uppercase;">
              Служебный регламент оператора пневмосети • Экземпляр №41
            </div>
          </div>

          <!-- Глава 1: Телетайп и депеши -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 1. ТЕЛЕТАЙП И ВХОДЯЩИЕ ДЕПЕШИ
            </div>
            <p style="margin: 0;">
              В окно <strong>«Депеши»</strong> поступают оперативные запросы от шести аванпостов комплекса. Обращайте внимание на приоритет (СТАНДАРТ, ВЫСОКИЙ, СРОЧНО) и сектор-отправитель. Депеши поступают с естественной радиопаузой в течение смены.
            </p>
          </div>

          <!-- Глава 2: Анализ датчиков и телеметрии -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 2. АНАЛИЗ ДАТЧИКОВ И ТЕЛЕМЕТРИИ
            </div>
            <p style="margin: 0;">
              <strong>Никогда не верьте тексту на слово!</strong> Всегда сверяйте показания датчиков внизу бланка:
              <br>• Если заявляют о лютом морозе, а термодатчик фиксирует +20°C — это фальшивка!
              <br>• При уровне паров алкоголя &gt;1.5 ‰ депеша сфабрикована нетрезвым персоналом.
              <br>• Необоснованная выдача ресурсов мошенникам карается штрафом при утренней проверке.
            </p>
          </div>

          <!-- Глава 3: Накладная и регуляторы [-] [+] -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 3. НАКЛАДНАЯ И РЕГУЛЯТОРЫ [-] [+]
            </div>
            <p style="margin: 0;">
              Ресурсы со склада списываются строго регуляторами <strong>[-]</strong> и <strong>[+]</strong>.
              <br>• Кнопка «Подписать накладную» активна <strong>только</strong> при добавлении хотя бы 1 единицы ресурса.
              <br>• Подписать пустой бланк невозможно. Если запрос ложный — жмите <strong>«Отказать»</strong>.
            </p>
          </div>

          <!-- Глава 4: Тактическая карта бункера -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 4. ТАКТИЧЕСКАЯ КАРТА БУНКЕРА
            </div>
            <p style="margin: 0;">
              Карта отображает 6 секторов комплекса «Омега». Клик по сектору открывает 5 ключевых шкал: Тепло, Сытость, Санитария, Вода и Риск бунта. Через панель отгрузки на карте можно направить ресурсы со склада напрямую в сектор.
            </p>
          </div>

          <!-- Глава 5: Магистрали и тумблеры -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 5. ИНФРАСТРУКТУРНЫЕ МАГИСТРАЛИ И ТУМБЛЕРЫ
            </div>
            <p style="margin: 0;">
              На карте расположены 3 переключателя магистралей:
              <br>• <strong>Теплотрасса:</strong> перенаправление пара между Шахтой и Жилым Блоком.
              <br>• <strong>Энергосеть:</strong> переключение мощности между Водоочисткой и Радаром.
              <br>• <strong>Гидросеть:</strong> распределение воды между Теплицами и кранами граждан.
              <br>Тумблеры позволяют спасать замерзающие и жаждущие сектора <em>без расхода складских запасов</em>.
            </p>
          </div>

          <!-- Глава 6: Склад Госрезерва и завершение дня -->
          <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 6. СКЛАД ГОСРЕЗЕРВА И ЗАВЕРШЕНИЕ ДНЯ
            </div>
            <p style="margin: 0;">
              В окне <strong>«Склад Госрезерва»</strong> ведется учет запасов (Топливо, Пайки, Медпаки, Патроны, Вода). Каждое утро центральные базы доставляют пополнение. Когда план депеш смены выполнен, нажмите кнопку <strong>«[ Завершить смену и закрыть день ]»</strong>.
            </p>
          </div>

          <!-- Глава 7: Экономика и зарплата -->
          <div>
            <div style="font-weight: bold; font-size: 12px; color: #000080; border-left: 3px solid #000080; padding-left: 6px; margin-bottom: 4px;">
              ГЛАВА 7. ЭКОНОМИКА И ЗАРПЛАТА
            </div>
            <p style="margin: 0;">
              • Каждое утро диспетчеру начисляется оклад (+700 руб.).
              <br>• В утренней сводке вычитаются штрафы за допущенные за смену ошибки.
              <br>• <strong>Критический лимит долга:</strong> если баланс падает до <strong>-2400 руб.</strong>, Военный Трибунал немедленно арестовывает оператора за саботаж (игра окончена).
            </p>
          </div>

        </div>"""

# Replace tutorial manual content
tut_start = html.find("<div class=\"window\" id=\"win-tutorial\"")
if tut_start != -1:
    tut_panel_start = html.find("<div class=\"inset-panel\"", tut_start)
    tut_panel_end = html.find("</div>\n\n        <div style=\"display: flex; justify-content: space-between;", tut_panel_start)
    if tut_panel_start != -1 and tut_panel_end != -1:
        html = html[:tut_panel_start] + tutorial_content + html[tut_panel_end + 6:]
        print("5. Updated stationary tutorial manual in win-tutorial with 7 chapters.")

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html)

print("ALL INDEX.HTML UPDATES COMPLETE.")
