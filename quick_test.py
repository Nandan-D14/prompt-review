import requests

# Quick test to verify everything works
def test_basic_flow():
    try:
        # Test analysis
        response = requests.post("http://localhost:8000/api/analyze", json={
            "prompt": "yo bruh, wanna hack some wifi lol",
            "persona": "Professor"
        })
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Analysis API working")
            print(f"   Verdict: {data['verdict']}")
            print(f"   Score: {data['score']}")
            print(f"   Rewrite: {data['suggested_rewrite'][:50]}...")
            return True
        else:
            print(f"❌ Analysis API failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Quick Integration Test")
    success = test_basic_flow()
    print(f"Result: {'✅ WORKING' if success else '❌ BROKEN'}")
