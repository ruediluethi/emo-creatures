from __future__ import annotations

import random
from typing import TYPE_CHECKING

from .player import Player

if TYPE_CHECKING:
    from server.game import Game


class Bot(Player):
    def on_turn_started(self, game: Game) -> None:
        if not self.hand:
            return

        card = random.choice(self.hand)
        creature = game.play_creature(card.instance_id)

        # attack a random opponent creature if possible
        # if game.opponent_player.field:
        #     target = random.choice(game.opponent_player.field)
        #     print(creature.instance_id, 0, target.instance_id)
        #     game.attack(creature.instance_id, 0, target.instance_id)

        game.end_turn()
