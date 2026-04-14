const BASE = import.meta.env.VITE_API_URL || '/api';
const getToken = () => localStorage.getItem('robin_token');

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
}

export const api = {
  // Auth
  register: (d) => request('/auth/register', { method:'POST', body:JSON.stringify(d) }),
  login:    (d) => request('/auth/login',    { method:'POST', body:JSON.stringify(d) }),
  me:       ()  => request('/auth/me'),

  // Products — full filter support
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(Object.fromEntries(Object.entries(params).filter(([,v]) => v !== undefined && v !== ''))).toString();
    return request(`/products${qs ? '?'+qs : ''}`);
  },
  getTrending:    ()     => request('/products/trending'),
  getProduct:     (id)   => request(`/products/${id}`),
  getBySlug:      (slug) => request(`/products/slug/${slug}`),
  getRelated:     (id)   => request(`/products/${id}/related`),
  getFilters:     ()     => request('/products/filters'),

  // Cart
  getCart:        ()             => request('/cart'),
  addToCart:      (d)            => request('/cart', { method:'POST', body:JSON.stringify(d) }),
  updateCart:     (id, qty)      => request(`/cart/${id}`, { method:'PUT', body:JSON.stringify({ quantity:qty }) }),
  removeFromCart: (id)           => request(`/cart/${id}`, { method:'DELETE' }),

  // Orders
  createOrder:    (d)  => request('/orders',        { method:'POST', body:JSON.stringify(d) }),
  getMyOrders:    ()   => request('/orders'),

  // Reviews
  getReviews:    (productId, page=1) => request(`/products/${productId}/reviews?page=${page}&pageSize=5`),
  createReview:  (productId, d)      => request(`/products/${productId}/reviews`, { method:'POST', body:JSON.stringify(d) }),

  // Waitlist
  joinWaitlist:     (d)         => request('/waitlist', { method:'POST', body:JSON.stringify(d) }),
  getWaitlistCount: (productId) => request(`/waitlist/${productId}/count`),
  notifyWaitlist:   (productId) => request(`/waitlist/${productId}/notify`, { method:'POST' }),

  // Newsletter
  subscribe: (email) => request('/newsletter/subscribe', { method:'POST', body:JSON.stringify({ email }) }),

  // Admin
  adminStats:             ()        => request('/admin/stats'),
  adminOrders:            ()        => request('/admin/orders'),
  adminProducts:          ()        => request('/admin/products'),
  adminCreateProduct:     (d)       => request('/admin/products', { method:'POST', body:JSON.stringify(d) }),
  adminUpdateProduct:     (id,d)    => request(`/admin/products/${id}`, { method:'PUT',  body:JSON.stringify(d) }),
  adminDeleteProduct:     (id)      => request(`/admin/products/${id}`, { method:'DELETE' }),
  adminUpdateOrderStatus: (id,s)    => request(`/admin/orders/${id}/status`, { method:'PUT', body:JSON.stringify({ status:s }) }),
  adminUsers:             ()        => request('/admin/users'),
  adminFinance:           ()        => request('/admin/finance'),

  // Staff
  staffOrders:       ()         => request('/staff/orders'),
  staffShipOrder:    (id,d)     => request(`/staff/orders/${id}/ship`,   { method:'PUT', body:JSON.stringify(d) }),
  staffUpdateStatus: (id,s)     => request(`/staff/orders/${id}/status`, { method:'PUT', body:JSON.stringify({ status:s }) }),
};

export default api;
