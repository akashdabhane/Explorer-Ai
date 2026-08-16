import os
from dotenv import load_dotenv
from google import genai

load_dotenv()


class GeminiLLM:
    def __init__(self, model_name: str = "gemini-2.5-flash"):
        self.model_name = model_name
        self.client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    def generate_content(self, prompt: str):
        return self.client.models.generate_content(
            model=self.model_name,
            contents=prompt,
        )


model = GeminiLLM("gemini-2.5-flash")
