"""Gemini API client with structured output support."""

import json
from typing import Any, Optional, Type

from google import genai
from google.genai import types
from pydantic import BaseModel

from app.config import settings


# Initialize Gemini client
_client: Optional[genai.Client] = None


def get_client() -> genai.Client:
    """Get or create Gemini client."""
    global _client
    
    if _client is None:
        if not settings.gemini_api_key:
            raise ValueError("GEMINI_API_KEY not configured")
        
        _client = genai.Client(api_key=settings.gemini_api_key)
    
    return _client


async def generate(
    prompt: Any,
    response_schema: Optional[Type[BaseModel]] = None,
    system_instruction: Optional[str] = None,
) -> Any:
    """
    Generate content with Gemini.
    
    Args:
        prompt: The user prompt
        response_schema: Optional Pydantic model for structured output
        system_instruction: Optional system prompt
    
    Returns:
        If response_schema: Parsed dict matching schema
        Otherwise: Raw text response
    """
    client = get_client()
    
    # Build config
    config = types.GenerateContentConfig(
        temperature=settings.gemini_temperature,
        max_output_tokens=settings.gemini_max_tokens,
    )
    
    # Add system instruction if provided
    if system_instruction:
        config.system_instruction = system_instruction
    
    # Add response schema for structured output
    if response_schema and settings.use_structured_output:
        config.response_mime_type = "application/json"
        config.response_schema = response_schema
    
    # Run blocking call in executor
    import asyncio
    from functools import partial
    
    loop = asyncio.get_running_loop()
    
    # Use partial to pass arguments to the synchronous function
    generate_func = partial(
        client.models.generate_content,
        model=settings.gemini_model,
        contents=prompt,
        config=config,
    )
    
    print(f"🤖 Calling Gemini API (model={settings.gemini_model})...")
    
    try:
        response = await loop.run_in_executor(None, generate_func)
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        raise
        
    print(f"✅ Gemini API Response received ({len(response.text) if response.text else 0} chars)")
    
    # Parse response
    if response_schema and settings.use_structured_output:
        # Parse JSON response
        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            # Fallback: try to extract JSON from text
            text = response.text
            start = text.find("{")
            end = text.rfind("}") + 1
            if start >= 0 and end > start:
                return json.loads(text[start:end])
            raise ValueError(f"Could not parse JSON from response: {text[:200]}")
    
    return response.text


async def generate_with_grounding(
    prompt: Any,
    system_instruction: Optional[str] = None,
) -> dict:
    """
    Generate content with Google Search grounding enabled.
    
    This enables the model to search the web for real-time information
    and cite sources in its response.
    
    Args:
        prompt: The user prompt
        system_instruction: Optional system prompt
    
    Returns:
        dict with:
        - 'text': Generated content
        - 'grounding_metadata': Dict with 'sources' and 'search_queries'
    """
    client = get_client()
    
    # Build config with grounding enabled
    config = types.GenerateContentConfig(
        temperature=settings.gemini_temperature,
        max_output_tokens=settings.gemini_max_tokens,
        tools=[types.Tool(google_search=types.GoogleSearch())],  # Enable Google Search
    )
    
    # Add system instruction if provided
    if system_instruction:
        config.system_instruction = system_instruction
    
    # Run blocking call in executor
    import asyncio
    from functools import partial
    
    loop = asyncio.get_running_loop()
    
    # Use partial to pass arguments to the synchronous function
    generate_func = partial(
        client.models.generate_content,
        model=settings.gemini_model,
        contents=prompt,
        config=config,
    )
    
    print(f"🔍 Calling Gemini API with grounding (model={settings.gemini_model})...")
    
    try:
        response = await loop.run_in_executor(None, generate_func)
    except Exception as e:
        print(f"❌ Gemini API Error: {e}")
        raise
        
    print(f"✅ Gemini API Response received ({len(response.text) if response.text else 0} chars)")
    
    # Extract grounding metadata
    grounding_metadata = {
        'sources': [],
        'search_queries': []
    }
    
    if hasattr(response, 'grounding_metadata') and response.grounding_metadata:
        metadata = response.grounding_metadata
        
        # Extract search queries
        if hasattr(metadata, 'web_search_queries') and metadata.web_search_queries:
            grounding_metadata['search_queries'] = list(metadata.web_search_queries)
            print(f"📊 Grounding: {len(grounding_metadata['search_queries'])} search queries executed")
        
        # Extract source citations
        if hasattr(metadata, 'grounding_chunks') and metadata.grounding_chunks:
            for chunk in metadata.grounding_chunks:
                if hasattr(chunk, 'web') and chunk.web:
                    grounding_metadata['sources'].append({
                        'uri': chunk.web.uri if hasattr(chunk.web, 'uri') else '',
                        'title': chunk.web.title if hasattr(chunk.web, 'title') else ''
                    })
            print(f"📚 Grounding: {len(grounding_metadata['sources'])} sources consulted")
    else:
        print("⚠️  No grounding metadata found in response")
    
    return {
        'text': response.text,
        'grounding_metadata': grounding_metadata
    }



async def stream(
    prompt: Any,
    system_instruction: Optional[str] = None,
):
    """
    Stream content from Gemini, yielding chunks as they arrive.
    
    Args:
        prompt: The user prompt
        system_instruction: Optional system prompt
    
    Yields:
        Text chunks as they stream in
    """
    client = get_client()
    
    # Build config (no structured output for streaming)
    config = types.GenerateContentConfig(
        temperature=settings.gemini_temperature,
        max_output_tokens=settings.gemini_max_tokens,
    )
    
    # Add system instruction if provided
    if system_instruction:
        config.system_instruction = system_instruction
    
    # Stream response
    response_stream = client.models.generate_content_stream(
        model=settings.gemini_model,
        contents=prompt,
        config=config,
    )
    
    for chunk in response_stream:
        if chunk.text:
            yield chunk.text
