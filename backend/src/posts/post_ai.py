from src.ai import openai_client
from openai.types.moderation import CategoryScores

def min_scores_to_flag():
    return {
        # "harassment": 0.5,
        "harassment_threatening": 0.9,
        # "hate": 0.5,
        "hate_threatening": 0.9,
        # "illicit": 0.5,
        "illicit_violent": 0.9,
        "self_harm": 0.7,
        "self_harm_instructions": 0.5,
        "self_harm_intent": 0.5,
        # "sexual": 0.5,
        "sexual_minors": 0.5,
        # "violence": 0.5,
        "violence_graphic": 0.7,
    }

def scores_for_post(post: str) -> dict[str, float]:
    return openai_client.moderations.create(
        model="omni-moderation-latest",
        input=post,
    ).results[0].category_scores.model_dump()

def flagged_categories(post: str) -> list[str]:
    scores = scores_for_post(post)
    min_scores = min_scores_to_flag()
    return [
        category for category, threshold in min_scores.items()
        if scores[category] > threshold
    ]
