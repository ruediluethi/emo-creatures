from __future__ import annotations

from collections.abc import Callable
from threading import Lock

from .game import Game


class Repository:
    def __init__(self) -> None:
        self.games: dict[str, Game] = {}
        self.game_ids_by_idempotency_key: dict[str, str] = {}
        self._lock = Lock()

    def save(self, game: Game) -> Game:
        self.games[game.game_id] = game
        return game

    def save_new_game(self, game: Game, idempotency_key: str | None = None) -> Game:
        with self._lock:
            self.save(game)
            if idempotency_key is not None:
                self.game_ids_by_idempotency_key[idempotency_key] = game.game_id
            return game

    def get_or_create_new_game(self, create_game: Callable[[], Game], idempotency_key: str | None = None) -> Game:
        with self._lock:
            if idempotency_key is not None:
                existing_game = self.get_by_idempotency_key(idempotency_key)
                if existing_game is not None:
                    return existing_game

            game = create_game()
            self.save(game)
            if idempotency_key is not None:
                self.game_ids_by_idempotency_key[idempotency_key] = game.game_id
            return game

    def get(self, game_id: str) -> Game | None:
        return self.games.get(game_id)

    def get_by_idempotency_key(self, idempotency_key: str) -> Game | None:
        game_id = self.game_ids_by_idempotency_key.get(idempotency_key)
        if game_id is None:
            return None
        return self.get(game_id)
