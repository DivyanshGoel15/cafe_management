/**
 * Table Service
 * Identifies table IDs for QR dine-in scans and connects to the central table structure
 */
import { TABLES, CAFE_INFO } from '../data/cafeData.js';
import { delay } from './cafeService.js';

const API_BASE = 'http://localhost:4000/api';

export const tableService = {
  /**
   * Resolve table metadata from QR parameter (e.g. "table_7", "7", "table-7")
   */
  async getTableInfo(tableParam) {
    if (!tableParam) return null;

    const digits = tableParam.toString().replace(/[^0-9]/g, '');
    const tableNumber = parseInt(digits, 10);

    if (isNaN(tableNumber)) {
      return {
        isValid: false,
        tableNumber: null,
        cafeName: CAFE_INFO.name,
        error: `Invalid table identifier: ${tableParam}`
      };
    }

    // Attempt to resolve from Central API
    try {
      const res = await fetch(`${API_BASE}/tables/${tableNumber}`, { cache: 'no-store' });
      if (res.ok) {
        const tbl = await res.json();
        if (tbl.isActive === false || tbl.status === 'Inactive') {
          return {
            isValid: false,
            tableNumber: tbl.number,
            cafeName: CAFE_INFO.name,
            error: `Table ${tbl.number} is currently inactive and not accepting orders.`
          };
        }

        return {
          isValid: true,
          tableId: tbl.id,
          tableNumber: tbl.number,
          capacity: tbl.capacity,
          area: tbl.zone || 'Dining Area',
          description: `Capacity ${tbl.capacity} guests in ${tbl.zone}`,
          cafeName: CAFE_INFO.name,
          welcomeTitle: `Welcome to ${CAFE_INFO.name} — Table ${tbl.number}`,
          welcomeSubtitle: `Seated in ${tbl.zone} • Capacity ${tbl.capacity} guests`,
          qrUrl: `#/table/${tbl.number}`,
          dineInUrl: `#/menu?table=${tbl.number}&dineIn=true`
        };
      }
    } catch (err) {
      // Fallback
    }

    const matchedTable = TABLES.find(t => t.number === tableNumber) || {
      id: `table_${tableNumber}`,
      number: tableNumber,
      capacity: 4,
      area: "Dining Area",
      description: "Standard Cafe Table"
    };

    return {
      isValid: true,
      tableId: matchedTable.id,
      tableNumber: matchedTable.number,
      capacity: matchedTable.capacity,
      area: matchedTable.area,
      description: matchedTable.description,
      cafeName: CAFE_INFO.name,
      welcomeTitle: `Welcome to ${CAFE_INFO.name} — Table ${matchedTable.number}`,
      welcomeSubtitle: `Seated in ${matchedTable.area} • Capacity ${matchedTable.capacity} guests`,
      qrUrl: `#/table/${matchedTable.number}`,
      dineInUrl: `#/menu?table=${matchedTable.number}&dineIn=true`
    };
  }
};
