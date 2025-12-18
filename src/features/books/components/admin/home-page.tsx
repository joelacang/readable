"use client";

import { useState } from "react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Star,
  TrendingUp,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Progress } from "~/components/ui/progress";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { AdminView, type BookDetail } from "~/types/book";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { AdminViewDetails } from "~/utils/get-values";
import BookOrders from "./book-orders";

// Mock data
const salesData = [
  { month: "Jan", sales: 4000, revenue: 2400 },
  { month: "Feb", sales: 3000, revenue: 1398 },
  { month: "Mar", sales: 2000, revenue: 9800 },
  { month: "Apr", sales: 2780, revenue: 3908 },
  { month: "May", sales: 1890, revenue: 4800 },
  { month: "Jun", sales: 2390, revenue: 3800 },
];

const categoryData = [
  { name: "Electronics", value: 400, color: "var(--chart-1)" },
  { name: "Clothing", value: 300, color: "var(--chart-2)" },
  { name: "Books", value: 200, color: "var(--chart-3)" },
  { name: "Home", value: 100, color: "var(--chart-4)" },
];

const recentReviews = [
  {
    id: 1,
    user: "John Doe",
    rating: 5,
    comment: "Excellent product! Highly recommended.",
    date: "2024-01-15",
  },
  {
    id: 2,
    user: "Jane Smith",
    rating: 4,
    comment: "Good quality, fast shipping.",
    date: "2024-01-14",
  },
  {
    id: 3,
    user: "Mike Johnson",
    rating: 5,
    comment: "Perfect! Exactly what I needed.",
    date: "2024-01-13",
  },
];

const inventoryAlerts = [
  {
    id: 1,
    type: "low-stock",
    message: "Only 5 units left in stock",
    severity: "warning",
  },
  {
    id: 2,
    type: "out-of-stock",
    message: "Size M is out of stock",
    severity: "error",
  },
  {
    id: 3,
    type: "restock",
    message: "Restock scheduled for tomorrow",
    severity: "info",
  },
];

interface Props {
  book: BookDetail;
}
export default function BookAdmin({ book }: Props) {
  const [currentView, setCurrentView] = useState<AdminView>(AdminView.OVERVIEW);

  const handleViewChange = (view: AdminView) => {
    setCurrentView(view);
  };

  return (
    <div className="h-[calc(100dvh-124px)]">
      {/* Main Content */}
      <div className="flex h-full">
        {/* Content Area */}
        <main className="flex flex-1 flex-col space-y-4 overflow-y-auto">
          <div className="bg-background sticky top-[0] z-50 w-full border-b xl:hidden">
            <div className="flex w-full items-center justify-end px-4 py-2">
              <Select value={currentView} onValueChange={handleViewChange}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="Select View" />
                </SelectTrigger>
                <SelectContent className="p-2">
                  {Object.entries(AdminViewDetails).map(([view, detail]) => (
                    <SelectItem
                      className="cursor-pointer space-x-4 px-2 py-2"
                      value={view}
                      key={view}
                    >
                      <detail.icon className="mr-2 h-4 w-4" />
                      <p>{detail.label}</p>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 p-4">
            {currentView === AdminView.OVERVIEW && (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total Sales
                      </CardTitle>
                      <DollarSign className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">$45,231</div>
                      <p className="text-muted-foreground text-xs">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +20.1% from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Units Sold
                      </CardTitle>
                      <Package className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">2,350</div>
                      <p className="text-muted-foreground text-xs">
                        <TrendingUp className="mr-1 inline h-3 w-3" />
                        +180 from last month
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Avg. Rating
                      </CardTitle>
                      <Star className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8</div>
                      <p className="text-muted-foreground text-xs">
                        Based on 1,234 reviews
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Stock Level
                      </CardTitle>
                      <Package className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">847</div>
                      <p className="text-muted-foreground text-xs">
                        <AlertTriangle className="mr-1 inline h-3 w-3 text-yellow-500" />
                        Low stock alert
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Sales Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>
                      Monthly sales and revenue trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={salesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="sales" fill="var(--chart-1)" />
                        <Bar dataKey="revenue" fill="var(--chart-2)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Inventory Alerts */}
                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Alerts</CardTitle>
                    <CardDescription>
                      Important stock notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {inventoryAlerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-center space-x-3 rounded-lg border p-3"
                        >
                          {alert.severity === "warning" && (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          )}
                          {alert.severity === "error" && (
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                          )}
                          {alert.severity === "info" && (
                            <CheckCircle className="h-5 w-5 text-blue-500" />
                          )}
                          <span className="text-sm">{alert.message}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === AdminView.ANALYTICS && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Sales Trend</CardTitle>
                      <CardDescription>
                        Daily sales over the last 30 days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="sales"
                            stroke="var(--chart-1)"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Category Distribution</CardTitle>
                      <CardDescription>
                        Sales by product category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            dataKey="value"
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>
                      Key performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Conversion Rate
                          </span>
                          <span className="text-muted-foreground text-sm">
                            3.2%
                          </span>
                        </div>
                        <Progress value={32} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Return Rate
                          </span>
                          <span className="text-muted-foreground text-sm">
                            1.8%
                          </span>
                        </div>
                        <Progress value={18} className="h-2" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">
                            Customer Satisfaction
                          </span>
                          <span className="text-muted-foreground text-sm">
                            96%
                          </span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === AdminView.INVENTORY && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Management</CardTitle>
                    <CardDescription>
                      Current inventory levels and variants
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <div className="space-y-2">
                          <Label htmlFor="total-stock">Total Stock</Label>
                          <Input id="total-stock" defaultValue="847" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="reserved">Reserved</Label>
                          <Input id="reserved" defaultValue="23" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="available">Available</Label>
                          <Input id="available" defaultValue="824" />
                        </div>
                      </div>

                      <div className="rounded-lg border">
                        <div className="border-b p-4">
                          <h4 className="font-medium">Variants</h4>
                        </div>
                        <div className="divide-y">
                          {["Black", "White", "Silver"].map((color) => (
                            <div
                              key={color}
                              className="flex items-center justify-between p-4"
                            >
                              <div className="flex items-center space-x-3">
                                <div
                                  className={`h-4 w-4 rounded-full ${color === "Black" ? "bg-black" : color === "White" ? "border bg-white" : "bg-gray-400"}`}
                                />
                                <span className="font-medium">{color}</span>
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-muted-foreground text-sm">
                                  Stock: 282
                                </span>
                                <Button variant="outline" size="sm">
                                  Update
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Reorder Settings</CardTitle>
                    <CardDescription>
                      Automatic reorder configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="reorder-point">Reorder Point</Label>
                        <Input id="reorder-point" defaultValue="100" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="reorder-quantity">
                          Reorder Quantity
                        </Label>
                        <Input id="reorder-quantity" defaultValue="500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === AdminView.REVIEWS && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Reviews</CardTitle>
                    <CardDescription>
                      Recent customer feedback and ratings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentReviews.map((review) => (
                        <div key={review.id} className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarFallback>
                                  {review.user
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{review.user}</p>
                                <div className="flex items-center space-x-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>
                            <span className="text-muted-foreground text-sm">
                              {review.date}
                            </span>
                          </div>
                          <p className="mt-3 text-sm">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === AdminView.PRICING && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pricing Information</CardTitle>
                    <CardDescription>
                      Product pricing and discount settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="base-price">Base Price</Label>
                        <Input id="base-price" defaultValue="$299.99" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sale-price">Sale Price</Label>
                        <Input id="sale-price" defaultValue="$249.99" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cost">Cost</Label>
                        <Input id="cost" defaultValue="$150.00" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="margin">Profit Margin</Label>
                        <Input id="margin" defaultValue="66.7%" disabled />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Discount Settings</CardTitle>
                    <CardDescription>
                      Configure promotional pricing
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="bulk-discount"
                          className="rounded"
                        />
                        <Label htmlFor="bulk-discount">
                          Enable bulk discount
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="seasonal-discount"
                          className="rounded"
                        />
                        <Label htmlFor="seasonal-discount">
                          Seasonal discount active
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {currentView === AdminView.ORDERS && (
              <BookOrders bookId={book.id} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
