from fastapi import FastAPI
from sqlalchemy import create_engine, text
import random

# --- CONFIG ---
DB_URL = "postgresql://germanflashcards_user:OyZOUOvOIeDODfM39NSOLhtMDlrLlxvJ@dpg-d2fo5fvdiees73bohic0-a.oregon-postgres.render.com/germanflashcards"

engine = create_engine(DB_URL, pool_pre_ping=True)
app = FastAPI()

@app.get("/random")
def get_random_word():
    # Get all IDs first
    with engine.connect() as conn:
        result = conn.execute(text("SELECT id FROM cards WHERE show = 'no'"))
        print(type(result))
        ids = [row.id for row in result]
    
    if not ids:
        return {"error": "No words found"}
    
    # Pick random ID
    random_id = random.choice(ids)
    
    # Fetch that row
    with engine.connect() as conn:
        row = conn.execute(text("SELECT * FROM cards WHERE id = :id"), {"id": random_id}).fetchone()
    
    if row:
        return {"id": row.id, "english": row.english, "german": row.german, "show": row.show}
    else:
        return {"error": "Word not found"}