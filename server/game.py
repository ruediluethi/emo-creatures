from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from .models.card import random_hex, UUID_LENGTH
from .models.player import Player


@dataclass
class Game:
    player_a: Player
    player_b: Player
    game_id: str = field(default_factory=lambda: random_hex(UUID_LENGTH))
    current_player: Player = field(init=False)
    opponent_player: Player = field(init=False)
    turn_number: int = 1
    log: list[dict[str, Any]] = field(default_factory=list)

    def __post_init__(self) -> None:
        self.current_player = self.player_a
        self.opponent_player = self.player_b
        self.log.append({
            "turn_number": self.turn_number,
            "action": "turn_started",
            "attr": [self.current_player.display_name],
        })
        self.current_player.on_turn_started(self)

    
    def play_creature(self, card_id: str) -> None:
        """
        Play a creature card from the current player's hand to the field.

        Args:
            card_id: Instance ID of the creature card to play.

        Returns:
            The creature instance if successfully played, None otherwise.
        """
        creature = self.current_player.play_creature(card_id)
        if creature is not None:
            self.log.append({
                "turn_number": self.turn_number,
                "action": "play_creature",
                "attr": [card_id],
            })
        return creature

    def attack(self, attacker_id: str, defender_id: str, attack_index: int = 0) -> None:
        """
        Resolve an attack from the current player's one creature to an opponent's creature.

        Args:
            attacker_id: Instance ID of the attacking creature.
            defender_id: Instance ID of the defending creature.
            attack_index: Which attack of the attacker to use.

        Returns:
            None
        """
        attacker = next((c for c in self.current_player.field if c.instance_id == attacker_id), None)
        defender = next((c for c in self.opponent_player.field if c.instance_id == defender_id), None)
        if attacker and defender:
            # Check if the attack is strong enough to defeat the defender
            if attacker.attacks[attack_index].damage >= defender.defense:
                self.opponent_player.field.remove(defender)
            # the defender strikes back
            # use always the first (fast) attack for defense
            if defender.attacks[0].damage >= attacker.defense:
                self.current_player.field.remove(attacker)
            self.log.append({
                "turn_number": self.turn_number,
                "action": "attack",
                "attr": [attacker_id, attack_index, defender_id],
            })

    def end_turn(self) -> None:
        """
        Increment the turn number.
        Switch current player and opponent player.
        Draw a new card from the deck to the current player's hand.
        Notify the current player that their turn has started.

        Returns:
            None
        """
        # increment the turn number
        self.turn_number += 1
        # switch the current and opponent players
        if self.current_player is self.player_a:
            self.current_player = self.player_b
            self.opponent_player = self.player_a
        else:
            self.current_player = self.player_a
            self.opponent_player = self.player_b
        self.log.append({
            "turn_number": self.turn_number,
            "action": "end_turn",
            "attr": [self.current_player.display_name],
        })
        # at the start of the new turn, the current player draws a card
        self.current_player.draw(1)
        # notify the current player that their turn has started
        self.current_player.on_turn_started(self)

    def __str__(self) -> str:
        return (
            f"--- {self.turn_number} ---\n"
            f"Hand Player A: {', '.join(str(card) for card in self.player_a.hand) or 'leer'}\n"
            f"Hand Player B: {', '.join(str(card) for card in self.player_b.hand) or 'leer'}\n"
            f"Field Player A: {', '.join(str(creature) for creature in self.player_a.field) or 'leer'}\n"
            f"Field Player B: {', '.join(str(creature) for creature in self.player_b.field) or 'leer'}\n"
        )
