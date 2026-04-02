/**
 * WashAlert API Service — Mock Data Layer
 * All data is local mock data for demo purposes.
 */

// ============================================================
// MOCK DATA
// ============================================================

const MOCK_BRANCHES = [
  {
    id: 1, name: 'Triplets LaundryHubs - Makati Branch', city: 'Makati City',
    address: 'Makati Branch, Makati City',
    phone: '(02) 1234-5678', hours: '6:00 AM – 10:00 PM',
    distance: 1.2, rating: 4.8, status: 'open',
  },
  {
    id: 2, name: 'Triplets SpeedyWash - UP Diliman', city: 'Quezon City',
    address: 'UP Diliman, Quezon City',
    phone: '(02) 2345-6789', hours: '6:00 AM – 10:00 PM',
    distance: 2.5, rating: 4.7, status: 'open',
  },
  {
    id: 3, name: 'Triplets SpeedyWash - JP Rizal', city: 'Makati City',
    address: 'JP Rizal, Makati City',
    phone: '(02) 3456-7890', hours: '6:00 AM – 10:00 PM',
    distance: 3.1, rating: 4.9, status: 'open',
  },
  {
    id: 4, name: 'Triplets SpeedyWash - S. Catalina', city: 'Manila',
    address: 'S. Catalina, Manila',
    phone: '(02) 4567-8901', hours: '6:00 AM – 10:00 PM',
    distance: 4.0, rating: 4.6, status: 'open',
  },
  {
    id: 5, name: 'Triplets SpeedyWash - Pasig', city: 'Pasig City',
    address: 'Pasig City',
    phone: '(02) 5678-9012', hours: '6:00 AM – 10:00 PM',
    distance: 2.8, rating: 4.5, status: 'open',
  },
  {
    id: 6, name: 'Triplets SpeedyWash - Republic', city: 'Quezon City',
    address: 'Republic Ave, Quezon City',
    phone: '(02) 6789-0123', hours: '6:00 AM – 10:00 PM',
    distance: 3.5, rating: 4.4, status: 'open',
  },
  {
    id: 7, name: 'Triplets SpeedyWash - Chestnut', city: 'Quezon City',
    address: 'Chestnut St, Quezon City',
    phone: '(02) 7890-1234', hours: '6:00 AM – 10:00 PM',
    distance: 5.2, rating: 4.3, status: 'open',
  },
  {
    id: 8, name: 'Triplets SpeedyWash - T.O.N', city: 'Manila',
    address: 'Tondo, Manila',
    phone: '(02) 8901-2345', hours: '6:00 AM – 10:00 PM',
    distance: 6.0, rating: 4.2, status: 'open',
  },
  {
    id: 9, name: 'Triplets SpeedyWash - Samat', city: 'Quezon City',
    address: 'Samat St, Quezon City',
    phone: '(02) 9012-3456', hours: '6:00 AM – 10:00 PM',
    distance: 4.5, rating: 4.6, status: 'open',
  },
  {
    id: 10, name: 'Triplets SpeedyWash - St. Nino', city: 'Quezon City',
    address: 'St. Nino, Quezon City',
    phone: '(02) 0123-4567', hours: '6:00 AM – 10:00 PM',
    distance: 7.1, rating: 4.1, status: 'open',
  },
];

const MOCK_SERVICES = [
  { id: "wash-dry", name: "Wash & Dry", price: 65, icon: "water-outline", description: "Complete cleaning and drying service" },
  { id: "wash-only", name: "Wash Only", price: 45, icon: "water-outline", description: "Washing service without drying" },
  { id: "dry-only", name: "Dry Only", price: 35, icon: "sunny-outline", description: "Drying service for wet clothes" },
  { id: "wash-fold", name: "Wash & Fold", price: 80, icon: "shirt-outline", description: "Premium wash, dry, and folding" },
];

const MOCK_DETERGENTS = ["Tide", "Ariel", "Breeze", "Surf", "None"];
const MOCK_CONDITIONERS = ["Downy", "Surf Fabcon", "Del Fabric", "None"];

const MOCK_ORDERS = [
  {
    id: 'WA-2024-001',
    trackingNumber: 'WA-2024-001',
    branchId: 1,
    branchName: 'Triplets LaundryHubs - Makati Branch',
    serviceType: 'Wash & Dry',
    loadKg: 5,
    detergent: 'Tide',
    conditioner: 'Downy',
    status: 'washing',
    amount: 375,
    amountPaid: 375,
    paymentMethod: 'GCash',
    date: 'Jan 15, 2024',
    dateBooked: '2024-01-15T10:30:00Z',
    estimatedTime: '2-3 hours',
  },
  {
    id: 'WA-2024-002',
    trackingNumber: 'WA-2024-002',
    branchId: 3,
    branchName: 'Triplets SpeedyWash - JP Rizal',
    serviceType: 'Wash Only',
    loadKg: 3,
    detergent: 'Ariel',
    conditioner: 'None',
    status: 'delivered',
    amount: 135,
    amountPaid: 135,
    paymentMethod: 'Cash',
    date: 'Jan 14, 2024',
    dateBooked: '2024-01-14T14:00:00Z',
    estimatedTime: 'Completed',
  },
  {
    id: 'WA-2024-003',
    trackingNumber: 'WA-2024-003',
    branchId: 2,
    branchName: 'Triplets SpeedyWash - UP Diliman',
    serviceType: 'Dry Cleaning',
    loadKg: 2,
    detergent: 'None',
    conditioner: 'None',
    status: 'ready',
    amount: 300,
    amountPaid: 300,
    paymentMethod: 'GCash',
    date: 'Jan 13, 2024',
    dateBooked: '2024-01-13T09:00:00Z',
    estimatedTime: 'Ready for pickup',
  },
  {
    id: 'WA-2024-004',
    trackingNumber: 'WA-2024-004',
    branchId: 5,
    branchName: 'Triplets SpeedyWash - Pasig',
    serviceType: 'Full Service',
    loadKg: 4,
    detergent: 'Breeze',
    conditioner: 'Downy',
    status: 'pending',
    amount: 450,
    amountPaid: 450,
    paymentMethod: 'GCash',
    date: 'Jan 16, 2024',
    dateBooked: '2024-01-16T08:00:00Z',
    estimatedTime: '4-5 hours',
  },
];

const MOCK_DELIVERIES = [
  {
    id: 'del_001',
    customerName: 'John Doe',
    customerPhone: '09171234567',
    deliveryAddress: '123 Main St, Brgy. Commonwealth, QC',
    orderNumber: 'WA-2024-001',
    branchName: 'Triplets Main',
    itemsCount: 5,
    status: 'pending',
    assignedAt: '2024-01-16T06:00:00Z',
    estimatedDelivery: '2024-01-16T14:00:00Z',
  },
  {
    id: 'del_002',
    customerName: 'Jane Smith',
    customerPhone: '09181234567',
    deliveryAddress: '456 Cubao Ave, QC',
    orderNumber: 'WA-2024-002',
    branchName: 'Triplets Cubao',
    itemsCount: 3,
    status: 'in_progress',
    assignedAt: '2024-01-16T07:00:00Z',
    estimatedDelivery: '2024-01-16T15:00:00Z',
  },
  {
    id: 'del_003',
    customerName: 'Maria Garcia',
    customerPhone: '09191234567',
    deliveryAddress: '789 Makati Blvd, Makati',
    orderNumber: 'WA-2024-003',
    branchName: 'Triplets Makati',
    itemsCount: 2,
    status: 'completed',
    assignedAt: '2024-01-15T06:00:00Z',
    estimatedDelivery: '2024-01-15T14:00:00Z',
    completedAt: '2024-01-15T13:45:00Z',
  },
];

const MOCK_NOTIFICATIONS = [
  {
    id: 'notif_001', type: 'order_update',
    title: 'Laundry Update', message: 'Your laundry is now being washed at Triplets Main',
    timestamp: '2024-01-15T11:00:00Z', read: false, icon: 'water-outline',
  },
  {
    id: 'notif_002', type: 'payment',
    title: 'Payment Confirmed', message: 'Payment of ₱250 via GCash confirmed',
    timestamp: '2024-01-15T10:30:00Z', read: false, icon: 'checkmark-circle-outline',
  },
  {
    id: 'notif_003', type: 'promo',
    title: '20% Off This Weekend!', message: 'Use code CLEAN20 for 20% off your next booking',
    timestamp: '2024-01-14T09:00:00Z', read: true, icon: 'pricetag-outline',
  },
  {
    id: 'notif_004', type: 'order_update',
    title: 'Ready for Pickup', message: 'Your laundry at Triplets Cubao is ready!',
    timestamp: '2024-01-13T18:00:00Z', read: true, icon: 'checkmark-done-outline',
  },
];

// ============================================================
// HELPER FUNCTIONS (used by screens)
// ============================================================

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const fetchBranches = async () => {
  await delay(500);
  return MOCK_BRANCHES;
};

export const fetchOrders = async (status = 'all') => {
  await delay(500);
  if (status === 'all') return MOCK_ORDERS;
  return MOCK_ORDERS.filter((o) => o.status === status);
};

export const createOrder = async (orderData) => {
  await delay(1000);
  const newOrder = {
    id: `WA-2024-${String(MOCK_ORDERS.length + 1).padStart(3, '0')}`,
    trackingNumber: `WA-2024-${String(MOCK_ORDERS.length + 1).padStart(3, '0')}`,
    branchName: MOCK_BRANCHES.find((b) => b.id === orderData.branchId)?.name || 'Unknown',
    serviceType: orderData.serviceType || 'Wash & Dry',
    loadKg: orderData.loadKg || 5,
    detergent: orderData.detergent || 'None',
    conditioner: orderData.conditioner || 'None',
    scheduleDate: orderData.scheduleDate || 'Today',
    scheduleTime: orderData.scheduleTime || 'ASAP',
    status: 'pending',
    amount: orderData.total || 350,
    paymentMethod: orderData.paymentMethod || 'Cash',
    paymentStatus: orderData.paymentMethod === 'gcash' ? 'Paid' : 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    dateBooked: new Date().toISOString(),
    estimatedTime: '3-4 hours',
    ...orderData,
  };
  MOCK_ORDERS.unshift(newOrder);
  return newOrder;
};

export const laundry = {
  getServices: async () => {
    await delay(300);
    return { services: MOCK_SERVICES };
  },
  getPreferences: async () => {
    await delay(300);
    return { detergents: MOCK_DETERGENTS, conditioners: MOCK_CONDITIONERS };
  },
};

export const mockOrders = MOCK_ORDERS;

// ============================================================
// GROUPED SERVICE OBJECTS (for structured access)
// ============================================================

export const bookings = {
  getMyBookings: async (status = 'all', limit = 20) => {
    await delay(400);
    let filtered = [...MOCK_ORDERS];
    if (status !== 'all') {
      const statusMap = {
        active: ['pending', 'received', 'washing', 'drying', 'ready'],
        completed: ['delivered', 'completed'],
        cancelled: ['cancelled'],
      };
      filtered = filtered.filter((o) => statusMap[status]?.includes(o.status));
    }
    return { bookings: filtered.slice(0, limit), total: filtered.length };
  },
  getById: async (id) => {
    await delay(300);
    return MOCK_ORDERS.find((o) => o.id === id) || null;
  },
  getTimeline: async () => {
    await delay(300);
    return {
      timeline: [
        { status: 'received', timestamp: '2024-01-15T10:30:00Z', description: 'Laundry received' },
        { status: 'washing', timestamp: '2024-01-15T11:00:00Z', description: 'Now washing' },
        { status: 'drying', timestamp: '2024-01-15T17:00:00Z', description: 'Now drying' },
        { status: 'ready', timestamp: '2024-01-16T01:00:00Z', description: 'Ready for pickup' },
      ],
    };
  },
};

export const branches = {
  getAll: async () => {
    await delay(400);
    return { branches: MOCK_BRANCHES };
  },
  getById: async (id) => {
    await delay(200);
    return MOCK_BRANCHES.find((b) => b.id === id) || null;
  },
};

export const deliveries = {
  getAssigned: async (status = 'all') => {
    await delay(400);
    let filtered = [...MOCK_DELIVERIES];
    if (status !== 'all') {
      filtered = filtered.filter((d) => d.status === status);
    }
    return { deliveries: filtered };
  },
  getById: async (id) => {
    await delay(200);
    return MOCK_DELIVERIES.find((d) => d.id === id) || null;
  },
  updateStatus: async (id, status) => {
    await delay(500);
    const delivery = MOCK_DELIVERIES.find((d) => d.id === id);
    if (delivery) delivery.status = status;
    return { success: true };
  },
};

export const notifications = {
  getAll: async () => {
    await delay(300);
    return { notifications: MOCK_NOTIFICATIONS };
  },
  markAsRead: async (id) => {
    const notif = MOCK_NOTIFICATIONS.find((n) => n.id === id);
    if (notif) notif.read = true;
    return { success: true };
  },
  markAllAsRead: async () => {
    MOCK_NOTIFICATIONS.forEach((n) => { n.read = true; });
    return { success: true };
  },
};

export default {
  fetchBranches,
  fetchOrders,
  createOrder,
  bookings,
  branches,
  deliveries,
  notifications,
};