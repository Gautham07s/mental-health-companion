import random
from typing import Dict, List

class SupportAgent:
    """
    Agent responsible for providing coping strategies based on detected emotions.
    """
    def __init__(self):
        # Database of coping strategies mapped to emotions
        self.strategies: Dict[str, List[str]] = {
             "sadness": [
                "It’s okay to feel sad. Maybe try writing down your thoughts in a journal?",
                "Have you considered taking a short walk outside? Sometimes fresh air helps.",
                "Listen to some comforting music or a favorite song.",
                "Reach out to a close friend just to say hi."
            ],
            "fear": [ # Anxiety/Fear
                "Try a deep breathing exercise: Inhale for 4 seconds, hold for 7, exhale for 8.",
                "Focus on the present moment. Name 5 things you can see around you.",
                "Grounding technique: Hold an ice cube or wash your hands with cold water.",
                "Write down what is worrying you, then cross out the things you cannot control."
            ],
            "anger": [
                "Take a step back and count to 10 slowly.",
                "Physical movement can help release tension. Maybe do some stretching?",
                "Write a letter to the source of your anger, but don't send it.",
                "Listen to high-energy music to let the emotions out safely."
            ],
            "joy": [
                "It's great to hear you're feeling good! Hold onto this feeling.",
                "Share your happiness with someone you care about!",
                "Take a moment to write down what made you happy today."
            ],
            "love": [
                "That sounds wonderful. Connection is so important.",
                "Cherish these moments."
            ],
            "surprise": [
                "Unexpected things can be overwhelming. Take a moment to process it.",
                "Is it a good surprise or a shocking one? Give yourself time."
            ]
        }

    def get_recommendation(self, emotion: str) -> str:
        """
        Returns a coping strategy suggestion based on the emotion.

        Args:
            emotion (str): The detected emotion label.

        Returns:
            str: A recommendation string.
        """
        # DistilBERT emotions: sadness, joy, love, anger, fear, surprise
        if emotion in self.strategies:
            return random.choice(self.strategies[emotion])
        return "Remember to take deep breaths and stay hydrated."
