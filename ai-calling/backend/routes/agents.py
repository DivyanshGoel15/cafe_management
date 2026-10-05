from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.connection import get_db
from agents.agent_manager import AgentManager
from backend.models.agent import AgentCreateRequest, AgentUpdateRequest, AgentResponse

router = APIRouter(prefix="/agents", tags=["Agents"])


@router.get("", response_model=List[AgentResponse])
def list_agents(db: Session = Depends(get_db)):
    """List all AI calling agents."""
    manager = AgentManager(db)
    agents = manager.get_all_agents()
    return [AgentResponse.model_validate(a) for a in agents]


@router.post("", response_model=AgentResponse, status_code=status.HTTP_201_CREATED)
def create_agent(payload: AgentCreateRequest, db: Session = Depends(get_db)):
    """Create a new AI voice agent profile."""
    manager = AgentManager(db)
    agent = manager.create_agent(
        name=payload.name,
        role=payload.role,
        cafe_name=payload.cafe_name,
        system_prompt=payload.system_prompt,
        tone=payload.tone or "natural, professional, friendly, concise",
        language=payload.language or "en-US",
    )
    return AgentResponse.model_validate(agent)


@router.put("/{agent_id}", response_model=AgentResponse)
def update_agent(agent_id: str, payload: AgentUpdateRequest, db: Session = Depends(get_db)):
    """Update configuration or system prompt for an existing agent."""
    manager = AgentManager(db)
    updated = manager.update_agent(
        agent_id=agent_id,
        updates=payload.model_dump(exclude_unset=True),
    )
    if not updated:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Agent '{agent_id}' not found.")

    return AgentResponse.model_validate(updated)
