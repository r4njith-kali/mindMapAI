import os
import uuid
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from huggingface_hub import InferenceClient
import logging

load_dotenv()

# Config loading
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

HF_TOKEN = os.getenv("HUGGINFACE_API_KEY")

try:
    hf_client = InferenceClient(token=HF_TOKEN)
    logger.info("HuggingFace Inference Client initialized")
except Exception as e:
    logger.error(f"Failed to initialize HuggingFace client: {e}")
    hf_client = None  # typo fix: was 'hf_cilent'

@api_view(['POST'])
def generate_ideas_view(request):
    if hf_client is None:
        logger.error("Attempted to use generate_ideas_view but HF client is not initialized.")
        return Response(
            {"message": "Internal Server Error: AI Service not configured"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    central_idea = request.data.get('centralIdea')
    logger.info(f'Received request for central idea: "{central_idea}"')

    if not central_idea or not isinstance(central_idea, str) or not central_idea.strip():
        logger.warning("Invalid request: Missing or empty centralIdea.")
        return Response(
            {"message": "Bad Request: centralIdea is required in the request body."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        prompt = f"""Given the central idea "{central_idea}", generate exactly 5 distinct, related keywords or short concepts. Present them as a simple numbered list, each on a new line:"""
        logger.info(f"Sending prompt to Hugging Face:\n{prompt[:100]}...")
        
        # Call HuggingFace API
        llm_response_text = hf_client.text_generation(
            prompt=prompt,
            model="deepseek-ai/DeepSeek-R1-Distill-Qwen-32B",
            max_new_tokens=100,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
        )

        generated_text = llm_response_text.strip()
        logger.info(f"Received response from HuggingFace:\n{generated_text}")

        # Parse generated ideas
        ideas = []
        potential_lines = generated_text.split('\n')
        for line in potential_lines:
            cleaned_line = line.strip()
            if cleaned_line and (cleaned_line[0].isdigit() and (cleaned_line[1] == '.' or cleaned_line[1:3] == '. ')):
                idea = cleaned_line.split('.', 1)[-1].strip()
                if idea:
                    ideas.append(idea)
            elif cleaned_line:
                ideas.append(cleaned_line)

        ideas = ideas[:5]
        logger.info(f"Parsed ideas: {ideas}")

        if not ideas:
            logger.error("Failed to parse valid ideas from LLM response")
            return Response(
                {
                    "message": "Error: Could not parse keywords from the AI response. Raw response: " + generated_text
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        # Format Data for Frontend
        root_node = {
            "id": 'root',
            "label": central_idea,
            "fx": None,
            "fy": None,
            "depth": 0
        }

        child_nodes = [
            {
                "id": str(uuid.uuid4()),
                "label": idea_label,
                "depth": 1
            } for idea_label in ideas
        ]

        new_links = [
            {
                "source": 'root',
                "target": node["id"]
            } for node in child_nodes
        ]

        response_data = {
            "nodes": [root_node] + child_nodes,
            "links": new_links
        }

        logger.info("✅ Successfully processed request. Sending data to frontend.")
        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Error during Hugging Face API call or processing: {e}", exc_info=True)
        return Response(
            {"message": f"Internal Server Error: Failed to generate ideas. Error: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
