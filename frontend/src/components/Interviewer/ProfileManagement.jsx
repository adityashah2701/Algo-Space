// components/ProfileManagement.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlusCircle, X } from "lucide-react";

const ProfileManagement = () => {
  const expertiseAreas = ["JavaScript", "React", "Node.js", "System Design", "Algorithms"];
  
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-3xl font-bold">Profile Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Details</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="john.doe@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" defaultValue="Tech Innovations Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" defaultValue="Senior Software Engineer" />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <Label>Expertise Areas</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {expertiseAreas.map((area) => (
                  <Badge key={area} className="flex items-center gap-1">
                    {area}
                    <X className="h-3 w-3 cursor-pointer" />
                  </Badge>
                ))}
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <PlusCircle className="h-3 w-3" />
                  Add Expertise
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button>Save Changes</Button>
          </CardFooter>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src="/api/placeholder/128/128" alt="Profile Picture" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Button variant="outline">Upload New Picture</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileManagement;