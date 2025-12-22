import { useState } from "react";

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string;
  skinType: string;
  allergies: string[];
  purchases: number;
  lastVisit: string;
}

const initialCustomers: Customer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1 234-567-8901",
    email: "sarah.j@email.com",
    skinType: "Oily",
    allergies: ["Fragrance", "Parabens"],
    purchases: 24,
    lastVisit: "2 days ago",
  },
  {
    id: 2,
    name: "Emma Davis",
    phone: "+1 234-567-8902",
    email: "emma.d@email.com",
    skinType: "Dry",
    allergies: ["Alcohol"],
    purchases: 18,
    lastVisit: "5 days ago",
  },
  {
    id: 3,
    name: "Olivia Smith",
    phone: "+1 234-567-8903",
    email: "olivia.s@email.com",
    skinType: "Sensitive",
    allergies: ["Fragrance", "Essential Oils", "Sulfates"],
    purchases: 31,
    lastVisit: "1 day ago",
  },
  {
    id: 4,
    name: "Sophia Brown",
    phone: "+1 234-567-8904",
    email: "sophia.b@email.com",
    skinType: "Combination",
    allergies: [],
    purchases: 12,
    lastVisit: "1 week ago",
  },
];

// Shared state for customers (simulating a simple store)
let sharedCustomers = [...initialCustomers];
let listeners: (() => void)[] = [];

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

export function useCustomers() {
  const [customers, setCustomersState] = useState<Customer[]>(sharedCustomers);

  const subscribe = () => {
    const listener = () => setCustomersState([...sharedCustomers]);
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  const addCustomer = (customer: Customer) => {
    sharedCustomers = [customer, ...sharedCustomers];
    notifyListeners();
    setCustomersState([...sharedCustomers]);
  };

  const updateCustomer = (customer: Customer) => {
    sharedCustomers = sharedCustomers.map(c => 
      c.id === customer.id ? customer : c
    );
    notifyListeners();
    setCustomersState([...sharedCustomers]);
  };

  return {
    customers,
    addCustomer,
    updateCustomer,
    subscribe,
  };
}
