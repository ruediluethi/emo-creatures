from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# start server with python -m uvicorn main:app --reload

app = FastAPI(title="Emotionskreaturen Singleplayer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class NewGameRequest(BaseModel):
    player_name: str
class NewGameResponse(BaseModel):
    game_id: str

@app.post("/new_game", response_model=NewGameResponse)
def new_game(payload: NewGameRequest):
    player_name = payload.player_name.strip()
    if not player_name:
        raise HTTPException(status_code=400, detail="player_name is required")

    # game = Game(
    #     player_A=Player(player_name, CardsPool.create_random_deck(10)),
    #     player_B=Player("Bot", CardsPool.create_random_deck(10)),
    # )
    print("test")

    # return {"game_id": game.game_id}
    return {"game_id": "test"}