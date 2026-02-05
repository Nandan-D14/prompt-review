
import requests

BASE_URL = "http://localhost:8000"

def test_punctuation_not_flagged_as_slang():
    """Test that punctuation is not incorrectly flagged as slang."""
    response = requests.post(
        f"{BASE_URL}/api/analyze",
        json={
            "prompt": "what is this?",
            "persona": "Professor"
        },
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["verdict"] == "ALLOW"
    assert not any(h["type"] == "slang" for h in data["highlights"])
