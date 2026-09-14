from .models.card import Attack, CreatureCard, EmotionType


def build_sample_cards() -> list[CreatureCard]:
    return [
        CreatureCard(
            name="Kruggler",
            index=1,
            stage=1,
            defense=2,
            attacks=[
                Attack(name="Biss", damage=3, type=EmotionType.ANGRY, energy_cost=0),
                Attack(name="Knurren", damage=2, type=EmotionType.SCARED, energy_cost=0),
            ],
        ),
        CreatureCard(
            name="Zornbär",
            index=2,
            stage=1,
            defense=4,
            attacks=[
                Attack(name="Prankenhieb", damage=5, type=EmotionType.ANGRY, energy_cost=1),
            ],
        ),
    ]
