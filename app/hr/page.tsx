"use client";

import { useState } from "react";
import { HRLayout } from "@/components/HRLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Search,
  Users,
  Clock,
  Coffee,
  Filter,
  Send,
  FileText,
  Calendar as CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";

// Function to generate PDF report
const generateAttendanceReport = (employees: typeof employeesData) => {
  const reportContent = `
ATTENDANCE REPORT
Generated: ${new Date().toLocaleString()}
${"=".repeat(60)}

SUMMARY
-------
Total Employees: ${employees.length}
Currently Working: ${employees.filter((e) => e.status === "Working").length}
On Break: ${employees.filter((e) => e.status === "On Break").length}
Clocked Out: ${employees.filter((e) => e.status === "Clocked Out").length}

EMPLOYEE DETAILS
----------------
${employees
  .map(
    (emp) => `
Name: ${emp.name}
Status: ${emp.status}
Client: ${emp.client}
Clock In: ${emp.clockIn}
Working Time: ${emp.workingTime}
${"─".repeat(40)}`
  )
  .join("")}

${"=".repeat(60)}
End of Report
  `;

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `attendance-report-${
    new Date().toISOString().split("T")[0]
  }.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Mock employee data
const employeesData = [
  {
    id: 1,
    name: "Alice Johnson",
    status: "Working",
    client: "Acme Corp",
    clockIn: "09:00 AM",
    workingTime: "3h 45m",
    attendance: {
      attended: 70,
      late: 15,
      absent: 5,
      leave: 10,
    },
  },
  {
    id: 2,
    name: "Bob Smith",
    status: "On Break",
    client: "TechStart Inc",
    clockIn: "08:45 AM",
    workingTime: "4h 0m",
    attendance: {
      attended: 65,
      late: 20,
      absent: 10,
      leave: 5,
    },
  },
  {
    id: 3,
    name: "Carol Martinez",
    status: "Working",
    client: "Global Systems",
    clockIn: "08:30 AM",
    workingTime: "4h 15m",
    attendance: {
      attended: 80,
      late: 10,
      absent: 5,
      leave: 5,
    },
  },
  {
    id: 4,
    name: "David Lee",
    status: "Clocked Out",
    client: "N/A",
    clockIn: "N/A",
    workingTime: "0h 0m",
    attendance: {
      attended: 55,
      late: 25,
      absent: 15,
      leave: 5,
    },
  },
  {
    id: 5,
    name: "Emma Wilson",
    status: "Working",
    client: "InnovateCo",
    clockIn: "09:00 AM",
    workingTime: "3h 45m",
    attendance: {
      attended: 75,
      late: 10,
      absent: 5,
      leave: 10,
    },
  },
  {
    id: 6,
    name: "Frank Brown",
    status: "Working",
    client: "Digital Solutions",
    clockIn: "08:15 AM",
    workingTime: "4h 30m",
    attendance: {
      attended: 85,
      late: 8,
      absent: 2,
      leave: 5,
    },
  },
  {
    id: 7,
    name: "Grace Chen",
    status: "On Break",
    client: "Acme Corp",
    clockIn: "09:15 AM",
    workingTime: "3h 30m",
    attendance: {
      attended: 60,
      late: 20,
      absent: 12,
      leave: 8,
    },
  },
  {
    id: 8,
    name: "Henry Davis",
    status: "Working",
    client: "TechStart Inc",
    clockIn: "08:45 AM",
    workingTime: "4h 0m",
    attendance: {
      attended: 78,
      late: 12,
      absent: 5,
      leave: 5,
    },
  },
];

export default function HRPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [employees] = useState(employeesData);
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();

  // Generate weekly data
  const weeklyData = [
    { day: "Mon", attendance: 7 },
    { day: "Tue", attendance: 8 },
    { day: "Wed", attendance: 6 },
    { day: "Thu", attendance: 8 },
    { day: "Fri", attendance: 7 },
    { day: "Sat", attendance: 3 },
    { day: "Sun", attendance: 2 },
  ];

  // Generate monthly data
  const monthlyData = [
    { day: "Week 1", attendance: 35 },
    { day: "Week 2", attendance: 38 },
    { day: "Week 3", attendance: 33 },
    { day: "Week 4", attendance: 40 },
  ];

  // Generate custom range data (mock)
  const customRangeData =
    dateFrom && dateTo
      ? Array.from({ length: 7 }, (_, i) => ({
          day: `Day ${i + 1}`,
          // eslint-disable-next-line react-hooks/purity
          attendance: Math.floor(Math.random() * 5) + 4,
        }))
      : [];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Working":
        return "default";
      case "On Break":
        return "secondary";
      case "Clocked Out":
        return "destructive";
      default:
        return "default";
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalEmployees = employees.length;
  const workingEmployees = employees.filter(
    (e) => e.status === "Working"
  ).length;
  const onBreakEmployees = employees.filter(
    (e) => e.status === "On Break"
  ).length;
  const clockedOutEmployees = employees.filter(
    (e) => e.status === "Clocked Out"
  ).length;

  return (
    <HRLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Time Logs & Attendance
            </h1>
            <p className="text-muted-foreground">
              Monitor employee work hours and attendance in real-time
            </p>
          </div>
          <Button onClick={() => generateAttendanceReport(employees)}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold">{totalEmployees}</div>
              <p className="text-sm text-muted-foreground">All employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Currently Working
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-green-600">
                {workingEmployees}
              </div>
              <p className="text-sm text-muted-foreground">Active now</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Break</CardTitle>
              <Coffee className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-orange-600">
                {onBreakEmployees}
              </div>
              <p className="text-sm text-muted-foreground">Taking a break</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clocked Out</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
              <div className="text-4xl font-bold text-gray-600">
                {clockedOutEmployees}
              </div>
              <p className="text-sm text-muted-foreground">Not working</p>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Analytics */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>
              View attendance data across different time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="weekly" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="custom">Custom Range</TabsTrigger>
              </TabsList>

              <TabsContent value="weekly">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={weeklyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                    <XAxis dataKey="day" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#333333",
                        border: "1px solid #444444",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#C4D600"
                      strokeWidth={3}
                      dot={{ fill: "#C4D600", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="monthly">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                    <XAxis dataKey="day" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#333333",
                        border: "1px solid #444444",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="attendance"
                      stroke="#C4D600"
                      strokeWidth={3}
                      dot={{ fill: "#C4D600", r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>

              <TabsContent value="custom">
                <div className="space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">From</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-[240px] justify-start text-left font-normal ${
                              !dateFrom && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateFrom ? (
                              format(dateFrom, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">To</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-[240px] justify-start text-left font-normal ${
                              !dateTo && "text-muted-foreground"
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateTo ? (
                              format(dateTo, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {dateFrom && dateTo ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart
                        data={customRangeData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
                        <XAxis dataKey="day" stroke="#888888" />
                        <YAxis stroke="#888888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#333333",
                            border: "1px solid #444444",
                            borderRadius: "8px",
                            color: "#ffffff",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="attendance"
                          stroke="#C4D600"
                          strokeWidth={3}
                          dot={{ fill: "#C4D600", r: 6 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                      Please select both start and end dates to view the chart
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Employee Records Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  Employee Records ({filteredEmployees.length})
                </CardTitle>
                <CardDescription>
                  Track all employee attendance and work hours
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Send className="h-4 w-4 mr-2" />
                  Send Spot Check
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name, client, or status..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Working Time</TableHead>
                  <TableHead>Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">
                      {employee.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(employee.status)}>
                        {employee.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{employee.client}</TableCell>
                    <TableCell>{employee.clockIn}</TableCell>
                    <TableCell className="font-medium">
                      {employee.workingTime}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium min-w-[40px]">
                          {employee.attendance.attended}%
                        </span>
                        <div className="flex-1 min-w-[100px]">
                          <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden flex">
                            {/* Attended - Green */}
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${employee.attendance.attended}%`,
                                backgroundColor: "#C4D600",
                              }}
                            />
                            {/* Late - Orange */}
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${employee.attendance.late}%`,
                                backgroundColor: "#FFA500",
                              }}
                            />
                            {/* Absent - Red */}
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${employee.attendance.absent}%`,
                                backgroundColor: "#DC2626",
                              }}
                            />
                            {/* Leave - Blue */}
                            <div
                              className="h-full transition-all"
                              style={{
                                width: `${employee.attendance.leave}%`,
                                backgroundColor: "#3B82F6",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </HRLayout>
  );
}
