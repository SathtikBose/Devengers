# food_scan/json_db.py
import json
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'json_data')

# Ensure the directory exists
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

class JSONDatabase:
    def __init__(self, filename):
        self.file_path = os.path.join(DATA_DIR, f"{filename}.json")
        if not os.path.exists(self.file_path):
            with open(self.file_path, 'w') as f:
                json.dump([], f)

    def get_all(self):
        with open(self.file_path, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []

    def save_all(self, data):
        with open(self.file_path, 'w') as f:
            json.dump(data, f, indent=4)

    def add(self, entry):
        data = self.get_all()
        data.append(entry)
        self.save_all(data)

    def filter_by(self, key, value):
        """Returns all entries where entry[key] == value"""
        data = self.get_all()
        return [entry for entry in data if entry.get(key) == value]