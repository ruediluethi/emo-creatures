from __future__ import annotations

import json
import random
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path

UUID_LENGTH = 8


def random_hex(length: int) -> str:
    return "".join(random.choice("0123456789abcdef") for _ in range(length))


class CardType(str, Enum):
    CREATURE = "creature"
    ENERGY = "energy"
    EVENT = "event"


class EmotionType(str, Enum):
    ANGRY = "wuetend"
    HAPPY = "gluecklich"
    BORED = "gelangweilt"
    SURPRISED = "ueberrascht"
    SCARED = "aengstlich"
    DISGUSTED = "angeekelt"
    SAD = "traurig"
    ROBOT_HAPPY = "neutral_gluecklich"
    ROBOT_UNHAPPY = "neutral_ungluecklich"


@dataclass
class Card:
    name: str
    instance_id: str = field(default_factory=lambda: random_hex(UUID_LENGTH))

    def __str__(self) -> str:
        return f"{self.name} [{self.instance_id}]"

    @property
    def card_type(self) -> CardType:
        raise NotImplementedError


@dataclass(frozen=True)
class Attack:
    name: str
    damage: int
    type: EmotionType
    energy_cost: int
    advantage: int = 0

    @classmethod
    def from_dict(cls, data: dict) -> "Attack":
        return cls(
            name=data["name"],
            damage=int(data["damage"]),
            type=EmotionType(data["type"]),
            advantage=int(data.get("advantage", 0)),
            energy_cost=int(data.get("energy", 0)),
        )

    def __str__(self) -> str:
        return f"{self.name} A{self.damage} E{self.energy_cost} +{self.advantage}"


@dataclass
class CreatureCard(Card):
    index: int = -1
    stage: int = 1
    defense: int = 0
    attacks: list[Attack] = field(default_factory=list)

    # evolves_from_index: int | None = None # TODO

    @property
    def card_type(self) -> CardType:
        return CardType.CREATURE

    @classmethod
    def from_dict(cls, data: dict) -> "CreatureCard":
        return cls(
            name=data["name"],
            index=int(data.get("index", -1)),
            stage=int(data.get("stage", 1)),
            defense=int(data.get("defense", 0)),
            attacks=[Attack.from_dict(a) for a in data.get("attacks", [])],
        )


class CardsPool:
    @staticmethod
    def _resolve_cards_path() -> Path:
        candidates = [
            Path.cwd() / "cards" / "cards.json",
            Path.cwd().parent / "cards" / "cards.json",
            Path(__file__).resolve().parents[2] / "cards" / "cards.json",
        ]
        for candidate in candidates:
            if candidate.exists():
                return candidate
        raise FileNotFoundError("cards.json not found")

    @staticmethod
    def create_random_deck(size: int) -> list[CreatureCard]:
        with CardsPool._resolve_cards_path().open("r", encoding="utf-8") as fh:
            raw_cards = json.load(fh)

        return [
            CreatureCard.from_dict(random.choice(raw_cards))
            for _ in range(size)
        ]
