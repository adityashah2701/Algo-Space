// App.jsx - Main Component
import AvailabilityManagement from '@/components/Interviewer/AvailabilityManagement';
import CandidateEvaluation from '@/components/Interviewer/CandidateEvaluation';
import Header from '@/components/Interviewer/Header';
import InterviewSchedule from '@/components/Interviewer/InterviewSchedule';
import ProfileManagement from '@/components/Interviewer/ProfileManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeProvider } from '@/context/ThemeProvider';
import React from 'react';


const InterviewerDashboard = () => {
  return (
    <ThemeProvider defaultTheme="light" storageKey="interviewer-theme">
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto py-4 px-4">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="candidates">Candidates</TabsTrigger>
              <TabsTrigger value="availability">Availability</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              <ProfileManagement />
            </TabsContent>
            <TabsContent value="schedule">
              <InterviewSchedule />
            </TabsContent>
            <TabsContent value="candidates">
              <CandidateEvaluation />
            </TabsContent>
            <TabsContent value="availability">
              <AvailabilityManagement />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default InterviewerDashboard;