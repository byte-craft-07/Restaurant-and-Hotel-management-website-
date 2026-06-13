import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Users } from "lucide-react";
import api from "../../services/api";

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  const fetchCustomers = async () => {
    const res = await api.get("/users/customers");
    setCustomers(res.data.customers || []);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <div className="premium-label-pill mb-4">
          <Users size={18} />
          Customer CRM
        </div>
        <h1 className="text-4xl font-black text-slate-950">Customers</h1>
        <p className="mt-2 text-slate-500">
          Track customer IDs, history, spending and assigned offers.
        </p>
      </div>

      <div className="overflow-x-auto rounded-[2rem] border border-white/80 bg-white/75 shadow-xl backdrop-blur-2xl">
        <table className="w-full min-w-[720px] text-left">
          <thead className="bg-orange-50 text-sm text-slate-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Customer ID</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">Orders</th>
              <th className="p-4">Total Spent</th>
              <th className="p-4">Discount</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer._id}
                className="border-t border-orange-100 transition hover:bg-orange-50/70"
              >
                <td className="p-4">
                  <Link
                    to={`/admin/customers/${customer._id}`}
                    className="inline-flex items-center gap-2 font-black text-orange-500"
                  >
                    {customer.name}
                    <ArrowUpRight size={16} />
                  </Link>
                </td>
                <td className="p-4 font-semibold text-slate-700">
                  {customer.customerId || "-"}
                </td>
                <td className="p-4 text-slate-500">{customer.email}</td>
                <td className="p-4 text-slate-500">{customer.phone}</td>
                <td className="p-4 font-black text-orange-500">
                  {customer.orderCount || 0}
                </td>
                <td className="p-4 font-black text-green-600">
                  Rs. {customer.totalSpent || 0}
                </td>
                <td className="p-4 font-black text-pink-500">
                  {customer.discountPercent || 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {customers.length === 0 && (
          <div className="p-10 text-center text-slate-500">
            No customers found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Customers;
