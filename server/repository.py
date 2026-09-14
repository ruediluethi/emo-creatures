from __future__ import annotations

from .game import Game


class Repository:
    def __init__(self) -> None:
        self.games: dict[str, Game] = {}

    def save(self, game: Game) -> Game:
        self.games[game.game_id] = game
        return game

    def get(self, game_id: str) -> Game | None:
        return self.games.get(game_id)
