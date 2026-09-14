from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import random

from server import Game, Repository
from server.models import CardsPool, Player

# start server in karten/
# uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload --reload-dir server


BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
FRONTEND_MEDIA = BASE_DIR.parent / "frontend" / "public" / "media"

app = FastAPI(title="Emotionskreaturen Singleplayer API")
repo = Repository()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewGameRequest(BaseModel):
    player_name: str
class NewGameResponse(BaseModel):
    game_id: str
@app.post("/game/new", response_model=NewGameResponse)
def new_game(payload: NewGameRequest):
    player_name = payload.player_name.strip()
    if not player_name:
        raise HTTPException(status_code=400, detail="player_name is required")

    random.seed(42)

    player_a = Player(player_name, CardsPool.create_random_deck(10))
    player_b = Player("Bot", CardsPool.create_random_deck(10))
    game = Game(player_a, player_b)
    repo.save(game)

    print(game)

    return {"game_id": game.game_id}

@app.get("/game/{game_id}/hand")
def get_player_hand(game_id: str):
    game = repo.get(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    return {
        "hand": game.player_a.hand,
        "field": game.player_a.field,
    }

@app.get("/game/{game_id}/draw")
def draw_card(game_id: str):
    game = repo.get(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    card = game.player_a.draw(1)
    return {
        "hand": game.player_a.hand, 
        "field": game.player_a.field, 
        "drawn_card": card
    }

@app.get("/game/{game_id}/play-creature/{card_id}")
def play_creature(game_id: str, card_id: str):
    game = repo.get(game_id)
    if game is None:
        raise HTTPException(status_code=404, detail="Game not found")

    creature = game.play_creature(card_id)
    if creature is None:
        raise HTTPException(status_code=404, detail="Creature not found")

    return {
        "hand": game.player_a.hand,
        "field": game.player_a.field,
    }

# @app.get("/hand", response_model=NewGameResponse)
# def get_players_hand(payload: NewGameRequest):
#     player_name = payload.player_name.strip()
#     if not player_name:
#         raise HTTPException(status_code=400, detail="player_name is required")

#     # Retrieve the game for the player
#     game = repo.get_by_player_name(player_name)
#     if not game:
#         raise HTTPException(status_code=404, detail="Game not found")

#     hand = game.get_hand_for_player(player_name)
#     return {"game_id": game.game_id, "hand": hand}


if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST / "assets")), name="assets")

if FRONTEND_MEDIA.exists():
    app.mount("/media", StaticFiles(directory=str(FRONTEND_MEDIA)), name="media")


@app.get("/{path:path}")
async def serve_frontend(path: str):
    index_file = FRONTEND_DIST / "index.html"
    if index_file.exists():
        return FileResponse(index_file)
    return {"detail": "Frontend build not found"}

