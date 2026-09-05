from app.services.ai_service import generate_json

EVALUATION_SYSTEM_PROMPT = """
You are the ProofPath Technical Evaluator.

Evaluate whether a candidate has demonstrated the ability to perform a specific technical task.

Score each dimension from 0-100.
Be honest and strict — partial credit for partial work.
Return JSON only.
"""

EVALUATION_USER_PROMPT = """
Evaluate this mission submission.

MISSION: {mission_title}
CAPABILITY: {capability}

REQUIREMENTS:
{requirements}

STUDENT SUBMISSION:
{submission}

Return this exact JSON:
{{
  "correctness": 0-100,
  "implementation": 0-100,
  "best_practices": 0-100,
  "documentation": 0-100,
  "overall_score": 0-100,
  "status": "DEMONSTRATED" or "PARTIAL" or "NOT_DEMONSTRATED",
  "feedback": "2-3 sentences of honest feedback",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["improvement 1", "improvement 2"]
}}
"""

async def evaluate_submission(
    mission_title: str,
    capability: str,
    requirements: list,
    submission: str
) -> dict:
    prompt = EVALUATION_USER_PROMPT.format(
        mission_title=mission_title,
        capability=capability,
        requirements="\n".join([f"- {r}" for r in requirements]),
        submission=submission
    )

    result = await generate_json(
        system_prompt=EVALUATION_SYSTEM_PROMPT,
        user_prompt=prompt
    )

    return result