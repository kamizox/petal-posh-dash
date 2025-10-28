import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, DollarSign } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  initials: string;
  role: string;
  monthlySales: number;
  commission: number;
  totalCustomers: number;
  performance: number;
}

export default function Staff() {
  const staffMembers: StaffMember[] = [
    { id: 1, name: "Emily Parker", initials: "EP", role: "Senior Consultant", monthlySales: 12500, commission: 1875, totalCustomers: 89, performance: 125 },
    { id: 2, name: "Jessica Lee", initials: "JL", role: "Beauty Consultant", monthlySales: 9800, commission: 1470, totalCustomers: 67, performance: 98 },
    { id: 3, name: "Rachel Green", initials: "RG", role: "Beauty Consultant", monthlySales: 8200, commission: 1230, totalCustomers: 54, performance: 82 },
    { id: 4, name: "Amanda Wilson", initials: "AW", role: "Junior Consultant", monthlySales: 5600, commission: 840, totalCustomers: 41, performance: 56 },
  ];

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 100) return { label: "Excellent", color: "bg-green-100 text-green-700" };
    if (performance >= 80) return { label: "Good", color: "bg-blue-100 text-blue-700" };
    return { label: "Average", color: "bg-orange-100 text-orange-700" };
  };

  const totalSales = staffMembers.reduce((sum, member) => sum + member.monthlySales, 0);
  const totalCommission = staffMembers.reduce((sum, member) => sum + member.commission, 0);

  return (
    <div className="page-container">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-foreground mb-2">Staff Performance</h1>
        <p className="text-muted-foreground">Track team sales and commissions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="rounded-3xl border-white/20 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Team Sales</p>
                <h3 className="text-2xl font-bold text-primary">${totalSales.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-green-100 to-green-200">
                <DollarSign className="h-6 w-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/20 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Commission</p>
                <h3 className="text-2xl font-bold text-primary">${totalCommission.toLocaleString()}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200">
                <Award className="h-6 w-6 text-purple-700" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-white/20 shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Team Members</p>
                <h3 className="text-2xl font-bold text-primary">{staffMembers.length}</h3>
              </div>
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-100 to-pink-200">
                <TrendingUp className="h-6 w-6 text-pink-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {staffMembers.map((member) => {
          const perfBadge = getPerformanceBadge(member.performance);
          
          return (
            <Card key={member.id} className="rounded-3xl border-white/20 shadow-card hover:shadow-hover transition-all">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 bg-gradient-accent">
                    <AvatarFallback className="text-white font-bold text-lg">
                      {member.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                  <Badge className={`${perfBadge.color} rounded-full px-3 py-1`}>
                    {perfBadge.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-accent/50 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Monthly Sales</p>
                    <p className="text-lg font-bold text-primary">
                      ${member.monthlySales.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-mint/50 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Commission</p>
                    <p className="text-lg font-bold text-green-600">
                      ${member.commission.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-4 bg-soft-pink/50 rounded-2xl text-center">
                    <p className="text-xs text-muted-foreground mb-1">Customers</p>
                    <p className="text-lg font-bold">
                      {member.totalCustomers}
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Performance</span>
                    <span className="text-xs font-semibold">{member.performance}%</span>
                  </div>
                  <div className="w-full h-3 bg-accent rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-accent rounded-full transition-all"
                      style={{ width: `${Math.min(member.performance, 100)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
