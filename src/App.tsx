import React, { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Logo } from "./components/Logo";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Checkbox } from "./components/ui/checkbox";
import { Slider } from "./components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import { Label } from "./components/ui/label";
import {
  Search,
  Bell,
  Sun,
  Moon,
  Home,
  BookOpen,
  Calendar,
  PenTool,
  Trophy,
  BarChart3,
  Settings,
  HelpCircle,
  Heart,
  Stethoscope,
  Brain,
  Activity,
  ChevronLeft,
  ChevronRight,
  Play,
  CheckCircle,
  Clock,
  Target,
  Flame,
  ArrowRight,
  Filter,
  Bot,
  FileText,
  School,
  Menu,
  X,
  RotateCcw,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  BookMarked,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronUp,
  Download,
  ExternalLink,
  LogOut,
  User,
  Settings,
} from "lucide-react";

import { SimpleLoginPage } from "./components/SimpleLoginPage";
import { OrganizePage } from "./components/OrganizePage";

// Types
type Page =
  | "home"
  | "learn"
  | "practice"
  | "organize"
  | "calendar"
  | "write"
  | "achievements"
  | "stats"
  | "settings"
  | "help"
  | "flashcards"
  | "quiz"
  | "cases"
  | "pathology";

type Theme = "light" | "dark";

interface Notification {
  id: number;
  text: string;
  time: string;
  read: boolean;
}

interface User {
  name: string;
  email: string;
  specialty: string;
  year: string;
  avatar: string;
}

// Data
const sampleNotifications: Notification[] = [
  {
    id: 1,
    text: "New quiz available: Cardiology Advanced",
    time: "2 min ago",
    read: false,
  },
  {
    id: 2,
    text: "You've completed 7-day streak!",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    text: "Study group meeting tomorrow at 3PM",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    text: "New cases added to your specialty",
    time: "1 day ago",
    read: true,
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [theme, setTheme] = useState<Theme>("light");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [learnExpanded, setLearnExpanded] = useState(false);
  const [trainExpanded, setTrainExpanded] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user] = useState<User>({
    name: "Dr. Sarah Johnson",
    email: "sarah.johnson@medical.edu",
    specialty: "Internal Medicine",
    year: "3rd Year Resident",
    avatar: "SJ",
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const renderOrganize = () => <OrganizePage />;

  const renderContent = () => {
    switch (currentPage) {
      case "home":
        return renderHome();
      case "organize":
        return renderOrganize();
      case "learn":
        return renderLearn();
      case "flashcards":
        return renderFlashcards();
      case "quiz":
        return renderQuiz();
      case "cases":
        return renderCases();
      case "pathology":
        return renderPathology();
      case "calendar":
        return renderCalendar();
      case "write":
        return renderWrite();
      case "achievements":
        return renderAchievements();
      case "stats":
        return renderStats();
      case "settings":
        return renderSettings();
      case "help":
        return renderHelp();
      default:
        return renderHome();
    }
  };

  if (!isLoggedIn) {
    return <SimpleLoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  const renderHome = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Good morning, {user.name.split(" ")[1]} 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You have 3 pending reviews and 1 new case today
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Flame className="h-3 w-3 text-orange-500" />
            12 day streak
          </Badge>
          <Badge variant="outline">Level 8</Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: CheckCircle,
            label: "Completed Today",
            value: "24",
            color: "text-green-500",
          },
          {
            icon: Clock,
            label: "Study Time",
            value: "2h 15m",
            color: "text-blue-500",
          },
          {
            icon: Target,
            label: "Accuracy",
            value: "87%",
            color: "text-purple-500",
          },
          {
            icon: Trophy,
            label: "XP Today",
            value: "340",
            color: "text-yellow-500",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Continue Learning</h2>
          <div className="space-y-3">
            {[
              {
                title: "Cardiovascular Pathophysiology",
                progress: 68,
                topic: "Heart Failure",
                time: "45 min left",
                icon: Heart,
                color: "text-red-500",
              },
              {
                title: "Renal System",
                progress: 34,
                topic: "CKD Management",
                time: "2h left",
                icon: Activity,
                color: "text-blue-500",
              },
              {
                title: "Neurology Fundamentals",
                progress: 85,
                topic: "Stroke Assessment",
                time: "20 min left",
                icon: Brain,
                color: "text-purple-500",
              },
            ].map((course) => (
              <Card
                key={course.title}
                className="hover:shadow-md transition-shadow cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-secondary rounded-lg">
                        <course.icon
                          className={`h-5 w-5 ${course.color}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">
                          {course.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {course.topic}
                        </p>
                        <div className="mt-2 space-y-1">
                          <Progress
                            value={course.progress}
                            className="h-1.5"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{course.progress}% complete</span>
                            <span>{course.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          {/* Daily Goal */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Daily Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-3">
                <div className="text-3xl font-bold">68%</div>
                <div className="text-xs text-muted-foreground">
                  340 / 500 XP
                </div>
              </div>
              <Progress value={68} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2 text-center">
                160 XP to reach your daily goal
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                {
                  label: "Random Quiz",
                  icon: RotateCcw,
                  page: "quiz" as Page,
                },
                {
                  label: "New Flashcard",
                  icon: Plus,
                  page: "flashcards" as Page,
                },
                {
                  label: "Clinical Case",
                  icon: Stethoscope,
                  page: "cases" as Page,
                },
              ].map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="w-full justify-start gap-2"
                  size="sm"
                  onClick={() => setCurrentPage(action.page)}
                >
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Upcoming</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { time: "3:00 PM", event: "Study Group", type: "group" },
                { time: "5:00 PM", event: "ECG Review", type: "review" },
                { time: "Tomorrow", event: "Mock Exam", type: "exam" },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline" className="text-xs whitespace-nowrap">
                    {event.time}
                  </Badge>
                  <span className="text-muted-foreground truncate">
                    {event.event}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderLearn = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Learn</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Topics</TabsTrigger>
          <TabsTrigger value="progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="saved">Saved</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: "Cardiology",
                icon: Heart,
                color: "text-red-500",
                bg: "bg-red-50 dark:bg-red-950",
                topics: 24,
                progress: 68,
              },
              {
                title: "Neurology",
                icon: Brain,
                color: "text-purple-500",
                bg: "bg-purple-50 dark:bg-purple-950",
                topics: 18,
                progress: 45,
              },
              {
                title: "Internal Medicine",
                icon: Stethoscope,
                color: "text-blue-500",
                bg: "bg-blue-50 dark:bg-blue-950",
                topics: 32,
                progress: 23,
              },
              {
                title: "Pathology",
                icon: Activity,
                color: "text-orange-500",
                bg: "bg-orange-50 dark:bg-orange-950",
                topics: 28,
                progress: 12,
              },
              {
                title: "Pharmacology",
                icon: FileText,
                color: "text-green-500",
                bg: "bg-green-50 dark:bg-green-950",
                topics: 20,
                progress: 56,
              },
              {
                title: "Anatomy",
                icon: School,
                color: "text-teal-500",
                bg: "bg-teal-50 dark:bg-teal-950",
                topics: 15,
                progress: 78,
              },
            ].map((subject) => (
              <Card
                key={subject.title}
                className="hover:shadow-md transition-all cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${subject.bg} flex items-center justify-center mb-3`}
                  >
                    <subject.icon className={`h-6 w-6 ${subject.color}`} />
                  </div>
                  <h3 className="font-semibold mb-1">{subject.title}</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    {subject.topics} topics
                  </p>
                  <Progress value={subject.progress} className="h-1.5" />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-muted-foreground">
                      {subject.progress}%
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Continue <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="progress">
          <div className="text-center py-8 text-muted-foreground">
            Courses in progress will appear here
          </div>
        </TabsContent>
        <TabsContent value="completed">
          <div className="text-center py-8 text-muted-foreground">
            Completed courses will appear here
          </div>
        </TabsContent>
        <TabsContent value="saved">
          <div className="text-center py-8 text-muted-foreground">
            Saved content will appear here
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderFlashcards = () => {
    const [currentCard, setCurrentCard] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [studyMode, setStudyMode] = useState<"browse" | "study">("browse");

    const cards = [
      {
        front: "What is the first-line treatment for heart failure with reduced ejection fraction?",
        back: "ACE inhibitors (or ARBs), beta-blockers, and diuretics. SGLT2 inhibitors are now also recommended.",
        difficulty: "medium",
        tags: ["Cardiology", "HFrEF"],
      },
      {
        front: "Define the Frank-Starling mechanism",
        back: "The heart's ability to increase stroke volume in response to increased venous return. Greater preload = greater contraction force.",
        difficulty: "hard",
        tags: ["Cardiology", "Physiology"],
      },
      {
        front: "What are the signs of increased ICP?",
        back: "Cushing's triad: hypertension, bradycardia, irregular respirations. Also: headache, vomiting, papilledema.",
        difficulty: "medium",
        tags: ["Neurology", "Emergency"],
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-2xl md:text-3xl font-bold">Flashcards</h1>
          <div className="flex gap-2">
            <Button
              variant={studyMode === "browse" ? "default" : "outline"}
              size="sm"
              onClick={() => setStudyMode("browse")}
            >
              Browse
            </Button>
            <Button
              variant={studyMode === "study" ? "default" : "outline"}
              size="sm"
              onClick={() => setStudyMode("study")}
            >
              Study Mode
            </Button>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              New Card
            </Button>
          </div>
        </div>

        {studyMode === "study" ? (
          <div className="max-w-2xl mx-auto">
            <div
              className="relative h-64 cursor-pointer perspective-1000"
              onClick={() => setFlipped(!flipped)}
            >
              <Card className="w-full h-full flex items-center justify-center hover:shadow-lg transition-shadow">
                <CardContent className="text-center p-8">
                  {!flipped ? (
                    <>
                      <Badge variant="outline" className="mb-4">
                        {cards[currentCard].tags.join(" • ")}
                      </Badge>
                      <p className="text-lg font-medium">
                        {cards[currentCard].front}
                      </p>
                      <p className="text-xs text-muted-foreground mt-4">
                        Click to reveal answer
                      </p>
                    </>
                  ) : (
                    <>
                      <Badge className="mb-4">Answer</Badge>
                      <p className="text-base">{cards[currentCard].back}</p>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {flipped && (
              <div className="flex justify-center gap-3 mt-4">
                <Button
                  variant="outline"
                  className="text-red-500"
                  onClick={() => {
                    setFlipped(false);
                    setCurrentCard((prev) => (prev + 1) % cards.length);
                  }}
                >
                  Hard
                </Button>
                <Button
                  variant="outline"
                  className="text-yellow-500"
                  onClick={() => {
                    setFlipped(false);
                    setCurrentCard((prev) => (prev + 1) % cards.length);
                  }}
                >
                  Medium
                </Button>
                <Button
                  variant="outline"
                  className="text-green-500"
                  onClick={() => {
                    setFlipped(false);
                    setCurrentCard((prev) => (prev + 1) % cards.length);
                  }}
                >
                  Easy
                </Button>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentCard(
                    (prev) => (prev - 1 + cards.length) % cards.length
                  )
                }
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                {currentCard + 1} / {cards.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentCard((prev) => (prev + 1) % cards.length)
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.map((card, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex gap-1 flex-wrap">
                      {card.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-xs ${
                        card.difficulty === "hard"
                          ? "text-red-500"
                          : card.difficulty === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                      }`}
                    >
                      {card.difficulty}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium mb-3">{card.front}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderQuiz = () => {
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);

    const questions = [
      {
        question:
          "A 65-year-old man presents with dyspnea, orthopnea, and bilateral leg edema. Chest X-ray shows cardiomegaly. Most likely diagnosis?",
        options: [
          "Chronic obstructive pulmonary disease",
          "Congestive heart failure",
          "Pneumonia",
          "Pulmonary embolism",
        ],
        correct: 1,
        explanation:
          "The combination of dyspnea, orthopnea, bilateral edema, and cardiomegaly is classic for CHF.",
      },
      {
        question: "Which of the following is NOT a sign of meningeal irritation?",
        options: [
          "Kernig's sign",
          "Brudzinski's sign",
          "Babinski's sign",
          "Neck stiffness",
        ],
        correct: 2,
        explanation:
          "Babinski's sign indicates upper motor neuron lesion, not meningeal irritation. Kernig's, Brudzinski's, and neck stiffness are meningeal signs.",
      },
    ];

    if (!quizStarted) {
      return (
        <div className="space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">Quiz</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Quick Quiz",
                desc: "10 random questions",
                time: "10 min",
                icon: RotateCcw,
              },
              {
                title: "Topic Quiz",
                desc: "Choose your topic",
                time: "Varies",
                icon: BookOpen,
              },
              {
                title: "Mock Exam",
                desc: "Full exam simulation",
                time: "3 hours",
                icon: School,
              },
            ].map((mode) => (
              <Card
                key={mode.title}
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setQuizStarted(true)}
              >
                <CardContent className="p-6 text-center">
                  <mode.icon className="h-10 w-10 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-1">{mode.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {mode.desc}
                  </p>
                  <Badge variant="outline">{mode.time}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (showResult) {
      return (
        <div className="max-w-xl mx-auto text-center space-y-6">
          <h2 className="text-2xl font-bold">Quiz Complete!</h2>
          <div className="text-5xl font-bold text-primary">
            {score}/{questions.length}
          </div>
          <p className="text-muted-foreground">
            {score === questions.length ? "Perfect score!" : "Keep practicing!"}
          </p>
          <Button
            onClick={() => {
              setQuizStarted(false);
              setCurrentQ(0);
              setScore(0);
              setShowResult(false);
              setSelected(null);
            }}
          >
            Try Again
          </Button>
        </div>
      );
    }

    const q = questions[currentQ];
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold">Quiz</h1>
          <span className="text-sm text-muted-foreground">
            {currentQ + 1}/{questions.length}
          </span>
        </div>
        <Progress
          value={((currentQ + 1) / questions.length) * 100}
          className="h-2"
        />
        <Card>
          <CardContent className="p-6">
            <p className="font-medium mb-6">{q.question}</p>
            <div className="space-y-3">
              {q.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(i)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selected === null
                      ? "hover:bg-secondary"
                      : i === q.correct
                      ? "bg-green-50 border-green-500 dark:bg-green-950"
                      : selected === i
                      ? "bg-red-50 border-red-500 dark:bg-red-950"
                      : "opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full border flex items-center justify-center text-sm font-medium">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </div>
                </button>
              ))}
            </div>
            {selected !== null && (
              <div
                className={`mt-4 p-3 rounded-lg ${
                  selected === q.correct
                    ? "bg-green-50 dark:bg-green-950"
                    : "bg-red-50 dark:bg-red-950"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {selected === q.correct ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="font-medium text-sm">
                    {selected === q.correct ? "Correct!" : "Incorrect"}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{q.explanation}</p>
              </div>
            )}
          </CardContent>
        </Card>
        {selected !== null && (
          <Button
            className="w-full"
            onClick={() => {
              if (selected === q.correct) setScore((s) => s + 1);
              if (currentQ + 1 < questions.length) {
                setCurrentQ((q) => q + 1);
                setSelected(null);
              } else {
                setShowResult(true);
              }
            }}
          >
            {currentQ + 1 < questions.length ? "Next Question" : "See Results"}
          </Button>
        )}
      </div>
    );
  };

  const renderCases = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Clinical Cases</h1>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Case
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            id: "CC-001",
            title: "Chest Pain in 55-year-old Male",
            specialty: "Cardiology",
            difficulty: "Hard",
            status: "In Progress",
            time: "45 min",
          },
          {
            id: "CC-002",
            title: "Sudden Onset Headache",
            specialty: "Neurology",
            difficulty: "Medium",
            status: "Not Started",
            time: "30 min",
          },
          {
            id: "CC-003",
            title: "Diabetic Ketoacidosis",
            specialty: "Endocrinology",
            difficulty: "Medium",
            status: "Completed",
            time: "60 min",
          },
          {
            id: "CC-004",
            title: "Acute Kidney Injury",
            specialty: "Nephrology",
            difficulty: "Hard",
            status: "Not Started",
            time: "45 min",
          },
        ].map((c) => (
          <Card key={c.id} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="outline" className="text-xs">{c.id}</Badge>
                <Badge
                  variant={c.status === "Completed" ? "default" : "secondary"}
                  className="text-xs"
                >
                  {c.status}
                </Badge>
              </div>
              <h3 className="font-semibold mb-1">{c.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{c.specialty}</span>
                <span>•</span>
                <span className={c.difficulty === "Hard" ? "text-red-500" : "text-yellow-500"}>
                  {c.difficulty}
                </span>
                <span>•</span>
                <span>{c.time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPathology = () => (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Pathology</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { title: "Cardiovascular Pathology", cases: 45, icon: Heart, color: "text-red-500" },
          { title: "Neuropathology", cases: 32, icon: Brain, color: "text-purple-500" },
          { title: "Systemic Pathology", cases: 58, icon: Activity, color: "text-blue-500" },
        ].map((item) => (
          <Card key={item.title} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className={`h-8 w-8 ${item.color}`} />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.cases} cases</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderCalendar = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Calendar</h1>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Event
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>May 2025</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm"><ChevronLeft className="h-4 w-4" /></Button>
                <Button variant="ghost" size="sm"><ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="text-xs font-medium text-muted-foreground py-2">{d}</div>
              ))}
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <button
                  key={day}
                  className={`p-2 text-sm rounded-lg hover:bg-secondary transition-colors ${
                    day === 3 ? "bg-primary text-primary-foreground" : ""
                  }`}
                >
                  {day}
                  {[8, 15, 22].includes(day) && (
                    <div className="w-1 h-1 bg-blue-500 rounded-full mx-auto mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { time: "9:00 AM", event: "Morning Review", color: "bg-blue-500" },
                { time: "2:00 PM", event: "Case Study", color: "bg-green-500" },
                { time: "4:00 PM", event: "Quiz Session", color: "bg-purple-500" },
                { time: "6:00 PM", event: "Study Group", color: "bg-orange-500" },
              ].map((event, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${event.color}`} />
                  <span className="text-muted-foreground w-16 text-xs">{event.time}</span>
                  <span>{event.event}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderWrite = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold">Write</h1>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 space-y-2">
          {[
            { title: "Heart Failure Notes", date: "Today", preview: "ACE inhibitors, beta blockers..." },
            { title: "Neurology Summary", date: "Yesterday", preview: "Stroke types, management..." },
            { title: "Pharmacology Drug List", date: "3 days ago", preview: "Beta blockers: metoprolol..." },
          ].map((note, i) => (
            <Card key={i} className="cursor-pointer hover:shadow-sm transition-shadow">
              <CardContent className="p-3">
                <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                <p className="text-xs text-muted-foreground mb-1">{note.preview}</p>
                <span className="text-xs text-muted-foreground">{note.date}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <Input placeholder="Note title..." className="border-none text-lg font-semibold px-0 mb-4" />
            <textarea
              className="w-full h-64 bg-transparent resize-none outline-none text-sm text-muted-foreground"
              placeholder="Start writing..."
            />
            <div className="flex gap-2 mt-4">
              <Button size="sm">Save</Button>
              <Button size="sm" variant="outline" className="gap-1">
                <Download className="h-3 w-3" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Achievements</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "First Steps", desc: "Complete your first lesson", earned: true, xp: 50, icon: "🎯" },
          { title: "Week Warrior", desc: "7-day study streak", earned: true, xp: 100, icon: "🔥" },
          { title: "Quiz Master", desc: "Score 100% on any quiz", earned: false, xp: 200, icon: "🏆" },
          { title: "Case Solver", desc: "Complete 10 clinical cases", earned: false, xp: 300, icon: "🩺" },
          { title: "Speed Learner", desc: "Complete 5 lessons in one day", earned: true, xp: 150, icon: "⚡" },
          { title: "Scholar", desc: "Study 100 hours total", earned: false, xp: 500, icon: "📚" },
        ].map((achievement, i) => (
          <Card key={i} className={achievement.earned ? "" : "opacity-60"}>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="text-3xl">{achievement.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold">{achievement.title}</h3>
                <p className="text-xs text-muted-foreground">{achievement.desc}</p>
              </div>
              <div className="text-right">
                <Badge variant={achievement.earned ? "default" : "outline"}>
                  {achievement.xp} XP
                </Badge>
                {achievement.earned && <div className="text-xs text-green-500 mt-1">Earned!</div>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderStats = () => (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Statistics</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Study Hours", value: "127h", change: "+3h this week" },
          { label: "Questions Answered", value: "2,841", change: "+124 this week" },
          { label: "Average Score", value: "84%", change: "+2% this month" },
          { label: "Current Streak", value: "12 days", change: "Personal best!" },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground mb-1">{stat.label}</div>
              <div className="text-xs text-green-500">{stat.change}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Performance by Subject</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { subject: "Cardiology", score: 88 },
              { subject: "Neurology", score: 76 },
              { subject: "Internal Medicine", score: 82 },
              { subject: "Pharmacology", score: 91 },
              { subject: "Pathology", score: 71 },
            ].map((item) => (
              <div key={item.subject}>
                <div className="flex justify-between text-xs mb-1">
                  <span>{item.subject}</span>
                  <span className="font-medium">{item.score}%</span>
                </div>
                <Progress value={item.score} className="h-1.5" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Weekly Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-around h-32 gap-1">
              {[
                { day: "M", hours: 2 },
                { day: "T", hours: 3.5 },
                { day: "W", hours: 1.5 },
                { day: "T", hours: 4 },
                { day: "F", hours: 2.5 },
                { day: "S", hours: 5 },
                { day: "S", hours: 3 },
              ].map((d, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="bg-primary rounded-sm w-full"
                    style={{ height: `${(d.hours / 5) * 100}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{d.day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
      <div className="max-w-xl space-y-4">
        {[
          {
            title: "Account",
            items: [
              { label: "Display Name", value: user.name, type: "text" },
              { label: "Email", value: user.email, type: "email" },
              { label: "Specialty", value: user.specialty, type: "text" },
            ],
          },
          {
            title: "Preferences",
            items: [
              { label: "Theme", value: theme === "dark" ? "Dark" : "Light", type: "select" },
              { label: "Language", value: "English", type: "select" },
              { label: "Notifications", value: "Enabled", type: "toggle" },
            ],
          },
        ].map((section) => (
          <Card key={section.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <Label className="text-sm">{item.label}</Label>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderHelp = () => (
    <div className="space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold">Help & Support</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { title: "Getting Started Guide", desc: "Learn how to use MedStudy", icon: BookOpen },
          { title: "FAQ", desc: "Frequently asked questions", icon: HelpCircle },
          { title: "Contact Support", desc: "Get help from our team", icon: Bot },
          { title: "Video Tutorials", desc: "Watch how-to videos", icon: Play },
        ].map((item, i) => (
          <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-4 flex items-center gap-3">
              <item.icon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground ml-auto" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen bg-background overflow-hidden ${theme === "dark" ? "dark" : ""}`}>
      {/* Mobile Sidebar Overlay */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SheetHeader className="px-4 py-3 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              MedStudy
            </SheetTitle>
            <SheetDescription className="sr-only">Navigation menu</SheetDescription>
          </SheetHeader>
          <nav className="p-2 space-y-1">
            {renderNavItems(true)}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col border-r bg-card transition-all duration-300 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <Logo className="h-6 w-6" />
              <span className="font-semibold">MedStudy</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={sidebarCollapsed ? "mx-auto" : ""}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {renderNavItems(false)}
        </nav>

        {/* Sidebar Footer */}
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.year}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-4 py-3 border-b bg-card">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            {/* Search */}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 w-48 md:w-64 h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <Button
              variant="ghost"
              size="sm"
              className="sm:hidden"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search className="h-5 w-5" />
            </Button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>

            {/* Notifications */}
            <DropdownMenu
              open={notificationsOpen}
              onOpenChange={setNotificationsOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                      {unreadCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between">
                  Notifications
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto py-0 text-xs"
                    onClick={markAllRead}
                  >
                    Mark all read
                  </Button>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className={`flex flex-col items-start gap-0.5 ${
                      !n.read ? "bg-secondary/50" : ""
                    }`}
                  >
                    <span className="text-sm">{n.text}</span>
                    <span className="text-xs text-muted-foreground">
                      {n.time}
                    </span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile */}
            <DropdownMenu open={profileOpen} onOpenChange={setProfileOpen}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="text-xs">{user.avatar}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground font-normal">
                    {user.email}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage("settings")}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={() => setIsLoggedIn(false)}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Mobile Search Bar */}
        {searchOpen && (
          <div className="sm:hidden px-4 py-2 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                className="pl-9 h-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Page Content */}
        <main 
          className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/30"
          onClick={() => {
            // Fermer la sidebar si elle est ouverte (seulement sur desktop)
            if (!sidebarCollapsed && window.innerWidth >= 768) {
              setSidebarCollapsed(true);
              setLearnExpanded(false);
              setTrainExpanded(false);
            }
          }}
        >
          {renderContent()}
        </main>
      </div>
    </div>
  );
}