import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const recentActivities = [
  {
    id: 1,
    user: "John Doe",
    action: "Created new product",
    item: "Wireless Headphones",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Updated category",
    item: "Electronics",
    time: "5 minutes ago",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Processed order",
    item: "#ORD-001",
    time: "10 minutes ago",
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "Added new user",
    item: "customer@example.com",
    time: "15 minutes ago",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions in your admin panel</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentActivities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {activity.user
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {activity.user} {activity.action}
              </p>
              <p className="text-sm text-muted-foreground">{activity.item}</p>
            </div>
            <div className="text-xs text-muted-foreground">{activity.time}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
