
import os
import json
import httpx
import asyncio
from typing import Dict, Any, List, Optional
from app.core.config import settings

OLLAMA_BASE_URL = "http://localhost:11434"  # Default Ollama API address

class OllamaService:
    def __init__(self, base_url: str = OLLAMA_BASE_URL):
        self.base_url = base_url
        self.model_name = "deepseek:1.5b"  # Default model
        self.client = httpx.AsyncClient(timeout=60.0)  # Longer timeout for model operations

    async def check_model_availability(self) -> bool:
        """Check if the specified model is available in Ollama."""
        try:
            response = await self.client.get(f"{self.base_url}/api/tags")
            data = response.json()
            models = [model["name"] for model in data.get("models", [])]
            return self.model_name in models
        except Exception as e:
            print(f"Error checking model availability: {str(e)}")
            return False

    async def pull_model(self) -> Dict[str, Any]:
        """Pull the deepseek model if not already available."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/pull",
                json={"name": self.model_name}
            )
            return response.json()
        except Exception as e:
            print(f"Error pulling model: {str(e)}")
            return {"error": str(e)}

    async def generate_embeddings(self, text: str) -> List[float]:
        """Generate embeddings for the given text using Ollama."""
        try:
            response = await self.client.post(
                f"{self.base_url}/api/embeddings",
                json={"model": self.model_name, "prompt": text}
            )
            data = response.json()
            return data.get("embedding", [])
        except Exception as e:
            print(f"Error generating embeddings: {str(e)}")
            return []

    async def generate_response(self, prompt: str, context: Optional[str] = None) -> str:
        """Generate a response using the LLM with optional context."""
        try:
            # Craft the prompt with context if provided
            full_prompt = prompt
            if context:
                full_prompt = f"Context: {context}\n\nQuestion: {prompt}\n\nAnswer:"

            response = await self.client.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": full_prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.7,
                        "top_p": 0.9,
                        "max_tokens": 512
                    }
                }
            )
            data = response.json()
            return data.get("response", "")
        except Exception as e:
            print(f"Error generating response: {str(e)}")
            return f"Error: Failed to generate response. {str(e)}"

# Singleton instance
ollama_service = OllamaService()
