import io
import base64
from typing import List, Optional, Dict, Any
from datetime import datetime
import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import RadialGradiantColorMask

from app.models.schemas import QRCode, Table
from app.config import settings
from app.repositories import table_repo, BaseTableRepository

class QRService:
    def __init__(self, repo: BaseTableRepository = table_repo):
        self.table_repo = repo

    def generate_qr_image_base64(self, url: str) -> str:
        """
        Generate a modern, high-contrast, beautiful QR code image as base64 data URI.
        """
        qr = qrcode.QRCode(
            version=1,
            error_correction=qrcode.constants.ERROR_CORRECT_M,
            box_size=10,
            border=2,
        )
        qr.add_data(url)
        qr.make(fit=True)

        img = qr.make_image(fill_color="#18181b", back_color="#ffffff")
        buffered = io.BytesIO()
        # pyrefly: ignore [unexpected-keyword]
        img.save(buffered, format="PNG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        return f"data:image/png;base64,{img_str}"

    def get_or_generate_qr_for_table(self, table_id: str, force_regenerate: bool = False) -> QRCode:
        table = self.table_repo.get_by_id(table_id)
        if not table:
            raise ValueError(f"Table '{table_id}' not found")

        existing_qr = self.table_repo.get_qr_code(table.table_id)
        if existing_qr and not force_regenerate:
            return existing_qr

        # Stable permanent URL
        permanent_url = f"{settings.base_url}/table/{table.table_id}"
        qr_image_data = self.generate_qr_image_base64(permanent_url)

        qr_obj = QRCode(
            qr_id=f"qr_{table.table_id}",
            table_id=table.table_id,
            table_number=table.table_number,
            permanent_url=permanent_url,
            qr_image_data=qr_image_data,
            created_at=datetime.utcnow() if not existing_qr else existing_qr.created_at,
            updated_at=datetime.utcnow()
        )
        self.table_repo.save_qr_code(qr_obj)
        return qr_obj

    def get_all_table_qrs(self) -> List[Dict[str, Any]]:
        tables = self.table_repo.get_all()
        results = []
        for tbl in tables:
            qr = self.get_or_generate_qr_for_table(tbl.table_id)
            results.append({
                "table_id": tbl.table_id,
                "table_number": tbl.table_number,
                "capacity": tbl.capacity,
                "status": tbl.status,
                "current_session_id": tbl.current_session_id,
                "qr_identifier": tbl.qr_identifier,
                "permanent_url": qr.permanent_url,
                "qr_image_data": qr.qr_image_data,
                "updated_at": qr.updated_at
            })
        return results
