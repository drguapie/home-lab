from flask import Flask, jsonify
import psycopg2

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        host="hawaii-db",
        database="hawaii",
        user="hawaiiuser",
        password="hawaiipass"
    )


@app.route("/api/memories", methods=["GET"])
def get_memories():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, title, location, memory_date, description, image_path
        FROM memories
        ORDER BY id;
    """)

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    memories = []

    for row in rows:
        memories.append({
            "id": row[0],
            "title": row[1],
            "location": row[2],
            "memory_date": row[3].isoformat() if row[3] else None,
            "description": row[4],
            "image_path": row[5]
        })

    return jsonify({"memories": memories})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
