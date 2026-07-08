// LocalStorage utility for CRM data persistence
// 使用 localStorage 模拟数据持久化

import { customers as defaultCustomers, events as defaultEvents } from '../data/mockData';

const CUSTOMERS_KEY = 'cargoware_crm_customers';
const EVENTS_KEY = 'cargoware_crm_events';

export const storage = {
  // Initialize data from localStorage or use defaults
  init() {
    if (!localStorage.getItem(CUSTOMERS_KEY)) {
      localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(defaultCustomers));
    }
    if (!localStorage.getItem(EVENTS_KEY)) {
      localStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
    }
  },

  // Customers
  getCustomers() {
    try {
      return JSON.parse(localStorage.getItem(CUSTOMERS_KEY)) || defaultCustomers;
    } catch {
      return defaultCustomers;
    }
  },

  getCustomerById(id) {
    const customers = this.getCustomers();
    return customers.find((c) => c.id === id);
  },

  saveCustomer(customer) {
    const customers = this.getCustomers();
    const idx = customers.findIndex((c) => c.id === customer.id);
    if (idx >= 0) {
      customers[idx] = { ...customers[idx], ...customer };
    } else {
      customers.push(customer);
    }
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers));
  },

  // Events
  getEvents() {
    try {
      return JSON.parse(localStorage.getItem(EVENTS_KEY)) || defaultEvents;
    } catch {
      return defaultEvents;
    }
  },

  getEventsByCustomerId(customerId) {
    const events = this.getEvents();
    return events
      .filter((e) => e.customerId === customerId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  saveEvent(event) {
    const events = this.getEvents();
    const idx = events.findIndex((e) => e.id === event.id);
    if (idx >= 0) {
      events[idx] = { ...events[idx], ...event };
    } else {
      events.push(event);
    }
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  },

  // Stats
  getStats() {
    const customers = this.getCustomers();
    const events = this.getEvents();
    return {
      totalCustomers: customers.length,
      activeCustomers: customers.filter((c) => c.status === 'active').length,
      totalEvents: events.length,
      eventsThisWeek: events.filter((e) => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return new Date(e.createdAt) >= weekAgo;
      }).length,
    };
  },

  // Reset to defaults
  reset() {
    localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(defaultCustomers));
    localStorage.setItem(EVENTS_KEY, JSON.stringify(defaultEvents));
  },
};
