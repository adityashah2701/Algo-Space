import React, { useState, useEffect } from 'react';
import { Search, Filter, Briefcase, Building, Clock, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { axiosInstance } from '@/lib/axios';

const FindJobs = () => {
  // User profile data (in a real app, this would come from context or redux)
  const userProfile = {
    userId: "67dd43b2b9a084e294ac03f7",
    resumeUrl: "https://example.com/resume.pdf",
    skills: ["JavaScript", "Python", "Go"],
    experience: 3,
    githubUsername: "johnDoeDev",
    leetcodeUsername: "johnDoeLeet",
    codeforcesUsername: "johnDoeCF",
    codechefUsername: "johnDoeCC",
    preferredRoles: ["Full Stack Developer", "Backend Developer"]
  };

  // State variables
  const [searchTerm, setSearchTerm] = useState('');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    companies: [],
    jobTitles: [],
  });
  const [activeFilters, setActiveFilters] = useState([]);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [sortOption, setSortOption] = useState('companyName');
  
  // Load jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/job/get-all-jobs');
        setJobs(response.data.jobs);
        setFilteredJobs(response.data.jobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  // Extract unique companies and job titles for filters
  const uniqueCompanies = [...new Set(jobs.map(job => job.companyName))];
  
  const allJobTitles = jobs.flatMap(job => 
    job.jobs.map(j => j.title)
  );
  const uniqueJobTitles = [...new Set(allJobTitles)];

  // Apply filters and search
  useEffect(() => {
    if (jobs.length === 0) return;

    let results = [...jobs];

    // Apply search term
    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      results = results.filter(job => 
        job.companyName.toLowerCase().includes(lowercaseSearch) ||
        job.jobs.some(j => j.title.toLowerCase().includes(lowercaseSearch))
      );
    }

    // Apply company filters
    if (filters.companies.length > 0) {
      results = results.filter(job => filters.companies.includes(job.companyName));
    }

    // Apply job title filters
    if (filters.jobTitles.length > 0) {
      results = results.filter(job => 
        job.jobs.some(j => filters.jobTitles.includes(j.title))
      );
    }

    // Sort results
    if (sortOption === 'companyName') {
      results = results.sort((a, b) => a.companyName.localeCompare(b.companyName));
    } else if (sortOption === 'recent') {
      results = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredJobs(results);
  }, [jobs, searchTerm, filters, sortOption]);

  // Update active filters
  useEffect(() => {
    const newActiveFilters = [];
    
    if (filters.companies.length > 0) {
      filters.companies.forEach(company => newActiveFilters.push(`Company: ${company}`));
    }
    
    if (filters.jobTitles.length > 0) {
      filters.jobTitles.forEach(title => newActiveFilters.push(`Job: ${title}`));
    }
    
    setActiveFilters(newActiveFilters);
  }, [filters]);

  // Handle filter changes
  const toggleCompanyFilter = (company) => {
    if (filters.companies.includes(company)) {
      setFilters({
        ...filters,
        companies: filters.companies.filter(c => c !== company)
      });
    } else {
      setFilters({
        ...filters,
        companies: [...filters.companies, company]
      });
    }
  };

  const toggleJobTitleFilter = (title) => {
    if (filters.jobTitles.includes(title)) {
      setFilters({
        ...filters,
        jobTitles: filters.jobTitles.filter(t => t !== title)
      });
    } else {
      setFilters({
        ...filters,
        jobTitles: [...filters.jobTitles, title]
      });
    }
  };

  const removeFilter = (filter) => {
    const [type, value] = filter.split(': ');
    
    if (type === 'Company') {
      setFilters({
        ...filters,
        companies: filters.companies.filter(c => c !== value)
      });
    } else if (type === 'Job') {
      setFilters({
        ...filters,
        jobTitles: filters.jobTitles.filter(t => t !== value)
      });
    }
  };

  const clearAllFilters = () => {
    setFilters({
      companies: [],
      jobTitles: [],
    });
    setSearchTerm('');
  };

  // Apply user interest filters based on preferred roles
  const applyUserInterests = () => {
    // Set job title filters based on user's preferred roles
    const matchingJobTitles = uniqueJobTitles.filter(title => 
      userProfile.preferredRoles.some(role => 
        title.toLowerCase().includes(role.toLowerCase())
      )
    );
    
    setFilters({
      ...filters,
      jobTitles: matchingJobTitles
    });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <header className="flex flex-col gap-4">
            <h1 className="text-3xl font-bold">Find Jobs</h1>
            <p>
              Discover opportunities that match your skills and interests
            </p>
          </header>

          {/* Search and user interests */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="relative md:col-span-8">
              <Search className="absolute left-3 top-3 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by company or job title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 py-6"
              />
            </div>
            <div className="md:col-span-4">
              <Button
                onClick={applyUserInterests}
                variant="outline"
                className="w-full py-6"
              >
                Apply My Preferred Roles
              </Button>
            </div>
          </div>

          {/* Active filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                  <span>{filter}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 w-5 p-0 rounded-full"
                    onClick={() => removeFilter(filter)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-sm"
                onClick={clearAllFilters}
              >
                Clear all
              </Button>
            </div>
          )}

          {/* Content area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Filters sidebar */}
            <div className="lg:col-span-3">
              <div className="rounded-lg shadow-sm border p-5">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h2>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => setFiltersExpanded(!filtersExpanded)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${filtersExpanded ? 'transform rotate-180' : ''}`} />
                  </Button>
                </div>
                
                {filtersExpanded && (
                  <div className="space-y-6">
                    {/* Company filters */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Companies</h3>
                      <div className="space-y-2">
                        {uniqueCompanies.map((company) => (
                          <div key={company} className="flex items-center space-x-2">
                            <Checkbox
                              id={`company-${company}`}
                              checked={filters.companies.includes(company)}
                              onCheckedChange={() => toggleCompanyFilter(company)}
                            />
                            <label
                              htmlFor={`company-${company}`}
                              className="text-sm leading-none cursor-pointer"
                            >
                              {company}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Job title filters */}
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium">Job Titles</h3>
                      <div className="space-y-2">
                        {uniqueJobTitles.map((title) => (
                          <div key={title} className="flex items-center space-x-2">
                            <Checkbox
                              id={`title-${title}`}
                              checked={filters.jobTitles.includes(title)}
                              onCheckedChange={() => toggleJobTitleFilter(title)}
                            />
                            <label
                              htmlFor={`title-${title}`}
                              className="text-sm leading-none cursor-pointer"
                            >
                              {title}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Job listings */}
            <div className="lg:col-span-9">
              <div className="rounded-lg shadow-sm border p-5">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-lg font-semibold">
                      {filteredJobs.length} {filteredJobs.length === 1 ? 'Company' : 'Companies'} Found
                    </h2>
                    {searchTerm && (
                      <p className="text-sm">
                        Search results for: "{searchTerm}"
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Sort by:</span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          {sortOption === 'companyName' ? 'Company Name' : 'Most Recent'}
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortOption('companyName')}>
                          Company Name
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortOption('recent')}>
                          Most Recent
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {loading ? (
                  <div className="py-12 text-center">
                    <p>Loading jobs...</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="py-12 text-center">
                    <p>No jobs found. Try adjusting your filters.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={clearAllFilters}
                    >
                      Clear all filters
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="space-y-4 pr-4">
                      {filteredJobs.map((job) => (
                        <CompanyJobCard key={job._id} job={job} />
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Company job card component
const CompanyJobCard =   ({ job }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    const handleApply = async () => {
        try {
            const res =  await axiosInstance.put("/candidate/apply" ,{jobId : job._id})
            toast.success(res.data.message)
            console.log(res.data)
            
        } catch (error) {
            console.error('Error applying for job:', error);
            toast('Already Enrolled for this job !');
        }
    }
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Building className="h-5 w-5" />
          {job.companyName}
        </CardTitle>
        <div className="flex items-center text-xs">
          <Clock className="h-3 w-3 mr-1" />
          <span>Posted on {new Date(job.createdAt).toLocaleDateString()}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Available Positions:</h3>
            <div className="flex flex-wrap gap-2">
              {job.jobs.map((position) => (
                <Badge key={position._id} variant="outline" className="py-1.5">
                  <Briefcase className="h-3 w-3 mr-1" />
                  {position.title}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleApply}>
              {job.candidateApplied && job.candidateApplied.candidateId === user._id ? "Applied" : "Apply"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FindJobs;