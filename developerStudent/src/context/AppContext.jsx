import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { apiFunction } from '../api/apiFunction';
import { authApis, studentApis, projectApis, sessionApis, jobApis } from '../api/apis';
import {
  fetchStudentData,
  fetchJobs,
  fetchLiveProjects,
  fetchPracticeProjects,
  clearData
} from '../redux/getData';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const dispatch = useDispatch();

  // Load global data from Redux getData slice
  const { studentData, allJobsData, allProjectsData, allPracticeData } = useSelector(
    (state) => state.getData
  );

  // Authentication State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Hydrate user from token on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await apiFunction('auth/me', [], {}, 'GET', true);
          if (response.data.success) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Session hydration failed:', err);
          localStorage.removeItem('token');
        }
      }
      setAuthLoading(false);
    };
    initializeAuth();
  }, []);

  // Local UI State tabs
  const [activeProjectsTab, setActiveProjectsTab] = useState('live');
  const [activeJobsFilter, setActiveJobsFilter] = useState('all');
  const [availableSlots, setAvailableSlots] = useState([]);

  const fetchAvailableSlots = async () => {
    try {
      const response = await apiFunction(sessionApis.getSlots, [], {}, 'GET', true);
      if (response.data.success) {
        setAvailableSlots(response.data.slots || []);
      }
    } catch (err) {
      console.error('Fetch available slots error:', err);
    }
  };

  // Fetch all GET data if user session is active
  useEffect(() => {
    if (user && user.id) {
      dispatch(fetchStudentData());
      dispatch(fetchJobs());
      dispatch(fetchLiveProjects());
      dispatch(fetchPracticeProjects());
      fetchAvailableSlots();
    }
  }, [user, dispatch]);

  // walletPoints - Derived state
  const walletPoints = studentData?.walletPoints ?? 0;

  // sessions - Derived state
  const sessions = studentData?.sessions || [];

  // jobs - Derived state mapping match and applied statuses
  const jobs = useMemo(() => {
    if (!allJobsData) return [];
    const appliedList = studentData?.appliedJobs || [];
    return allJobsData.map((job) => ({
      ...job,
      status: appliedList.includes(job.id) ? 'Applied' : 'Available'
    }));
  }, [allJobsData, studentData]);

  // liveProjects - Derived state mapping student submodules overrides
  const liveProjects = useMemo(() => {
    if (!allProjectsData) return [];
    const studentLiveList = studentData?.liveProjects || [];
    return allProjectsData.map((project) => ({
      ...project,
      submodules: (project.submodules || []).map((submodule) => {
        const studentSub = studentLiveList.find((item) => item.id === submodule.id);
        if (studentSub) {
          return {
            ...submodule,
            status: studentSub.status,
            gitLink: studentSub.gitLink || ''
          };
        }
        return submodule;
      })
    }));
  }, [allProjectsData, studentData]);

  // practiceProjects - Derived state mapping student template completions
  const practiceProjects = useMemo(() => {
    if (!allPracticeData) return [];
    const studentPracList = studentData?.practiceProjects || [];
    return allPracticeData.map((project) => {
      const studentPrac = studentPracList.find((item) => item.id === project.id);
      if (studentPrac) {
        return {
          ...project,
          status: studentPrac.status,
          submittedGit: studentPrac.submittedGit || '',
          apkLink: studentPrac.apkLink || project.apkLink,
          performance: studentPrac.performance || null,
          reviewerFeedback: studentPrac.reviewerFeedback || ''
        };
      }
      return {
        ...project,
        status: 'Available',
        submittedGit: '',
        performance: null,
        reviewerFeedback: ''
      };
    });
  }, [allPracticeData, studentData]);

  // profileData - Derived state joining database details with local user info
  const profileData = useMemo(() => {
    const name = studentData?.name || user?.name || 'Developer Candidate';
    const email = studentData?.email || user?.email || 'candidate@codeelevate.in';
    const phone = studentData?.phone || '';
    const github = studentData?.github || '';
    const avatar = studentData?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
    const title = studentData?.title || 'Junior React Developer';
    const bio = studentData?.bio || 'Frontend React developer trainee at CodeElevate.';

    // Compile dynamic GitHub statistics
    const pracSubmissions = practiceProjects.filter(p => p.status === 'Submitted' || p.status === 'Graded');
    const liveSubmissions = liveProjects.flatMap(p => 
      p.submodules.filter(sub => sub.status === 'Submitted' || sub.status === 'Completed').map(sub => ({ ...sub, projectTitle: p.title }))
    );

    const totalSub = pracSubmissions.length + liveSubmissions.length;
    
    // Build recent commits dynamically from actual submissions
    const recentCommits = [];
    pracSubmissions.forEach(p => {
      recentCommits.push({
        id: `prac-${p.id}`,
        repo: p.title.toLowerCase().replace(/\s+/g, '-'),
        message: p.status === 'Graded' 
          ? `feat: complete audit and resolve reviewer feedback for ${p.title}`
          : `feat: submit solution repository for practice project ${p.title}`,
        date: p.status === 'Graded' ? 'Audited' : 'Submitted'
      });
    });

    liveSubmissions.forEach(s => {
      recentCommits.push({
        id: `live-${s.id}`,
        repo: s.projectTitle.toLowerCase().replace(/\s+/g, '-'),
        message: s.status === 'Completed'
          ? `refactor: merge submodule ${s.title} into production`
          : `refactor: submit branch ${s.branch || 'main'} pull request for ${s.title}`,
        date: s.status === 'Completed' ? 'Merged' : 'Submitted'
      });
    });

    // Take top 3 most recent commits
    const activeRecentCommits = recentCommits.slice(-3).reverse();

    // Map letter grades to numerical scores for dynamic skill calculations
    const GRADE_TO_SCORE = {
      'A+': 98, 'A': 92, 'B+': 85, 'B': 78, 'C': 70, 'F': 40
    };

    const gradedPracs = practiceProjects.filter(p => p.status === 'Graded' && p.performance);
    
    let avgQuality = 0;
    let avgSecurity = 0;
    let avgPerformance = 0;
    let avgUiUx = 0;

    if (gradedPracs.length > 0) {
      const qSum = gradedPracs.reduce((acc, p) => acc + (GRADE_TO_SCORE[p.performance.codeQuality] || 75), 0);
      const sSum = gradedPracs.reduce((acc, p) => acc + (GRADE_TO_SCORE[p.performance.security] || 75), 0);
      const pSum = gradedPracs.reduce((acc, p) => acc + (GRADE_TO_SCORE[p.performance.performance] || 75), 0);
      const uSum = gradedPracs.reduce((acc, p) => acc + (GRADE_TO_SCORE[p.performance.uiux] || 75), 0);

      avgQuality = Math.round(qSum / gradedPracs.length);
      avgSecurity = Math.round(sSum / gradedPracs.length);
      avgPerformance = Math.round(pSum / gradedPracs.length);
      avgUiUx = Math.round(uSum / gradedPracs.length);
    }

    // Dynamic Skill Ratings
    const completedLiveCount = liveSubmissions.filter(s => s.status === 'Completed').length;
    const baseSkills = studentData?.skills || [
      { name: "Frontend (React/HTML/CSS)", level: 70 },
      { name: "Backend (Node.js/Express)", level: 50 },
      { name: "UI/UX Design Accuracy", level: 75 },
      { name: "Problem Solving & Git", level: 60 },
      { name: "Timeliness & Commits", level: 60 }
    ];

    const dynamicSkills = baseSkills.map(skill => {
      if (gradedPracs.length > 0) {
        if (skill.name.includes("Frontend")) {
          return { ...skill, level: Math.round((avgUiUx + avgQuality) / 2) };
        }
        if (skill.name.includes("Backend")) {
          return { ...skill, level: Math.round((avgSecurity + avgQuality) / 2) };
        }
        if (skill.name.includes("UI/UX")) {
          return { ...skill, level: avgUiUx };
        }
        if (skill.name.includes("Problem Solving")) {
          return { ...skill, level: Math.round((avgSecurity + avgPerformance) / 2) };
        }
      }
      if (skill.name.includes("Timeliness")) {
        return { ...skill, level: Math.min(98, 60 + (completedLiveCount * 8) + (gradedPracs.length * 4)) };
      }
      return skill;
    });

    return {
      name,
      email,
      phone,
      github,
      avatar,
      title,
      bio,
      referralCode: studentData?.referralCode || user?.referralCode || '',
      skills: dynamicSkills,
      githubStats: {
        commitsThisMonth: totalSub > 0 ? (totalSub * 12) + 5 : 0,
        mergedPRs: completedLiveCount,
        streakDays: totalSub > 0 ? (totalSub * 3) % 8 + 1 : 0,
        recentCommits: activeRecentCommits
      },
      isHrVerified: studentData?.isHrVerified === 1,
      verifiedProgress: studentData?.verifiedProgress || 20,
      resumeUrl: studentData?.resumeUrl || null,
      createdAt: studentData?.createdAt || null
    };
  }, [studentData, user, practiceProjects, liveProjects]);

  // Action mutations (using apiFunction)

  const login = async (emailOrPhone, password, type) => {
    try {
      const response = await apiFunction(authApis.login, [], { emailOrPhone, password }, 'POST', false);
      if (response.data.success) {
        const loggedInUser = response.data.user;
        setUser(loggedInUser);
        
        localStorage.setItem('token', response.data.token);
        return { success: true };
      } else {
        throw new Error(response.data.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    dispatch(clearData());
  };

  const submitLiveCode = async (submoduleId, gitLink) => {
    if (!studentData) return;
    try {
      await apiFunction(projectApis.submitLive, [], { submoduleId, gitLink }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Submit live code error:', err);
    }
  };

  const simulateLiveApproval = async (submoduleId) => {
    if (!studentData) return;
    try {
      await apiFunction(projectApis.approveLive, [], { submoduleId }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Approve live submodule error:', err);
    }
  };

  const requestApk = async (projectId) => {
    if (!studentData) return;
    try {
      await apiFunction(projectApis.requestApk, [], { projectId }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Request APK error:', err);
    }
  };

  const submitPracticeGit = async (projectId, repoUrl) => {
    if (!studentData) return;
    try {
      await apiFunction(projectApis.submitPractice, [], { projectId, submittedGit: repoUrl }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Submit practice git error:', err);
    }
  };

  const bookSession = async (type, date, timeSlot) => {
    if (!studentData) return;
    try {
      await apiFunction(sessionApis.bookSession, [], { type, date, timeSlot }, 'POST', true);
      dispatch(fetchStudentData());
      fetchAvailableSlots();
    } catch (err) {
      console.error('Book session error:', err);
    }
  };

  const applyToJob = async (jobId) => {
    if (!studentData) return;
    try {
      await apiFunction(jobApis.applyJob, [], { jobId }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Apply to job error:', err);
    }
  };

  const updateProfile = async (updatedFields) => {
    if (!user) return;
    try {
      await apiFunction(studentApis.updateProfile, [], updatedFields, 'PUT', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Update profile error:', err);
    }
  };

  const updateResume = async (resumeUrl) => {
    if (!studentData) return;
    try {
      await apiFunction(studentApis.updateResume, [], { resumeUrl }, 'POST', true);
      dispatch(fetchStudentData());
    } catch (err) {
      console.error('Update resume error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-dark-bg text-gray-300">
        <div className="text-xl font-medium animate-pulse">Initializing...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider
      value={{
        user,
        walletPoints,
        liveProjects,
        practiceProjects,
        sessions,
        jobs,
        profileData,
        availableSlots,
        fetchAvailableSlots,
        login,
        logout,
        submitLiveCode,
        simulateLiveApproval,
        requestApk,
        submitPracticeGit,
        bookSession,
        applyToJob,
        updateProfile,
        updateResume,
        activeProjectsTab,
        setActiveProjectsTab,
        activeJobsFilter,
        setActiveJobsFilter
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
