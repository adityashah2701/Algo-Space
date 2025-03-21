// components/InterviewSchedule.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";

const InterviewSchedule = () => {
  // Mock data
  const upcomingInterviews = [
    { id: 1, name: "Alice Smith", position: "Frontend Developer", date: "Today, 2:00 PM", duration: "1 hour" },
    { id: 2, name: "Bob Johnson", position: "Backend Engineer", date: "Tomorrow, 11:00 AM", duration: "45 min" },
    { id: 3, name: "Carol Williams", position: "Full Stack Developer", date: "Mar 23, 3:30 PM", duration: "1 hour" }
  ];
  
  const pendingRequests = [
    { id: 4, name: "David Brown", position: "DevOps Engineer", date: "Mar 25, 10:00 AM", duration: "1 hour" },
    { id: 5, name: "Eve Davis", position: "UI/UX Designer", date: "Mar 26, 2:00 PM", duration: "45 min" }
  ];
  
  const pastInterviews = [
    { id: 6, name: "Frank Miller", position: "Product Manager", date: "Mar 15, 1:00 PM", duration: "1 hour", feedback: "Strong candidate, advancing to next round" },
    { id: 7, name: "Grace Taylor", position: "Data Scientist", date: "Mar 10, 11:30 AM", duration: "1 hour", feedback: "Technical skills need improvement" }
  ];
  
  const InterviewCard = ({ interview, isPast = false }) => (
    <Card className="mb-3">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={`/api/placeholder/${40 + interview.id}/${40 + interview.id}`} alt={interview.name} />
              <AvatarFallback>{interview.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{interview.name}</h4>
              <p className="text-sm text-muted-foreground">{interview.position}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline">{interview.date}</Badge>
                <Badge variant="outline">{interview.duration}</Badge>
              </div>
              {isPast && interview.feedback && (
                <p className="text-sm mt-2 italic">"{interview.feedback}"</p>
              )}
            </div>
          </div>
          <div>
            {!isPast && (
              <div className="space-y-2">
                <Button size="sm" className="w-full">View Details</Button>
                {interview.id > 3 && (
                  <>
                    <Button size="sm" variant="outline" className="w-full">Accept</Button>
                    <Button size="sm" variant="outline" className="w-full">Decline</Button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
  
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-3xl font-bold">Interview Schedule</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingInterviews.length})</TabsTrigger>
              <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upcoming" className="mt-4">
              {upcomingInterviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </TabsContent>
            
            <TabsContent value="pending" className="mt-4">
              {pendingRequests.map(interview => (
                <InterviewCard key={interview.id} interview={interview} />
              ))}
            </TabsContent>
            
            <TabsContent value="past" className="mt-4">
              {pastInterviews.map(interview => (
                <InterviewCard key={interview.id} interview={interview} isPast={true} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Schedule at a Glance</CardTitle>
            <CardDescription>Your interview calendar</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" className="rounded-md border" />
            <div className="mt-4">
              <h4 className="font-medium mb-2">Today's Schedule</h4>
              <div className="space-y-2">
                <div className="bg-muted p-2 rounded flex justify-between">
                  <span>Alice Smith</span>
                  <span>2:00 PM</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InterviewSchedule;