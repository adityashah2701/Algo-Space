// components/AvailabilityManagement.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock, Plus, CalendarIcon, RefreshCw } from "lucide-react";

const AvailabilityManagement = () => {
  // Mock data for available time slots
  const timeSlots = [
    { id: 1, day: "Monday", time: "9:00 AM - 11:00 AM", isRecurring: true },
    { id: 2, day: "Monday", time: "2:00 PM - 4:00 PM", isRecurring: true },
    { id: 3, day: "Wednesday", time: "10:00 AM - 12:00 PM", isRecurring: true },
    { id: 4, day: "Friday", time: "1:00 PM - 3:00 PM", isRecurring: true }
  ];
  
  // Mock data for blocked dates
  const blockedDates = [
    { id: 1, date: "2025-03-25", reason: "Conference" },
    { id: 2, date: "2025-03-26", reason: "Conference" },
    { id: 3, date: "2025-04-10", reason: "Personal" }
  ];
  
  // Mock data for external calendars
  const externalCalendars = [
    { id: 1, name: "Google Calendar", isConnected: true, lastSync: "10 mins ago" },
    { id: 2, name: "Outlook Calendar", isConnected: false, lastSync: "Never" }
  ];
  
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-3xl font-bold">Availability Management</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="recurring">
            <TabsList>
              <TabsTrigger value="recurring">Recurring Slots</TabsTrigger>
              <TabsTrigger value="blocked">Blocked Dates</TabsTrigger>
              <TabsTrigger value="external">External Calendars</TabsTrigger>
            </TabsList>
            
            <TabsContent value="recurring" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Weekly Availability</span>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Add Slot
                    </Button>
                  </CardTitle>
                  <CardDescription>Set your recurring availability for interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {timeSlots.map(slot => (
                    <Card key={slot.id} className="mb-3">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{slot.day}</h4>
                              <p className="text-sm text-muted-foreground">{slot.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center space-x-2">
                              <Switch id={`recurring-${slot.id}`} checked={slot.isRecurring} />
                              <Label htmlFor={`recurring-${slot.id}`}>Recurring</Label>
                            </div>
                            <Button size="sm" variant="ghost">Edit</Button>
                            <Button size="sm" variant="ghost">Delete</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="blocked" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Blocked Dates</span>
                    <Button size="sm" className="gap-1">
                      <Plus className="h-4 w-4" />
                      Block Date
                    </Button>
                  </CardTitle>
                  <CardDescription>Dates when you're unavailable for interviews</CardDescription>
                </CardHeader>
                <CardContent>
                  {blockedDates.map(date => (
                    <Card key={date.id} className="mb-3">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <h4 className="font-medium">{date.date}</h4>
                              <p className="text-sm text-muted-foreground">Reason: {date.reason}</p>
                            </div>
                          </div>
                          <div>
                            <Button size="sm" variant="ghost">Delete</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="external" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>External Calendars</CardTitle>
                  <CardDescription>Sync with your existing calendars</CardDescription>
                </CardHeader>
                <CardContent>
                  {externalCalendars.map(calendar => (
                    <Card key={calendar.id} className="mb-3">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{calendar.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {calendar.isConnected 
                                ? `Last synced: ${calendar.lastSync}` 
                                : "Not connected"}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {calendar.isConnected ? (
                              <>
                                <Button size="sm" variant="outline" className="gap-1">
                                  <RefreshCw className="h-4 w-4" />
                                  Sync Now
                                </Button>
                                <Button size="sm" variant="outline">Disconnect</Button>
                              </>
                            ) : (
                              <Button size="sm">Connect</Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Calendar View</CardTitle>
            <CardDescription>Your availability at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar 
              mode="single" 
              className="rounded-md border" 
            />
            
            <div>
              <h4 className="font-medium mb-2">Legend</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 rounded"></div>
                  <span>Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span>Scheduled Interview</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Label htmlFor="interview-duration">Default Interview Duration</Label>
              <Select defaultValue="60">
                <SelectTrigger id="interview-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="90">1.5 hours</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch id="buffer-time" />
              <Label htmlFor="buffer-time">Add 15 min buffer between interviews</Label>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Save Preferences</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AvailabilityManagement;