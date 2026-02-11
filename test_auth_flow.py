import requests
import time
import random

BASE_URL = "http://127.0.0.1:8000"

def test_auth_flow():
    # 1. Register
    username = f"user_{random.randint(1000, 9999)}"
    password = "secretpassword"
    print(f"Testing with user: {username}")
    
    reg_response = requests.post(f"{BASE_URL}/register", json={"username": username, "password": password})
    if reg_response.status_code == 200:
        print("✅ Registration Successful")
    else:
        print(f"❌ Registration Failed: {reg_response.text}")
        return

    # 2. Login
    login_data = {"username": username, "password": password}
    login_response = requests.post(f"{BASE_URL}/token", data=login_data) # OAuth2 uses form data
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        print("✅ Login Successful. Token received.")
    else:
        print(f"❌ Login Failed: {login_response.text}")
        return

    # 3. Protected Chat
    headers = {"Authorization": f"Bearer {token}"}
    chat_payload = {"text": "I am feeling happy today because verification passed!"}
    
    chat_response = requests.post(f"{BASE_URL}/chat", json=chat_payload, headers=headers)
    if chat_response.status_code == 200:
        print("✅ Protected Chat Successful")
        print(f"   Bot: {chat_response.json()['bot_response']}")
    else:
        print(f"❌ Protected Chat Failed: {chat_response.text}")
        return

    # 4. Protected Trends
    trends_response = requests.get(f"{BASE_URL}/trends", headers=headers)
    if trends_response.status_code == 200:
        print(f"✅ Protected Trends Successful (Count: {len(trends_response.json())})")
    else:
        print(f"❌ Protected Trends Failed: {trends_response.text}")

if __name__ == "__main__":
    try:
        test_auth_flow()
    except Exception as e:
        print(f"❌ Error: {e}")
