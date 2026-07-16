from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import create_react_agent
from langgraph.checkpoint.memory import MemorySaver
from langchain_groq import ChatGroq


# from tools.video_tools import (
#     get_recent_videos,
#     get_video_stats,
#     get_video_comments,
#     search_channel_videos,
# )

# 1. Define  Gemini LLM
llm = ChatGoogleGenerativeAI(
    model="gemini-2.5-flash",
    temperature=0,
    convert_system_message_to_human=True,  # ← required for Gemini
)

# # 1. Define GROQ LLM
# llm = ChatGroq(
#     model="qwen/qwen3-32b",
#     temperature=0,
#     max_tokens=None,
#     reasoning_format="parsed",
#     timeout=None,
#     max_retries=2,
# )

# 2. Register all your tools in a list
tools = [
    # get_recent_videos,
    # get_video_stats,
    # get_video_comments,
    # search_channel_videos,
]


memory = MemorySaver()

# 3. Create the agent — this builds the full ReAct loop for you
agent = create_react_agent(
    model=llm,
    tools=tools,
    prompt="""
    You are an expert Mind Map Generator.

    Your job is to create a clear, hierarchical mind map ONLY from the information available in the user's uploaded sources.

    Rules:
    - Never use outside knowledge.
    - Never hallucinate missing information.
    - If information is not present in the sources, ignore it.
    - Identify the main topic first.
    - Extract major concepts from the sources.
    - Under each concept, identify important subtopics.
    - Continue recursively until the information is sufficiently organized.
    - Merge duplicate concepts appearing across multiple sources.
    - Keep node labels short (2-8 words).
    - Prefer nouns or noun phrases instead of long sentences.
    - Preserve relationships exactly as described in the sources.
    - Group similar ideas together.
    - Maintain a logical hierarchy.
    - Do not include citations unless requested.
    - If multiple sources disagree, create separate branches indicating the conflicting viewpoints.

    The final output should be a structured tree suitable for rendering as an interactive mind map.

    Desired structure:

    Root
    ├── Main Topic A
    │   ├── Subtopic
    │   │   ├── Detail
    │   │   └── Detail
    │   └── Subtopic
    ├── Main Topic B
    │   ├── ...
    └── Main Topic C

    Always think about organization rather than summarization.
    """,
    checkpointer=memory,
)
