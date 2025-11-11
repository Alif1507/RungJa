import React from "react";
import SidebarAdmin from "./Components/SidebarAdmin";
import { FaPlus } from "react-icons/fa6";

const PRODUCTS = [
  { name: 'Apple MacBook Pro 17"', color: "Silver", category: "Laptop", price: 2999 },
  { name: "Microsoft Surface Pro", color: "White", category: "Laptop PC", price: 1999 },
  { name: "Magic Mouse 2", color: "Black", category: "Accessories", price: 99 },
];

export default function Menu() {
  return (
    <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <SidebarAdmin />
      <main className="ml-64 p-6">
        <div className="flex flex-row justify-between items-center">
          <h1 className="text-3xl font-semibold text-gray-900 dark:text-white mb-6">Menu Management</h1>
          <button type="button" class="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 items-center flex">
            <FaPlus className="inline mr-2 mb-1" />
            Tambah Menu
          </button>
        </div>
        <div className="relative overflow-x-auto shadow-md rounded-lg bg-white dark:bg-gray-800">
          <table className="w-full text-sm text-left text-gray-600 dark:text-gray-300">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              <tr>
                <th scope="col" className="px-6 py-3">Nama Menu</th>
                <th scope="col" className="px-6 py-3">Stock</th>
                <th scope="col" className="px-6 py-3">kategory</th>
                <th scope="col" className="px-6 py-3">Price</th>
                <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((p) => (
                <tr
                  key={p.name}
                  className="border-b last:border-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap"
                  >
                    {p.name}
                  </th>
                  <td className="px-6 py-4">{p.color}</td>
                  <td className="px-6 py-4">{p.category}</td>
                  <td className="px-6 py-4">${p.price}</td>
                  <td className="px-6 py-4 text-right flex flex-row gap-4">
                    <button
                      type="button"
                      className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                      onClick={() => {
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="font-medium text-red-600 hover:underline dark:text-red-400"
                      onClick={() => {
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </section>
  );
}
