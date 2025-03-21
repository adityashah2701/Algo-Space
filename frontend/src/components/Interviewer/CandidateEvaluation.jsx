// components/CandidateEvaluation.jsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Star } from "lucide-react";

const CandidateEvaluation = () => {
  // Mock candidates data
  const candidates = [
    { 
      id: 1, 
      name: "Alex Morgan", 
      role: "Senior Frontend Developer", 
      experience: "8 years",
      skills: ["React", "TypeScript", "GraphQL"],
      ratings: { technical: 4.5, communication: 4.0, problemSolving: 4.8 }
    },
    { 
      id: 2, 
      name: "Jamie Chen", 
      role: "Backend Engineer", 
      experience: "5 years",
      skills: ["Node.js", "Python", "MongoDB"],
      ratings: { technical: 4.2, communication: 3.8, problemSolving: 4.0 }
    },
    { 
      id: 3, 
      name: "Taylor Wilson", 
      role: "Full Stack Developer", 
      experience: "6 years",
      skills: ["JavaScript", "React", "Express", "SQL"],
      ratings: { technical: 4.0, communication: 4.5, problemSolving: 3.9 }
    }
  ];
  
  const CandidateCard = ({ candidate }) => {
    const averageRating = (
      Object.values(candidate.ratings).reduce((sum, val) => sum + val, 0) / 
      Object.values(candidate.ratings).length
    ).toFixed(1);
    
    return (
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={`/api/placeholder/${40 + candidate.id}/${40 + candidate.id}`} alt={candidate.name} />
                <AvatarFallback>{candidate.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.role}</p>
                <p className="text-sm">Experience: {candidate.experience}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {candidate.skills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-xs">{skill}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{averageRating}</span>
              </div>
              <Button size="sm" className="mt-2">View Profile</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6 py-4">
      <h2 className="text-3xl font-bold">Candidate Evaluation</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Candidate Search</CardTitle>
              <CardDescription>Find candidates by skills, experience, or role</CardDescription>
              <div className="flex gap-2 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search candidates..." className="pl-8" />
                </div>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">All Candidates</TabsTrigger>
                  <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                  <TabsTrigger value="pending">Pending Review</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-4">
                  {candidates.map(candidate => (
                    <CandidateCard key={candidate.id} candidate={candidate} />
                  ))}
                </TabsContent>
                <TabsContent value="reviewed" className="mt-4">
                  <p className="text-muted-foreground">Candidates you've already reviewed will appear here.</p>
                </TabsContent>
                <TabsContent value="pending" className="mt-4">
                  <p className="text-muted-foreground">Candidates awaiting your review will appear here.</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Feedback Form</CardTitle>
            <CardDescription>Evaluate a candidate after an interview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="candidate">Candidate</Label>
              <Select>
                <SelectTrigger id="candidate">
                  <SelectValue placeholder="Select candidate" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map(candidate => (
                    <SelectItem key={candidate.id} value={candidate.id.toString()}>
                      {candidate.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Technical Skills</Label>
              <Slider defaultValue={[3]} max={5} step={0.1} />
              <div className="flex justify-between text-xs">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Communication</Label>
              <Slider defaultValue={[3]} max={5} step={0.1} />
              <div className="flex justify-between text-xs">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Problem Solving</Label>
              <Slider defaultValue={[3]} max={5} step={0.1} />
              <div className="flex justify-between text-xs">
                <span>Poor</span>
                <span>Excellent</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Interview Notes</Label>
              <Textarea id="notes" placeholder="Add your feedback here..." />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="decision">Decision</Label>
              <Select>
                <SelectTrigger id="decision">
                  <SelectValue placeholder="Select decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="advance">Advance to Next Round</SelectItem>
                  <SelectItem value="reject">Reject</SelectItem>
                  <SelectItem value="onhold">Keep on Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button className="w-full">Submit Feedback</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CandidateEvaluation;