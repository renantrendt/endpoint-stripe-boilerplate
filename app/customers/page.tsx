"use client"

import { CustomerList } from "@/components/customer-list"

export default function CustomersPage() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      <CustomerList />
    </div>
  )
}

