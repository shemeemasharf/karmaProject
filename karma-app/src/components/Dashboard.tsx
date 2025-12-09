import React, { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { TrendingUp, TrendingDown, Users, Package, FileText, DollarSign } from 'lucide-react';
import { Item } from '../types/types';
import { itemService } from '../api/services/itemService';
import './Dashboard.css';

// Define proper types for charts with index signature
interface ChartData {
  [key: string]: string | number;
  name: string;
  value: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change: number;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, change, color }) => (
  <div className="stat-card" style={{ borderLeftColor: color }}>
    <div className="stat-icon" style={{ backgroundColor: `${color}15` }}>
      {icon}
    </div>
    <div className="stat-content">
      <h3 className="stat-title">{title}</h3>
      <div className="stat-value-row">
        <p className="stat-value">{value}</p>
        <div className={`change-indicator ${change >= 0 ? 'positive' : 'negative'}`}>
          {change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC = () => {
  const [totalItems, setTotalItems] = useState<number>(0);
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [monthlyData, setMonthlyData] = useState<ChartData[]>([]);
  const [categoryData, setCategoryData] = useState<ChartData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items = await itemService.getItems();
        setTotalItems(items.length);
        
        // Get recent items (last 5)
        const recent = items.slice(-5);
        setRecentItems(recent);
        
        // Generate monthly data
        const currentMonth = new Date().getMonth();
        const monthly: ChartData[] = Array.from({ length: 7 }, (_, i) => {
          const monthIndex = (currentMonth - 6 + i + 12) % 12;
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          return {
            name: monthNames[monthIndex],
            value: Math.floor(Math.random() * 1000) + 100
          };
        });
        setMonthlyData(monthly);
        
        // Generate category data
        const categories: ChartData[] = [
          { name: 'Electronics', value: Math.floor(Math.random() * 100) + 20 },
          { name: 'Clothing', value: Math.floor(Math.random() * 100) + 20 },
          { name: 'Books', value: Math.floor(Math.random() * 100) + 20 },
          { name: 'Home', value: Math.floor(Math.random() * 100) + 20 },
          { name: 'Other', value: Math.floor(Math.random() * 100) + 20 },
        ];
        setCategoryData(categories);
        
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Statistics data
  const stats = [
    {
      title: 'Total Items',
      value: totalItems,
      icon: <Package size={24} />,
      change: 12.5,
      color: '#2575fc'
    },
    {
      title: 'Active Users',
      value: 42,
      icon: <Users size={24} />,
      change: 8.2,
      color: '#6a11cb'
    },
    {
      title: 'Total Reports',
      value: 156,
      icon: <FileText size={24} />,
      change: -3.2,
      color: '#ff4d4d'
    },
    {
      title: 'Revenue',
      value: '$12,450',
      icon: <DollarSign size={24} />,
      change: 18.7,
      color: '#00b894'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  // Custom label renderer for Pie chart
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </header>

      {/* Statistics Cards */}
      <div className="dashboard-grid">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <div className="chart-header">
            <h3>Monthly Items Added</h3>
            <select className="time-selector">
              <option>Last 7 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    backgroundColor: 'white'
                  }}
                  formatter={(value) => [`${value} items`, 'Count']}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  name="Items Added" 
                  fill="#2575fc" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="chart-container">
          <div className="chart-header">
            <h3>Items by Category</h3>
          </div>
          <div className="chart-wrapper">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => {
                    const payload = props.payload as ChartData;
                    return [`${value} items`, payload.name];
                  }}
                  contentStyle={{ 
                    borderRadius: '8px',
                    border: '1px solid #f0f0f0',
                    backgroundColor: 'white'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Items Table */}
      <div className="recent-items">
        <div className="section-header">
          <h3>Recent Items</h3>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Date Added</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="loading-row">Loading recent items...</td>
                </tr>
              ) : recentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-row">No recent items found</td>
                </tr>
              ) : (
                recentItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-name">
                        <div className="item-avatar">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        {item.name}
                      </div>
                    </td>
                    <td className="item-description">
                      {item.description.length > 50 
                        ? `${item.description.substring(0, 50)}...` 
                        : item.description}
                    </td>
                    <td>
                      {new Date().toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`status-badge ${index % 3 === 0 ? 'active' : index % 3 === 1 ? 'pending' : 'inactive'}`}>
                        {index % 3 === 0 ? 'Active' : index % 3 === 1 ? 'Pending' : 'Inactive'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;