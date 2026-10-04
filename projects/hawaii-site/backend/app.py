from flask import Flask, jsonify, request
import psycopg2
import os

app = Flask(__name__)


def get_db_connection():
    return psycopg2.connect(
        host=os.environ["DB_HOST"],
        database=os.environ["POSTGRES_DB"],
        user=os.environ["POSTGRES_USER"],
        password=os.environ["POSTGRES_PASSWORD"]
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


@app.route("/api/memories", methods=["POST"])
def add_memory():
    data = request.get_json()

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO memories
            (title, location, memory_date, description, image_path)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            data["title"],
            data.get("location"),
            data.get("memory_date"),
            data.get("description"),
            data.get("image_path")
        )
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Memory added successfully"}), 201
@app.route("/api/memories/<int:memory_id>", methods=["DELETE"])
def delete_memory(memory_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "DELETE FROM memories WHERE id = %s",
        (memory_id,)
    )

    conn.commit()

    cursor.close()
    conn.close()

    return jsonify({"message": "Memory deleted successfully"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
