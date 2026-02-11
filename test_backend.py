import requests
import time
import sys

def test_api():
    url = "http://127.0.0.1:8000/chat"
    payload = {
        "text": "I am feeling really anxious about my future.",
        "user_id": "test_user"
    }
    
    print("Attempting to connect to backend...")
    for i in range(30): # Try for 30 * 10 seconds = 5 minutes
        try:
            response = requests.post(url, json=payload)
            if response.status_code == 200:
                print("Success! Backend is responding.")
                data = response.json()
                print("Response:", data)
                return
            else:
                print(f"Server responded with status code: {response.status_code}")
                print(response.text)
                break
        except requests.exceptions.ConnectionError:
            print(f"Connection failed, retrying in 10s... ({i+1}/30)")
            time.sleep(10)
            
    print("Failed to connect to backend.")

if __name__ == "__main__":
    test_api()
