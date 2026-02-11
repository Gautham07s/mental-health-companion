from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import torch
from typing import Optional, List

class ConversationAgent:
    """
    Agent responsible for generating empathetic conversational responses using BlenderBot.
    """
    def __init__(self):
        print("Loading Conversation Model (BlenderBot)...")
        # Using a distilled version for speed on CPU/local machines
        self.model_name = "facebook/blenderbot-400M-distill"
        self.tokenizer = BlenderbotTokenizer.from_pretrained(self.model_name)
        self.model = BlenderbotForConditionalGeneration.from_pretrained(self.model_name)
        print("Conversation Model Loaded.")

    def generate_response(self, user_input: str, history: Optional[List[str]] = None) -> str:
        """
        Generates a response to the user input.

        Args:
            user_input (str): The current message from the user.
            history (list, optional): List of previous messages (not fully utilized in this simple implementation).

        Returns:
            str: The generated response from the bot.
        """
        # Prepare the input
        inputs = self.tokenizer([user_input], return_tensors="pt")
        
        # Generate response
        # Using standard generation parameters for chat
        reply_ids = self.model.generate(**inputs, max_length=100)
        
        response = self.tokenizer.batch_decode(reply_ids, skip_special_tokens=True)[0]
        return response
