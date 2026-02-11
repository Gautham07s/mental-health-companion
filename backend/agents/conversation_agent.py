from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import torch

class ConversationAgent:
    def __init__(self):
        print("Loading Conversation Model (BlenderBot)...")
        # Using a distilled version for speed on CPU/local machines
        self.model_name = "facebook/blenderbot-400M-distill"
        self.tokenizer = BlenderbotTokenizer.from_pretrained(self.model_name)
        self.model = BlenderbotForConditionalGeneration.from_pretrained(self.model_name)
        print("Conversation Model Loaded.")

    def generate_response(self, user_input: str, history: list = None):
        """
        Generates a response to the user input, considering history.
        Args:
            user_input (str): The current message from the user.
            history (list): Not fully utilized in this simple implementation, 
                           but BlenderBot can take concatenated context.
        """
        # Prepare the input
        # BlenderBot manages history by appending previous turns, but here we treat each turn independently for simplicity
        # or append the last 1-2 turns if available.
        
        inputs = self.tokenizer([user_input], return_tensors="pt")
        
        # Generate response
        # Using standard generation parameters for chat
        reply_ids = self.model.generate(**inputs, max_length=100)
        
        response = self.tokenizer.batch_decode(reply_ids, skip_special_tokens=True)[0]
        return response

if __name__ == "__main__":
    agent = ConversationAgent()
    print(agent.generate_response("I am feeling sad today."))
