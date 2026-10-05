import uuid
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from database.repositories.agent_repository import AgentRepository
from database.models.agent_entity import AgentModel
from agents.cafe_agent.prompts.system_prompt import build_system_prompt


class AgentManager:
    """Manager for registering, querying, and updating AI agents."""

    def __init__(self, session: Session):
        self.session = session
        self.agent_repo = AgentRepository(session)

    def get_all_agents(self) -> List[AgentModel]:
        return self.agent_repo.get_all()

    def get_agent_by_id(self, agent_id: str) -> Optional[AgentModel]:
        return self.agent_repo.get_by_id(agent_id)

    def get_default_agent(self) -> AgentModel:
        agent = self.agent_repo.get_default_agent()
        if not agent:
            # Create default agent
            default_prompt = build_system_prompt()
            agent = AgentModel(
                id="agent-bella-01",
                name="Bella - AI Host",
                role="Senior Reservations & Guest Relations Host",
                cafe_name="Bella Vista Bistro",
                system_prompt=default_prompt,
                tone="natural, polite, concise, professional",
                language="en-US",
                is_active=True,
            )
            self.agent_repo.create(agent)
        return agent

    def create_agent(
        self,
        name: str,
        role: str,
        cafe_name: str,
        system_prompt: str,
        tone: str = "natural, professional, friendly, concise",
        language: str = "en-US",
    ) -> AgentModel:
        new_agent = AgentModel(
            id=f"agent-{uuid.uuid4().hex[:8]}",
            name=name,
            role=role,
            cafe_name=cafe_name,
            system_prompt=system_prompt,
            tone=tone,
            language=language,
            is_active=True,
        )
        return self.agent_repo.create(new_agent)

    def update_agent(self, agent_id: str, updates: Dict[str, Any]) -> Optional[AgentModel]:
        agent = self.agent_repo.get_by_id(agent_id)
        if not agent:
            return None

        for key, val in updates.items():
            if val is not None and hasattr(agent, key):
                setattr(agent, key, val)

        self.session.commit()
        self.session.refresh(agent)
        return agent
