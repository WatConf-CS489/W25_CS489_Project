import src.auth.registration_routes as registration_routes

def test_smoke():
    assert registration_routes.rp_name == "WatConfessions"
