import sys
import os
from dotenv import load_dotenv

sys.path.insert(0, os.path.abspath("/app/backend"))

from emergentintegrations.llm.openai.video_generation import OpenAIVideoGeneration

load_dotenv("/app/backend/.env")

PROMPT = (
    "Cinematic photorealistic nature film in the style of a high-end fashion film. "
    "Open on a completely black screen. Two realistic fuzzy bumble bees (Bombus, not honey bees) appear, "
    "shown strictly in SIDE PROFILE. One bee enters from the left edge of the frame, the other from the right edge. "
    "They are positioned symmetrically around the exact horizontal center of the frame and glide slowly and "
    "gracefully toward each other until they nearly touch face-to-face, as if greeting or almost kissing. "
    "They pause very briefly. Then the bees separate and fly away from each other: the left bee exits toward the "
    "left side of the frame, the right bee exits toward the right side. They remain in side profile the whole time; "
    "they do not fly toward the camera, do not fly upward, and do not rotate into a front-facing view. "
    "As they separate, a brief warm golden light blooms and fills the screen, transitioning naturally into an "
    "intimate, lush natural landscape: dense mature trees filling most of the frame so the viewer feels surrounded "
    "by nature, very little empty sky, lush green grass, soft blue sky glimpsed through foliage, natural sunlight, "
    "subtle atmospheric depth and haze, gentle movement of leaves and grass in a light breeze. "
    "On the RIGHT side of the frame, one large mature tree stands much closer to the viewer, occupying a "
    "significant portion of the right side as the primary foreground focal point, while the forest continues "
    "behind it into the distance creating depth. A realistic natural beehive hangs from one of its branches, "
    "with thick golden honey slowly dripping from the hive, and a few bumble bees drifting around it, all feeling "
    "like an organic part of the environment. Subtle, slow camera drift gently following one bee toward the hive. "
    "Cinematic depth of field, natural lighting, premium photorealistic film quality. "
    "No text, no logos, no typography, no graphic overlays, no cartoon look, no fantasy effects."
)

OUT = "/app/frontend/public/videos/honeygold-intro.mp4"


def main():
    video_gen = OpenAIVideoGeneration(api_key=os.environ["EMERGENT_LLM_KEY"])
    video_bytes = video_gen.text_to_video(
        prompt=PROMPT,
        model="sora-2",
        size="1280x720",
        duration=4,
        max_wait_time=900,
    )
    if video_bytes:
        video_gen.save_video(video_bytes, OUT)
        print(f"VIDEO_SAVED {OUT}")
    else:
        print("VIDEO_FAILED")


if __name__ == "__main__":
    main()
