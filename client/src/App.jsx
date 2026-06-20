import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";

const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/auth/login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Menu = lazy(() => import("./pages/customer/Menu"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const Unauthorized = lazy(() => import("./pages/Unauthorized"));
const QrEntry = lazy(() => import("./pages/customer/QrEntry"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const MenuManagement = lazy(() => import("./pages/admin/MenuManagement"));
const AddMenuItem = lazy(() => import("./pages/admin/AddMenuItem"));
const EditMenuItem = lazy(() => import("./pages/admin/EditMenuItem"));
const TableRoomManagement = lazy(() => import("./pages/admin/TableRoomManagement"));
const KitchenDashboard = lazy(() => import("./pages/kitchen/KitchenDashboard"));
const WaiterDashboard = lazy(() => import("./pages/waiter/WaiterDashboard"));
const Customers = lazy(() => import("./pages/admin/Customers"));
const MyOrders = lazy(() => import("./pages/customer/MyOrders"));
const CustomerProfile = lazy(() => import("./pages/customer/CustomerProfile"));
const SpecialEvents = lazy(() => import("./pages/customer/SpecialEvents"));
const HotelRooms = lazy(() => import("./pages/customer/HotelRooms"));
const HotelRoomBooking = lazy(() => import("./pages/customer/HotelRoomBooking"));
const MyBookings = lazy(() => import("./pages/customer/MyBookings"));
const HotelServices = lazy(() => import("./pages/customer/HotelServices"));
const CustomerDetails = lazy(() => import("./pages/admin/CustomerDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));
const StaffManagement = lazy(() => import("./pages/admin/StaffManagement"));
const Payments = lazy(() => import("./pages/admin/Payments"));
const EventBookings = lazy(() => import("./pages/admin/EventBookings"));
const HotelRoomManagement = lazy(() => import("./pages/admin/HotelRoomManagement"));
const HotelBookingManagement = lazy(() => import("./pages/admin/HotelBookingManagement"));

const RouteFallback = () => (
  <div className="min-h-screen bg-[#f8f6f2] p-5 md:p-8">
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="premium-shimmer h-20 rounded-[2rem]" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div key={item} className="premium-shimmer h-72 rounded-[2rem]" />
        ))}
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
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
       <Route
  path="/service/orders"
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
  <Route path="payments" element={<Payments />} />
  <Route path="events" element={<EventBookings />} />
  <Route path="waiter" element={<WaiterDashboard />} />
  <Route path="waiter/orders" element={<WaiterDashboard />} />
  <Route path="service" element={<WaiterDashboard />} />
  <Route path="service/orders" element={<WaiterDashboard />} />
  <Route path="kitchen" element={<KitchenDashboard />} />
  <Route path="tables" element={<TableRoomManagement />} />
  <Route path="hotel-rooms" element={<HotelRoomManagement />} />
  <Route path="bookings" element={<HotelBookingManagement />} />
  <Route index element={<AdminDashboard />} />
  <Route path="customers" element={<Customers />} />
  <Route path="customers/:id" element={<CustomerDetails />} />
  <Route path="staff" element={<StaffManagement />} />
</Route>

<Route
  path="/rooms"
  element={<HotelRooms />}
/>

<Route
  path="/rooms/:roomId/book"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <HotelRoomBooking />
    </ProtectedRoute>
  }
/>

<Route
  path="/bookings"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <MyBookings />
    </ProtectedRoute>
  }
/>

<Route
  path="/hotel-services"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <HotelServices />
    </ProtectedRoute>
  }
/>

<Route
  path="/my-orders"
  element={
    <ProtectedRoute allowedRoles={["customer", "admin"]}>
      <MyOrders />
    </ProtectedRoute>
  }
/>

<Route
  path="/events"
  element={<SpecialEvents />}
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
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
