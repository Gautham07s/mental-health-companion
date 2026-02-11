from transformers import pipeline
from typing import Dict, Union

class EmotionAnalysisAgent:
    """
    Agent responsible for detecting emotions in text using a pre-trained Transformer model.
    """
    def __init__(self):
        print("Loading Emotion Analysis Model... (this may take a moment)")
        # Using a specialized model for emotion detection
        self.classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion", top_k=1)
        print("Emotion Analysis Model Loaded.")

    def analyze(self, text: str) -> Dict[str, Union[str, float]]:
        """
        Analyzes the emotion of the given text.

        Args:
            text (str): The input text to analyze.

        Returns:
            dict: A dictionary containing the label and score, e.g., {'label': 'joy', 'score': 0.99}
        """
        if not text:
            return {'label': 'neutral', 'score': 0.0}
            
        results = self.classifier(text)
        # results is a list of lists, e.g. [[{'label': 'joy', 'score': 0.99}, ...]]
        top_result = results[0][0]
        return top_result
