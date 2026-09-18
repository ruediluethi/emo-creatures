from __future__ import annotations

from dataclasses import dataclass, field
from typing import TYPE_CHECKING

from .card import Card
from .creature import Creature

if TYPE_CHECKING:
    from server.game import Game


@dataclass
class Player:
    display_name: str
    deck: list[Card]
    hand: list[Card] = field(default_factory=list)
    field: list[Creature] = field(default_factory=list)

    def __post_init__(self) -> None:
        # self.hand = self.draw(3)
        self.draw(3)

    def on_turn_started(self, game: Game) -> None:
        pass

    def draw(self, count: int = 1) -> list[Card]:
        drawn: list[Card] = []
        for _ in range(count):
            if not self.deck:
                break
            drawn.append(self.deck.pop())
        self.hand.extend(drawn)
        return drawn

    def play_creature(self, card_id: str) -> Creature | None:
        for index, card in enumerate(self.hand):
            if card.instance_id == card_id:
                self.hand.pop(index)
                creature = Creature.from_card(card)
                self.field.append(creature)
                return creature
        return None
