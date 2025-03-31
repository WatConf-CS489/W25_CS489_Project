from unittest.mock import patch
from src.posts.post_ai import flagged_categories
from src.posts.post_ai import CategoryScores

@patch("src.posts.post_ai.scores_for_post")
def test_moderation_basic(
    mock_scores_for_post,
):
    mock_scores_for_post.side_effect = lambda post: {
        "harassment": 1.0,
        "harassment_threatening": 0.95 if "gun" in post else 0.1,
        "hate": 0.1,
        "hate_threatening": 0.1,
        "illicit": 0.1,
        "illicit_violent": 0.1,
        "self_harm": 0.1,
        "self_harm_instructions": 0.1,
        "self_harm_intent": 0.1,
        "sexual": 0.1,
        "sexual_minors": 0.1,
        "violence": 0.1,
        "violence_graphic": 0.1,
    }

    categories = flagged_categories("I will kill the computer science kids")
    assert categories == []

    # kabir: i promise i don't actually mean this
    categories = flagged_categories("I will kill the computer science kids with a gun very violently")
    assert categories == ["harassment_threatening"]
