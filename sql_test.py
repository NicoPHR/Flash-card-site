from sqlalchemy import create_engine, text
import os

DB_URL = "postgresql://germanflashcards_user:OyZOUOvOIeDODfM39NSOLhtMDlrLlxvJ@dpg-d2fo5fvdiees73bohic0-a.oregon-postgres.render.com/germanflashcards"

def print_rows(rows_input):
    for row in rows_input:
        print(row)

engine = create_engine(DB_URL, pool_pre_ping=True)

sql = [
    # 0 view tables
    """
    SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public'
    ORDER BY table_name;
    """,
    # 1 Drop table
    'DROP TABLE IF EXISTS ping;',
    # 2 Create table
    '''
    CREATE TABLE cards (
    id integer primary key,
    german TEXT not null,
    english TEXT not null
    );
    ''',
    # 3 Insert rows
    '''
    INSERT INTO cards (id, german, english)
    VALUES
    (1, 'Wo','where'),
    (2, 'Woher','where to'),
    (3, 'ich','I')
    ;
    ''',
    # 4 View data
    'SELECT * FROM cards;'
    ]
rows = "empty"

with engine.begin() as conn:
    result = conn.execute(text(sql[4]))
    # Fetch all rows
    if result.returns_rows:
        rows = result.fetchall()

# Print results nicely
print(rows)