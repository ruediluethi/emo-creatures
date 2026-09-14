# Emotionskreaturen — Client-Boilerplate

Vite + React. Drag&Drop über `@dnd-kit`. Framer Motion nur noch dort,
wo keine dnd-kit-Drag-Quelle involviert ist (Details unten). Ungetestet
in diesem Chat — bitte lokal selbst prüfen (`npm install && npm run dev`).

## Setup

```bash
npm install
npm run dev
```

## Aktueller Funktionsumfang

- Hand an der unteren Bildschirmkante, jede Karte ein `<img>`
  (Platzhalter-SVG, siehe `src/data/cardTemplates.js` — `imageUrl`
  später gegen echte Assets tauschen)
- Deck-Button (Dummy) zieht per Klick eine zufällige Karte in die Hand
- Drag&Drop einer Handkarte ins Feld — wird immer rechts angehängt
  (kein Einfügen zwischen bestehenden Feldkarten)
- Transluzente Vorschau-Karte am Feld-Ende, solange man beim Ziehen
  über dem Feld hängt
- Gegnerfeld (oberhalb der Trennlinie) mit eigenem Debug-Button, der
  eine zufällige Karte hinzufügt
- Drag&Drop einer eigenen Feldkarte auf eine bestimmte Gegnerkarte
  (Angriff) — mit visuellem Feedback (Lunge beim Angreifer, Impact-Puls
  beim Ziel), aber **ohne Kampf-Logik** (keine Schadensberechnung,
  keine entfernten Kreaturen — das kommt später vom Server)
- Noch **keine** Spiellogik: kein Zugzwang, keine Reihenfolge, kein
  Deck-Limit, keine Server-Anbindung

## Architektur

```
src/
  data/cardTemplates.js       Kartenpool + Platzhalter-Bildgenerierung
  components/
    CardFace.jsx                Rein visuelle Karte, kennt weder dnd-kit noch Framer Motion
    DraggableHandCard.jsx        Drag-Quelle: Hand -> Feld (data.type = "handCard")
    Hand.jsx                     Reine Reihenfolge aus dem Array, CSS-Keyframe für Eintritt
    PlayerFieldCard.jsx          Drag-Quelle: Feld -> Gegnerkarte, Angriff (data.type = "playerFieldCard")
    Field.jsx                    Drop-Zone für Handkarten + rendert PlayerFieldCard
    OpponentFieldCard.jsx        Drop-ZIEL: einzelne Gegnerkarte (data.type = "opponentCreature")
    OpponentField.jsx            Rendert OpponentFieldCard-Liste, kein eigenes Drop-Ziel (nur die Karten selbst sind es)
    DeckButton.jsx                Dummy-Button zum Kartenziehen
    DebugAddOpponentCardButton.jsx Dummy-Button: zufällige Karte ins Gegnerfeld
  App.jsx                          DndContext, unterscheidet zwei Drag-Quellen über active.data.current.type
```

**Zwei Drag-Quellen, ein DndContext:** `App.jsx` liest
`event.active.data.current.type` in `onDragStart`, um zwischen
"Handkarte spielen" (`handCard`) und "Feldkarte greift an"
(`playerFieldCard`) zu unterscheiden — beide laufen über denselben
`DndContext`, aber mit unterschiedlicher `onDragEnd`-Logik je nach
Quelle und Ziel (`over.data.current.type`).

**Wichtig — konsequent aus den vorherigen Bugs gelernt:** Sowohl
`PlayerFieldCard` als auch `DraggableHandCard` verzichten bewusst auf
Framer Motion auf der Drag-Quelle selbst (nur `isDragging` aus dem
dnd-kit-Hook, reine CSS-Keyframe für den Eintritt). Framer Motion wird
nirgends mehr mit einem dnd-kit-Drag-Element kombiniert — das war die
Ursache aller Flash-/Ruckel-Bugs in den vorherigen Versionen.

## Warum kein Sortable im Feld (frühere Entscheidung)

Die erste Version nutzte `@dnd-kit/sortable` in Hand UND Feld, um eine
Karte zwischen zwei bestehenden Feldkarten einfügen zu können. Das
brauchte in `onDragOver` eine kontinuierliche Live-Umsortierung des
State bei jeder Zeigerbewegung über eine andere Karte — kombiniert mit
Framer Motions `layout`-Animation auf denselben Elementen führte das
zu Rucklern und falsch erkannten Drop-Positionen. Da "zwischen
einfügen" nicht gebraucht wird, fiel diese Komplexität weg. Karten
werden nur bei `onDragEnd` von der Hand entfernt und ans Ende des
Feld-Arrays angehängt. `@dnd-kit/sortable` wird nirgends mehr
gebraucht und ist aus `package.json` entfernt.

## Weitere Bugfixes aus früheren Testrunden

- **`collisionDetection`: `closestCenter` -> `pointerWithin`**:
  `closestCenter` wählt immer die nächstgelegene Drop-Zone — da das
  Feld die einzige registrierte Zone war, "gewann" sie immer, egal wie
  weit der Zeiger tatsächlich entfernt war. `pointerWithin` zählt nur,
  wenn der Zeiger wirklich innerhalb der Zone liegt.
- **`DragOverlay dropAnimation={null}`**: verhindert, dass dnd-kit die
  Karte beim Loslassen standardmäßig zur (schon entfernten)
  Ursprungsposition zurückfliegen lässt.
- **Kein Framer Motion mehr auf Drag-Quellen**: Ein hartnäckiger
  Ein-Frame-Flash beim erfolgreichen Drop ließ sich durch zusätzliche
  eigene State-Schichten (custom `isDimmed`/`isReturning`) nicht sauber
  beheben — das hat die Sache nur komplizierter gemacht. Die Lösung war,
  näher am dnd-kit-Standardmuster zu bleiben: nur `isDragging` direkt
  aus `useDraggable()`, Eintritts-Animation über simple CSS-Keyframe
  (`.card-enter` in `index.css`) statt Framer Motion. Dieses Muster gilt
  jetzt für Hand UND Feld gleichermaßen (`PlayerFieldCard`).

## Bewusst offen / TODO

- **Keine Kampf-Logik**: Ein Angriff löst aktuell nur eine visuelle
  Rückmeldung aus, keine Schadensberechnung, keine entfernten
  Kreaturen. Das gehört zur serverseitigen Spiellogik.
- Touch-Verhalten (Sensor-Konstanten `distance`/`delay`/`tolerance`)
  ist ungetestet auf echten Geräten — ggf. nachjustieren.
- Keine Anbindung an den Python-Server — Kartendaten kommen aktuell
  rein lokal aus `cardTemplates.js`.
- Bei abgelehntem Drop (Hand->Feld) snappt die Karte instant zurück,
  ohne Animation.
