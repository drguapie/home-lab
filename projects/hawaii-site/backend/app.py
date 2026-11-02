from flask import Flask, jsonify, request
import psycopg2
import os
import uuid
from pathlib import Path
from werkzeug.utils import secure_filename
from PIL import Image, UnidentifiedImageError
from io import BytesIO

app = Flask(__name__)
UPLOAD_FOLDER = Path("/app/uploads")
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp"}

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

def get_db_connection():
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        database=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD")
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

@app.route("/api/memories/<int:memory_id>", methods=["PUT"])
def update_memory(memory_id):

    # Retrieve the JSON data sent by the admin dashboard.
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({"error": "Invalid JSON data"}), 400

    # Validate the memory title.
    title = data.get("title")

    if not isinstance(title, str) or not title.strip():
        return jsonify({"error": "A memory title is required"}), 400

    # Validate optional text fields.
    for field in ("location", "description", "image_path"):
        if data.get(field) is not None and not isinstance(data[field], str):
            return jsonify({"error": f"Invalid {field}"}), 400

    # Validate the date if one was provided.
    from datetime import date

    memory_date = data.get("memory_date")

    if memory_date:
        try:
            date.fromisoformat(memory_date)
        except (ValueError, TypeError):
            return jsonify({"error": "Invalid date format"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    try:

        # Update the existing memory using its unique ID.
        cursor.execute(
            """
            UPDATE memories
            SET title = %s,
                location = %s,
                memory_date = %s,
                description = %s,
                image_path = %s
            WHERE id = %s
            """,
            (
                title.strip(),
                data.get("location"),
                memory_date or None,
                data.get("description"),
                data.get("image_path"),
                memory_id
            )
        )

        # Check whether the requested memory exists.
        if cursor.rowcount == 0:
            conn.rollback()
            return jsonify({"error": "Memory not found"}), 404

        conn.commit()

        return jsonify({
            "message": "Memory updated successfully"
        }), 200

    except Exception:
        conn.rollback()
        app.logger.exception("Failed to update memory")
        return jsonify({"error": "Unable to update memory"}), 500

    finally:
        cursor.close()
        conn.close()
        
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

    return jsonify({"message": "Memory deleted successfully"}), 200

@app.route("/api/upload", methods=["POST"])
def upload_photo():
    if "photo" not in request.files:
        return jsonify({"error": "No photo provided"}), 400

    photo = request.files["photo"]

    if not photo.filename:
        return jsonify({"error": "No file selected"}), 400

    original_name = secure_filename(photo.filename)
    extension = Path(original_name).suffix.lower().lstrip(".")

    if extension not in ALLOWED_EXTENSIONS:
        return jsonify({"error": "Unsupported file type"}), 400

    image_bytes = photo.read()

    try:
        with Image.open(BytesIO(image_bytes)) as image:
            detected_format = image.format
            image.verify()
    except (UnidentifiedImageError, OSError, SyntaxError):
        return jsonify({"error": "Invalid image file"}), 400

    expected_formats = {
        "jpg": {"JPEG", "MPO"},
        "jpeg": {"JPEG", "MPO"},
        "png": {"PNG"},
        "webp": {"WEBP"}
    }

    if detected_format not in expected_formats[extension]:
        return jsonify({"error": "Image format does not match extension"}), 400

    filename = f"{uuid.uuid4().hex}.{extension}"

    with open(UPLOAD_FOLDER / filename, "wb") as saved_file:
        saved_file.write(image_bytes)

    return jsonify({
        "message": "Photo uploaded successfully",
        "image_path": f"uploads/{filename}"
    }), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
