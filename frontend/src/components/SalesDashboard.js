import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend, Area, AreaChart
} from 'recharts';
import { 
  TrendingUp, Package, Users, ShoppingCart, AlertTriangle, 
  IndianRupee, ArrowUp, ArrowDown, RefreshCw, Bell
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const SalesDashboard = () => {
  const [stats, setStats] = useState(null);
  const [lowStockAlerts, setLowStockAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, alertsRes] = await Promise.all([
        api.get('/admin/dashboard/stats'),
        api.get('/admin/low-stock-alerts')
      ]);
      setStats(statsRes.data);
      setLowStockAlerts(alertsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (productId, newStock) => {
    try {
      await api.put(`/admin/products/${productId}/stock`, { stock_quantity: newStock });
      toast.success('Stock updated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to update stock');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-slate-500">
        No data available
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="sales-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Sales Dashboard</h2>
        <Button variant="outline" size="sm" onClick={fetchDashboardData}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.revenue.total.toLocaleString()}`}
          icon={IndianRupee}
          color="blue"
          trend={stats.revenue.total > 0 ? "up" : "neutral"}
        />
        <StatCard
          title="Total Orders"
          value={stats.orders.total}
          subtitle={`${stats.orders.pending} pending`}
          icon={ShoppingCart}
          color="green"
        />
        <StatCard
          title="Products"
          value={stats.products.total}
          subtitle={`${stats.products.low_stock} low stock`}
          icon={Package}
          color="purple"
          alert={stats.products.low_stock > 0}
        />
        <StatCard
          title="Users"
          value={stats.users.total}
          subtitle={`${stats.users.verified} verified`}
          icon={Users}
          color="orange"
        />
      </div>

      {/* Low Stock Alerts */}
      {lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4" data-testid="low-stock-alerts">
          <div className="flex items-center space-x-2 mb-4">
            <Bell className="w-5 h-5 text-red-500 animate-pulse" />
            <h3 className="font-semibold text-red-700">Low Stock Alerts ({lowStockAlerts.length})</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lowStockAlerts.slice(0, 6).map((alert) => (
              <div 
                key={alert.id} 
                className={`p-3 rounded-lg ${
                  alert.status === 'out_of_stock' ? 'bg-red-100' : 
                  alert.status === 'critical' ? 'bg-orange-100' : 'bg-yellow-100'
                }`}
              >
                <p className="font-medium text-slate-900 truncate">{alert.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-sm font-semibold ${
                    alert.status === 'out_of_stock' ? 'text-red-600' : 
                    alert.status === 'critical' ? 'text-orange-600' : 'text-yellow-600'
                  }`}>
                    {alert.stock} in stock
                  </span>
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      const newStock = prompt(`Update stock for ${alert.name}:`, alert.stock);
                      if (newStock !== null) updateStock(alert.id, parseInt(newStock));
                    }}
                  >
                    Update
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Monthly Revenue</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={stats.revenue.monthly}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip 
                formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: '2px solid #E5E7EB' }}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={2}
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Category Sales */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
          <h3 className="font-semibold text-slate-900 mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={stats.category_sales}
                dataKey="revenue"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ category, percent }) => `${category.split(' ')[0]} ${(percent * 100).toFixed(0)}%`}
              >
                {stats.category_sales.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-4">
        <h3 className="font-semibold text-slate-900 mb-4">Top Selling Products</h3>
        {stats.top_products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-600">Product</th>
                  <th className="text-left py-2 px-3 text-sm font-semibold text-slate-600">Category</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-slate-600">Units Sold</th>
                  <th className="text-right py-2 px-3 text-sm font-semibold text-slate-600">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stats.top_products.map((product, index) => (
                  <tr key={index} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center space-x-2">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold`} style={{ backgroundColor: COLORS[index] }}>
                          {index + 1}
                        </span>
                        <span className="font-medium text-slate-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{product.category}</td>
                    <td className="py-3 px-3 text-right font-medium">{product.total_sold}</td>
                    <td className="py-3 px-3 text-right font-semibold text-green-600">₹{product.total_revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-500 text-center py-4">No sales data yet</p>
        )}
      </div>

      {/* Orders Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <p className="text-blue-100 text-sm">Completed Orders</p>
          <p className="text-3xl font-bold">{stats.orders.completed}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <p className="text-orange-100 text-sm">Pending Orders</p>
          <p className="text-3xl font-bold">{stats.orders.pending}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <p className="text-purple-100 text-sm">Pending Enquiries</p>
          <p className="text-3xl font-bold">{stats.enquiries.pending}</p>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, color, trend, alert }) => {
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} rounded-xl p-4 text-white relative overflow-hidden`}>
      {alert && (
        <div className="absolute top-2 right-2">
          <AlertTriangle className="w-5 h-5 text-yellow-300 animate-pulse" />
        </div>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-white/80 text-sm">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
          {subtitle && <p className="text-white/70 text-xs mt-1">{subtitle}</p>}
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      {trend && (
        <div className="flex items-center mt-2 text-xs">
          {trend === 'up' && <ArrowUp className="w-3 h-3 mr-1" />}
          {trend === 'down' && <ArrowDown className="w-3 h-3 mr-1" />}
          <span>{trend === 'up' ? 'Trending up' : trend === 'down' ? 'Trending down' : ''}</span>
        </div>
      )}
    </div>
  );
};

export default SalesDashboard;
