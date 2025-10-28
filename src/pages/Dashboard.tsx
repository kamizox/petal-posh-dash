import StatCard from "@/components/Dashboard/StatCard";
import { Users, Package, DollarSign, AlertCircle, TrendingUp, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Dashboard() {
  const recentActivities = [
    { customer: "Sarah Johnson", action: "Purchased Vitamin C Serum", time: "5 min ago", amount: "$45.00" },
    { customer: "Emma Davis", action: "Consultation booked", time: "12 min ago", amount: "-" },
    { customer: "Olivia Smith", action: "Purchased Hydrating Cleanser", time: "25 min ago", amount: "$32.00" },
    { customer: "Sophia Brown", action: "Product returned", time: "1 hr ago", amount: "-$28.00" },
  ];

  const topProducts = [
    { name: "Vitamin C Serum", sales: 145, stock: 23 },
    { name: "Hyaluronic Acid", sales: 132, stock: 45 },
    { name: "Retinol Night Cream", sales: 98, stock: 12 },
    { name: "Gentle Cleanser", sales: 87, stock: 67 },
  ];

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your store overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Customers"
          value="1,284"
          icon={Users}
          trend="+12% from last month"
          trendUp={true}
          gradient="from-pink-100 to-pink-200"
        />
        <StatCard
          title="Low Stock Products"
          value="8"
          icon={Package}
          trend="3 need immediate attention"
          trendUp={false}
          gradient="from-orange-100 to-orange-200"
        />
        <StatCard
          title="Today's Sales"
          value="$2,847"
          icon={DollarSign}
          trend="+8% from yesterday"
          trendUp={true}
          gradient="from-green-100 to-green-200"
        />
        <StatCard
          title="Expiring Soon"
          value="12"
          icon={AlertCircle}
          trend="Within 30 days"
          trendUp={false}
          gradient="from-purple-100 to-purple-200"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card className="rounded-3xl border-white/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{activity.customer}</p>
                  <p className="text-xs text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{activity.amount}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card className="rounded-3xl border-white/20 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Top Selling Products
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">Stock: {product.stock} units</p>
                  </div>
                  <span className="font-semibold text-primary">{product.sales}</span>
                </div>
                <div className="w-full h-2 bg-accent rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-accent rounded-full transition-all"
                    style={{ width: `${(product.sales / 150) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
