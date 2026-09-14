from __future__ import annotations

from dataclasses import dataclass, field

from .card import Attack, CreatureCard, random_hex, UUID_LENGTH


@dataclass
class Creature:
    card_template: CreatureCard
    instance_id: str = field(default_factory=lambda: random_hex(UUID_LENGTH))
    defense: int = 0
    attacks: list[Attack] = field(default_factory=list)

    @classmethod
    def from_card(cls, card: CreatureCard) -> "Creature":
        return cls(
            card_template=card,
            defense=card.defense,
            attacks=list(card.attacks),
        )

    def __str__(self) -> str:
        attacks = ", ".join(str(attack) for attack in self.attacks)
        return f"{self.card_template.name} [{self.instance_id}] D{self.defense}: {attacks or 'keine'}"
