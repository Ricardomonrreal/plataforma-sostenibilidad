import React from 'react'

const svgWrapper = (paths) => ({ className = "w-5 h-5", strokeWidth = 2, color }) => (
  <svg
    className={className}
    fill="none"
    stroke={color || "currentColor"}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    viewBox="0 0 24 24"
  >
    {paths}
  </svg>
)

export const FaBolt = svgWrapper(
  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
)

export const FaDollarSign = svgWrapper(
  <>
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </>
)

export const FaFire = svgWrapper(
  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
)

export const FaGasPump = svgWrapper(
  <>
    <path d="M3 22V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18" />
    <path d="M14 22V14H6v8" />
    <path d="M6 6h6" />
    <path d="M17 10h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" />
  </>
)

export const FaTree = svgWrapper(
  <>
    <path d="M12 2L3 17h18L12 2z" />
    <path d="M12 17v5" />
    <path d="M5 21h14" />
  </>
)

export const FaBurn = svgWrapper(
  <>
    <path d="M12 2v6" />
    <path d="M8 4v4" />
    <path d="M16 4v4" />
    <path d="M8 12c0 2.2 1.8 4 4 4s4-1.8 4-4a4 4 0 0 0-8 0z" />
    <path d="M12 16v6" />
    <path d="M9 19h6" />
  </>
)

export const FaMoneyBillWave = svgWrapper(
  <>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <circle cx="12" cy="12" r="3" />
    <path d="M6 9h.01M18 15h.01" />
  </>
)

export const FaTint = svgWrapper(
  <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" />
)

export const FaWater = svgWrapper(
  <>
    <path d="M2 6c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" />
    <path d="M2 12c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" />
    <path d="M2 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2 3 2 6 2" />
  </>
)

export const FaFlask = svgWrapper(
  <>
    <path d="M6 3h12" />
    <path d="M12 3v11" />
    <path d="M9 3v11" />
    <path d="M5 21h14a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2z" />
  </>
)

export const FaFaucet = svgWrapper(
  <>
    <path d="M16 4h4v3h-4z" />
    <path d="M16 7v6h-4" />
    <path d="M8 7h8v2H8z" />
    <path d="M8 7V5a2 2 0 0 0-2-2H3v2h3v12a2 2 0 0 0 2 2h12v-2H8v-6h4" />
  </>
)

export const FaRecycle = svgWrapper(
  <>
    <path d="M4.5 16.5c-1.5-2.5-1.5-5.5 0-8" />
    <path d="M19.5 16.5c1.5-2.5 1.5-5.5 0-8" />
    <path d="M6 6c2.5-1.5 5.5-1.5 8 0" />
    <path d="M7 18h10" />
  </>
)

export const FaSeedling = svgWrapper(
  <>
    <path d="M2 22h20" />
    <path d="M12 22V10" />
    <path d="M12 10a6 6 0 0 1 6-6h2v2a6 6 0 0 1-6 6h-2" />
    <path d="M12 14a6 6 0 0 0-6-6H4v2a6 6 0 0 0 6 6h2" />
  </>
)

export const FaTshirt = svgWrapper(
  <path d="M20.38 3.46L16 6a2 2 0 0 1-2-2V2H10v2a2 2 0 0 1-2 2L3.62 3.46a2 2 0 0 0-2.42.88l-1 1.73a2 2 0 0 0 .58 2.65L4 10v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10l3.22-2.28a2 2 0 0 0 .58-2.65l-1-1.73a2 2 0 0 0-2.42-.88z" />
)

export const FaSyncAlt = svgWrapper(
  <>
    <path d="M23 4v6h-6" />
    <path d="M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10" />
    <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14" />
  </>
)

export const FaLeaf = svgWrapper(
  <>
    <path d="M2 22c0 0 6-3 10-10S22 2 22 2s-8 2-12 10-6 10-8 10z" />
    <path d="M9 13.5c-2.5 2-4 4.5-4 4.5" />
    <path d="M15 9.5c2 0 4.5-1.5 4.5-1.5" />
  </>
)

export const FaTrash = svgWrapper(
  <>
    <path d="M3 6h18" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M10 11v6M14 11v6" />
  </>
)

export const FaPaw = svgWrapper(
  <>
    <circle cx="12" cy="13" r="5" />
    <circle cx="6" cy="7" r="3" />
    <circle cx="18" cy="7" r="3" />
    <circle cx="12" cy="5" r="2.5" />
  </>
)

export const FaHospital = svgWrapper(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M12 7v10M7 12h10" />
  </>
)

export const FaExclamationTriangle = svgWrapper(
  <>
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <path d="M12 9v4" />
    <path d="M12 17h.01" />
  </>
)

export const FaBus = svgWrapper(
  <>
    <rect x="4" y="3" width="16" height="16" rx="2" />
    <path d="M4 11h16" />
    <path d="M8 3v4" />
    <path d="M16 3v4" />
    <path d="M6 19v2" />
    <path d="M18 19v2" />
    <path d="M8 15h.01M16 15h.01" />
  </>
)

export const FaRoad = svgWrapper(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M10 3l-2 18" />
    <path d="M14 3l2 18" />
    <path d="M12 3v4" />
    <path d="M12 10v4" />
    <path d="M12 17v4" />
  </>
)

export const FaUsers = svgWrapper(
  <>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </>
)

export const FaHandshake = svgWrapper(
  <>
    <path d="M16 8a3 3 0 0 0-3-3H4a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h9a3 3 0 0 0 3-3V8z" />
    <path d="M22 6a3 3 0 0 0-3-3h-2" />
    <path d="M17 21h2a3 3 0 0 0 3-3v-6" />
  </>
)

export const FaHome = svgWrapper(
  <>
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </>
)

export const FaHandsHelping = svgWrapper(
  <>
    <path d="M12 2a3 3 0 1 0 0 6 3 3 0 1 0 0-6z" />
    <path d="M19 14c1.5 0 2.5-1 2.5-2.5S20.5 9 19 9h-3.5L12 12.5H7.5A2.5 2.5 0 0 0 5 15v5" />
    <path d="M12 12.5V22" />
  </>
)

export const FaUniversity = svgWrapper(
  <>
    <path d="M3 22h18" />
    <path d="M6 18v-7" />
    <path d="M10 18v-7" />
    <path d="M14 18v-7" />
    <path d="M18 18v-7" />
    <path d="M2 11l10-8 10 8z" />
    <path d="M5 22v-4h14v4" />
  </>
)

export const FaBook = svgWrapper(
  <>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5v-15z" />
  </>
)

export const FaHeart = svgWrapper(
  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
)

export const FaGift = svgWrapper(
  <>
    <rect x="3" y="8" width="18" height="4" />
    <path d="M12 8V22" />
    <path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5H12" />
    <path d="M16.5 8a2.5 2.5 0 0 0 0-5H12" />
  </>
)

export const FaBed = svgWrapper(
  <>
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </>
)

export const FaDoorOpen = svgWrapper(
  <>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 3v18" />
    <path d="M13 12h.01" />
  </>
)

export const FaChartBar = svgWrapper(
  <>
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </>
)

export const FaTicketAlt = svgWrapper(
  <>
    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
    <path d="M12 5v14" />
    <path d="M9 12h6" />
  </>
)

export const FaOilCan = svgWrapper(
  <>
    <ellipse cx="12" cy="5" rx="6" ry="3" />
    <path d="M6 5v14c0 1.66 2.69 3 6 3s6-1.34 6-3V5" />
    <path d="M6 12c0 1.66 2.69 3 6 3s6-1.34 6-3" />
  </>
)

export const FaMobileAlt = svgWrapper(
  <>
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
    <line x1="12" y1="18" x2="12.01" y2="18" />
  </>
)

export const FaInbox = svgWrapper(
  <>
    <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
    <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
  </>
)

// Extra icons for Sidebar
export const FaCog = svgWrapper(
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </>
)

export const FaUser = svgWrapper(
  <>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>
)

export const FaCheckSquare = svgWrapper(
  <>
    <polyline points="9 11 12 14 22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </>
)

export const FaClipboardList = svgWrapper(
  <>
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 12h6" />
    <path d="M9 16h6" />
    <path d="M9 8H13" />
  </>
)
