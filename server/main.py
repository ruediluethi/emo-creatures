from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

# start server with
# python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

BASE_DIR = Path(__file__).resolve().parent
FRONTEND_DIST = BASE_DIR.parent / "frontend" / "dist"
FRONTEND_MEDIA = BASE_DIR.parent / "frontend" / "public" / "media"

app = FastAPI(title="Emotionskreaturen Singleplayer API")

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


@app.post("/new_game", response_model=NewGameResponse)
def new_game(payload: NewGameRequest):
    player_name = payload.player_name.strip()
    if not player_name:
        raise HTTPException(status_code=400, detail="player_name is required")

    return {"game_id": "test"}


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

