import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";
import Menu from "./pages/customer/Menu";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "./routes/ProtectedRoute";
import QrEntry from "./pages/customer/QrEntry";
import Orders from "./pages/admin/Orders";
import AdminLayout from "./layouts/AdminLayout";
import MenuManagement from "./pages/admin/MenuManagement";
import AddMenuItem from "./pages/admin/AddMenuItem";
import EditMenuItem from "./pages/admin/EditMenuItem";
import TableRoomManagement from "./pages/admin/TableRoomManagement";
import KitchenDashboard from "./pages/kitchen/KitchenDashboard";
import WaiterDashboard from "./pages/waiter/WaiterDashboard";
import Customers from "./pages/admin/Customers";
import MyOrders from "./pages/customer/MyOrders";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerDetails from "./pages/admin/CustomerDetails";
import NotFound from "./pages/NotFound";
import StaffManagement from "./pages/admin/StaffManagement";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
       
       <Route
  path="/waiter/orders"
  element={
    <ProtectedRoute allowedRoles={["waiter", "admin"]}>
      <WaiterDashboard />
    </ProtectedRoute>
  }
/>

        <Route path="/qr/:token" element={<QrEntry />} />


        <Route
          path="/menu"
          element={
            <ProtectedRoute allowedRoles={["customer", "admin", "waiter"]}>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/kitchen"
          element={
            <ProtectedRoute allowedRoles={["kitchen", "admin"]}>
              <KitchenDashboard />
            </ProtectedRoute>
          }
        />

        

        <Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="menu" element={<MenuManagement />} />
  <Route path="menu/add" element={<AddMenuItem />} />
  <Route path="menu/edit/:id" element={<EditMenuItem />} />
  <Route path="orders" element={<Orders />} />
  <Route path="waiter" element={<WaiterDashboard />} />
  <Route path="waiter/orders" element={<WaiterDashboard />} />
  <Route path="kitchen" element={<KitchenDashboard />} />
  <Route path="tables" element={<TableRoomManagement />} />
  <Route index element={<AdminDashboard />} />
  <Route path="customers" element={<Customers />} />
  <Route path="customers/:id" element={<CustomerDetails />} />
  <Route path="staff" element={<StaffManagement />} />
</Route>

<Route
  path="/my-orders"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <MyOrders />
    </ProtectedRoute>
  }
/>

<Route
  path="/profile"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <CustomerProfile />
    </ProtectedRoute>
  }
/>
           
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
