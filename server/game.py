from __future__ import annotations

from dataclasses import dataclass, field

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

    def __post_init__(self) -> None:
        self.current_player = self.player_a
        self.opponent_player = self.player_b

    def play_creature(self, card_id: str) -> None:
        return self.current_player.play_creature(card_id)

    def attack(self, attacker_id: str, attack_index: int, defender_id: str) -> None:
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

    def end_turn(self) -> None:
        self.turn_number += 1
        if self.current_player is self.player_a:
            self.current_player = self.player_b
            self.opponent_player = self.player_a
        else:
            self.current_player = self.player_a
            self.opponent_player = self.player_b

    def __str__(self) -> str:
        return (
            f"--- {self.turn_number} ---\n"
            f"Hand Player A: {', '.join(str(card) for card in self.player_a.hand) or 'leer'}\n"
            f"Hand Player B: {', '.join(str(card) for card in self.player_b.hand) or 'leer'}\n"
            f"Field Player A: {', '.join(str(creature) for creature in self.player_a.field) or 'leer'}\n"
            f"Field Player B: {', '.join(str(creature) for creature in self.player_b.field) or 'leer'}\n"
        )
