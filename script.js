const codes = {

home: `
// Home.jsx

import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

// Function to format money into Indonesian Rupiah
const formatIDR = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(amount || 0);

export default function Home() {

  // React state to store input value
  const [listName, setListName] = useState('');

  // Fetch shopping lists from backend API
  const { data: lists = [] } = useQuery({
    queryKey: ['shoppingLists'],  // Unique key for caching
    queryFn: () => base44.entities.ShoppingList.list()
  });

  // Create new list using mutation
  const createListMutation = useMutation({
    mutationFn: (name) =>
      base44.entities.ShoppingList.create({
        name,
        status: 'active'
      }),

    // After success, refresh list
    onSuccess: () => {
      console.log("List Created");
    }
  });

  return (
    <div>
      {/* Controlled input */}
      <input
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />

      {/* Trigger mutation */}
      <button onClick={() => createListMutation.mutate(listName)}>
        Create List
      </button>

      {/* Display total lists */}
      <p>Total Lists: {lists.length}</p>
    </div>
  );
}
`,

lists: `
// Lists.jsx

// Fetch all lists and items
const { data: lists = [] } = useQuery(...);
const { data: allItems = [] } = useQuery(...);

// Function to calculate statistics per list
const getListStats = (listId) => {

  // Filter items that belong to the selected list
  const listItems = allItems.filter(
    item => item.list_id === listId
  );

  return {
    // Count total quantity
    itemCount: listItems.reduce(
      (sum, item) => sum + (item.quantity || 1),
      0
    ),

    // Count picked items
    pickedCount: listItems.filter(
      item => item.is_picked
    ).length,

    // Calculate estimated cost
    estimatedTotal: listItems.reduce(
      (sum, item) =>
        sum + (item.estimated_price || 0) * (item.quantity || 1),
      0
    )
  };
};
`,

dashboard: `
// Dashboard.jsx

// Calculate total items
const totalItemCount = allItems.reduce(
  (sum, item) => sum + (item.quantity || 1),
  0
);

// Calculate total estimated spending
const totalEstimated = allItems.reduce(
  (sum, item) =>
    sum + (item.estimated_price || 0) * (item.quantity || 1),
  0
);

// Prepare data for charts
const listComparisonData = activeLists.map(list => {

  const listItems = allItems.filter(
    item => item.list_id === list.id
  );

  const estimated = listItems.reduce(
    (sum, item) =>
      sum + (item.estimated_price || 0) * (item.quantity || 1),
    0
  );

  return {
    name: list.name,
    estimated: estimated,
    budget: list.budget || 0
  };
});

// These values are then used in Recharts
// to render BarChart and PieChart components.
`
};

function showCode(section) {
  document.getElementById("codeDisplay").textContent = codes[section];
}
