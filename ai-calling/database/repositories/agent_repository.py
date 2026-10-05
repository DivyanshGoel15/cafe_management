from typing import List, Optional
from sqlalchemy.orm import Session
from database.models.agent_entity import AgentModel
from .base import BaseRepository


class AgentRepository(BaseRepository[AgentModel]):
    def __init__(self, session: Session):
        super().__init__(AgentModel, session)

    def get_active_agents(self) -> List[AgentModel]:
        return self.session.query(AgentModel).filter(AgentModel.is_active == True).all()

    def get_default_agent(self) -> Optional[AgentModel]:
        return (
            self.session.query(AgentModel)
            .filter(AgentModel.is_active == True)
            .order_by(AgentModel.created_at.asc())
            .first()
        )
