class CrisisDetectionAgent:
    def __init__(self):
        self.crisis_keywords = [
            "suicide", "kill myself", "end my life", "want to die", 
            "hurt myself", "cutting myself", "no reason to live",
            "better off dead", "feel like dying"
        ]
        self.helpline_message = (
            "I'm really detecting some serious distress in your words. "
            "Please know that you are not alone. If you are in immediate danger, "
            "please call a local emergency number or a suicide prevention hotline immediately. "
            "Your safety is the most important thing right now."
        )

    def check_crisis(self, text: str):
        """
        Checks if the input text contains crisis keywords.
        Returns:
            bool: True if crisis detected, False otherwise.
            str: Crisis response message if detected, else None.
        """
        text_lower = text.lower()
        print(f"Checking for crisis keywords in: {text_lower}")
        for keyword in self.crisis_keywords:
            if keyword in text_lower:
                return True, self.helpline_message
        return False, None

if __name__ == "__main__":
    agent = CrisisDetectionAgent()
    is_crisis, msg = agent.check_crisis("I just want to end my life")
    print(is_crisis, msg)
