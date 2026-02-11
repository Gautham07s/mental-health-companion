from transformers import pipeline

class EmotionAnalysisAgent:
    def __init__(self):
        print("Loading Emotion Analysis Model... (this may take a moment)")
        # Using a specialized model for emotion detection
        self.classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion", top_k=1)
        print("Emotion Analysis Model Loaded.")

    def analyze(self, text: str):
        """
        Analyzes the emotion of the given text.
        Returns:
            dict: { 'label': 'joy', 'score': 0.99 }
        """
        if not text:
            return {'label': 'neutral', 'score': 0.0}
            
        results = self.classifier(text)
        # results is a list of lists, e.g. [[{'label': 'joy', 'score': 0.99}, ...]]
        top_result = results[0][0]
        return top_result

if __name__ == "__main__":
    # Test the agent
    agent = EmotionAnalysisAgent()
    print(agent.analyze("I am feeling really overwhelmed with my exams."))
