from src.posts.post_routes import escape_html

def test_validate_email():
    assert escape_html("") == ""
    assert escape_html("test") == "test"
    assert escape_html("<script>alert(1)</script>") == "&lt;script&gt;alert(1)&lt;/script&gt;"
    assert escape_html("<>&") == "&lt;&gt;&amp;"
