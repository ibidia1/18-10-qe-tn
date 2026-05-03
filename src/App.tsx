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
import { SimpleHomePage } from "./components/SimpleHomePage";
import { OrganizePage } from "./components/organize/OrganizePage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home"); // "home", "login", "menu", ou "app"
  const [currentSection, setCurrentSection] =
    useState("dashboard");
  const [currentView, setCurrentView] = useState("");
  const [theme, setTheme] = useState("light");
  const [activeTab, setActiveTab] = useState("j1");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // États pour QCM à la carte
  const [questionCount, setQuestionCount] = useState([20]);
  const [selectedStatus, setSelectedStatus] = useState<
    string[]
  >([]);
  const [selectedExams, setSelectedExams] = useState<string[]>(
    [],
  );
  const [selectedSpecialities, setSelectedSpecialities] =
    useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<
    string[]
  >([]);
  const [selectedYears, setSelectedYears] = useState<string[]>(
    [],
  );
  const [selectedFaculties, setSelectedFaculties] = useState<
    string[]
  >([]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    [],
  );
  const [selectedQuestionTypes, setSelectedQuestionTypes] =
    useState<string[]>([]);

  // États pour le planning
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planningView, setPlanningView] = useState("month"); // 'month', 'week', 'agenda'

  // État pour gérer les événements du planning
  const [planningEvents, setPlanningEvents] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

    return [
      {
        id: 1,
        title: "📖 Révision Cardiologie",
        date: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        ),
        time: "09:00",
        duration: "2h",
        type: "study",
        course: "SCA - Syndrome Coronarien Aigu",
        priority: "high",
        completed: false,
      },
      {
        id: 2,
        title: "✍️ QCM Pneumologie",
        date: new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
        ),
        time: "14:30",
        duration: "1h30",
        type: "practice",
        course: "Série 2024 - Sousse",
        priority: "medium",
        completed: false,
      },
      {
        id: 3,
        title: "🔄 Relecture Néphrologie",
        date: new Date(
          tomorrow.getFullYear(),
          tomorrow.getMonth(),
          tomorrow.getDate(),
        ),
        time: "10:00",
        duration: "45min",
        type: "review",
        course: "IRA - Insuffisance Rénale Aiguë",
        priority: "high",
        completed: false,
      },
      {
        id: 4,
        title: "📚 Nouveau Chapitre",
        date: new Date(
          dayAfterTomorrow.getFullYear(),
          dayAfterTomorrow.getMonth(),
          dayAfterTomorrow.getDate(),
        ),
        time: "08:30",
        duration: "3h",
        type: "study",
        course: "Gynéco - Contraception",
        priority: "medium",
        completed: false,
      },
    ];
  });

  // États pour les sous-menus de la sidebar
  const [learnExpanded, setLearnExpanded] = useState(false);
  const [trainExpanded, setTrainExpanded] = useState(false);

  // État pour le header qui se cache/montre sur mobile
  const [showHeader, setShowHeader] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // États pour le formulaire d'ajout d'événement
  const [isAddEventDialogOpen, setIsAddEventDialogOpen] =
    useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventType, setNewEventType] = useState("study");
  const [newEventCourse, setNewEventCourse] = useState("");
  const [newEventDate, setNewEventDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [newEventTime, setNewEventTime] = useState("09:00");
  const [newEventDuration, setNewEventDuration] =
    useState("1h");
  const [newEventPriority, setNewEventPriority] =
    useState("medium");

  useEffect(() => {
    const timer = setInterval(
      () => setCurrentDate(new Date()),
      60000,
    );
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // Gestion de la navigation avec le bouton retour du navigateur
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state) {
        setCurrentSection(event.state.section || "dashboard");
        setCurrentView(event.state.view || "");
      }
    };

    window.addEventListener("popstate", handlePopState);

    // Initialiser l'état de l'historique
    if (!window.history.state) {
      window.history.replaceState(
        { section: currentSection, view: currentView },
        "",
        window.location.href,
      );
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Gestion du scroll pour cacher/montrer le header sur mobile
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ne gérer que sur mobile (écrans < 768px)
      if (window.innerWidth >= 768) {
        setShowHeader(true);
        return;
      }

      // Si on est tout en haut, toujours montrer le header
      if (currentScrollY < 10) {
        setShowHeader(true);
        setLastScrollY(currentScrollY);
        return;
      }

      // Détection de la direction du scroll
      if (
        currentScrollY > lastScrollY &&
        currentScrollY > 100
      ) {
        // Scroll vers le bas - cacher le header
        setShowHeader(false);
      } else if (currentScrollY < lastScrollY) {
        // Scroll vers le haut - montrer le header
        setShowHeader(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.className = newTheme;
  };

  const getThemeIcon = () => {
    return theme === "light" ? (
      <Moon className="h-4 w-4" />
    ) : (
      <Sun className="h-4 w-4" />
    );
  };

  const formatDateTime = (date: Date) => {
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "janvier",
      "février",
      "mars",
      "avril",
      "mai",
      "juin",
      "juillet",
      "août",
      "septembre",
      "octobre",
      "novembre",
      "décembre",
    ];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date
      .getMinutes()
      .toString()
      .padStart(2, "0");

    return `${dayName} ${day} ${month} • ${hours}:${minutes}`;
  };

  const getGreeting = () => {
    const hour = currentDate.getHours();
    if (hour < 12) return "Bonjour Dr. Sarah 👋";
    if (hour < 17) return "Bon après-midi Dr. Sarah 👋";
    return "Bonsoir Dr. Sarah 👋";
  };

  const LogoComponent = () => (
    <div
      className="cursor-pointer"
      onClick={() => showSection("dashboard")}
    >
      <Logo
        variant={theme === "light" ? "primary" : "white"}
        size="md"
        showECG={true}
      />
    </div>
  );

  const showSection = (section: string) => {
    setCurrentSection(section);
    setCurrentView("");
    setMobileMenuOpen(false); // Fermer le menu mobile

    // Ajouter à l'historique du navigateur
    window.history.pushState(
      { section, view: "" },
      "",
      window.location.href,
    );

    // Gérer l'expansion des sous-menus quand on navigue depuis le mode collapsed
    if (section === "learn" && sidebarCollapsed) {
      setLearnExpanded(true);
    }
    if (section === "train" && sidebarCollapsed) {
      setTrainExpanded(true);
    }
  };

  const showView = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false); // Fermer le menu mobile

    // Ajouter à l'historique du navigateur
    window.history.pushState(
      { section: currentSection, view },
      "",
      window.location.href,
    );
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
    // Réinitialiser les sous-menus quand on collapse
    if (!sidebarCollapsed) {
      setLearnExpanded(false);
      setTrainExpanded(false);
    }
  };

  const toggleEventCompletion = (eventId: number) => {
    setPlanningEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId
          ? { ...event, completed: !event.completed }
          : event,
      ),
    );
  };

  const addNewEvent = () => {
    if (!newEventCourse) {
      return; // Validation basique
    }

    // Générer un titre automatique si vide
    const getEventTypeLabel = (type: string) => {
      switch (type) {
        case "study":
          return "📖";
        case "practice":
          return "✍️";
        case "review":
          return "🔄";
        default:
          return "📅";
      }
    };

    const finalTitle =
      newEventTitle ||
      `${getEventTypeLabel(newEventType)} ${newEventCourse}`;

    const [year, month, day] = newEventDate
      .split("-")
      .map(Number);
    const newEvent = {
      id:
        planningEvents.length > 0
          ? Math.max(...planningEvents.map((e) => e.id)) + 1
          : 1,
      title: finalTitle,
      date: new Date(year, month - 1, day),
      time: newEventTime,
      duration: newEventDuration,
      type: newEventType,
      course: newEventCourse,
      priority: newEventPriority,
      completed: false,
    };

    setPlanningEvents([...planningEvents, newEvent]);

    // Réinitialiser le formulaire
    setNewEventTitle("");
    setNewEventType("study");
    setNewEventCourse("");
    setNewEventDate(new Date().toISOString().split("T")[0]);
    setNewEventTime("09:00");
    setNewEventDuration("1h");
    setNewEventPriority("medium");
    setIsAddEventDialogOpen(false);
  };

  const TodoItem = ({
    title,
    meta,
    checked = false,
    onClick,
  }: {
    title: string;
    meta: string;
    checked?: boolean;
    onClick?: () => void;
  }) => (
    <div
      className={`flex items-start gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-secondary/50 transition-colors ${checked ? "bg-success/10" : ""}`}
      onClick={onClick}
    >
      <Checkbox checked={checked} className="mt-1" />
      <div className="flex-1">
        <p
          className={`font-medium ${checked ? "text-success line-through" : "text-foreground"}`}
        >
          {title}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {meta}
        </p>
      </div>
      {checked && (
        <CheckCircle className="h-5 w-5 text-success mt-1" />
      )}
    </div>
  );

  const StatCard = ({
    icon,
    value,
    label,
    color = "text-primary",
  }: {
    icon: React.ReactNode;
    value: string;
    label: string;
    color?: string;
  }) => (
    <div className="text-center p-4 bg-secondary rounded-lg border border-border">
      <div className={`text-2xl font-bold ${color} mb-1`}>
        {value}
      </div>
      <div className="text-xs text-muted-foreground">
        {label}
      </div>
    </div>
  );

  const CourseCard = ({
    icon,
    title,
    progress,
    chapters,
    onClick,
  }: {
    icon: React.ReactNode;
    title: string;
    progress: string;
    chapters: string;
    onClick: () => void;
  }) => (
    <div
      className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 gap-3 bg-card border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 flex-1">
        <div className="text-xl md:text-2xl">{icon}</div>
        <div className="flex-1">
          <p className="font-medium text-sm md:text-base">
            {title}
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            {progress} • {chapters} • PDF interactif
          </p>
        </div>
      </div>
      <Button className="w-full md:w-auto">OUVRIR</Button>
    </div>
  );

  // Navigation Menu Component (réutilisable pour sidebar et mobile)
  const NavigationMenu = ({
    isMobile = false,
  }: {
    isMobile?: boolean;
  }) => (
    <div className="space-y-1 p-4">
      <Button
        variant={
          currentSection === "dashboard" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("dashboard")}
      >
        <Home className="h-4 w-4" />
        <span className="ml-3">Accueil</span>
      </Button>

      <div className="h-px bg-border my-4" />

      {/* Apprendre avec sous-menu */}
      <div>
        <Button
          variant={
            currentSection === "learn" ? "default" : "ghost"
          }
          className="w-full justify-between"
          onClick={() => setLearnExpanded(!learnExpanded)}
        >
          <div className="flex items-center">
            <BookOpen className="h-4 w-4" />
            <span className="ml-3">Apprendre</span>
          </div>
          {learnExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {learnExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentSection("learn");
                setCurrentView("cours-communs");
              }}
            >
              <span className="ml-3">Cours Communs</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentSection("learn");
                setCurrentView("resumes");
              }}
            >
              <span className="ml-3">Résumé By HM</span>
            </Button>
          </div>
        )}
      </div>

      <Button
        variant={
          currentSection === "organize" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("organize")}
      >
        <Calendar className="h-4 w-4" />
        <span className="ml-3">S'organiser</span>
      </Button>

      {/* S'entraîner avec sous-menu */}
      <div>
        <Button
          variant={
            currentSection === "train" ? "default" : "ghost"
          }
          className="w-full justify-between"
          onClick={() => setTrainExpanded(!trainExpanded)}
        >
          <div className="flex items-center">
            <PenTool className="h-4 w-4" />
            <span className="ml-3">S'entraîner</span>
          </div>
          {trainExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {trainExpanded && (
          <div className="ml-4 mt-1 space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentSection("train");
                setCurrentView("series");
              }}
            >
              <span className="ml-3">QCM par Séries</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start text-sm"
              onClick={() => {
                setCurrentSection("train");
                setCurrentView("custom");
              }}
            >
              <span className="ml-3">QCM à la Carte</span>
            </Button>
          </div>
        )}
      </div>

      <Button
        variant={
          currentSection === "exam" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("exam")}
      >
        <Trophy className="h-4 w-4" />
        <span className="ml-3">S'examiner</span>
      </Button>

      <Button
        variant={
          currentSection === "stats" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("stats")}
      >
        <BarChart3 className="h-4 w-4" />
        <span className="ml-3">Mes Stats</span>
      </Button>

      <div className="h-px bg-border my-4" />

      <Button
        variant={
          currentSection === "blog" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("blog")}
      >
        <FileText className="h-4 w-4" />
        <span className="ml-3">Blog</span>
      </Button>

      <Button
        variant={
          currentSection === "settings" ? "default" : "ghost"
        }
        className="w-full justify-start"
        onClick={() => showSection("settings")}
      >
        <Settings className="h-4 w-4" />
        <span className="ml-3">Paramètres</span>
      </Button>

      <Button variant="ghost" className="w-full justify-start">
        <HelpCircle className="h-4 w-4" />
        <span className="ml-3">Aide & Support</span>
      </Button>

      <div className="h-px bg-border my-4" />

      <Button 
        variant="ghost" 
        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => {
          setCurrentPage("home");
          if (isMobile) {
            setMobileMenuOpen(false);
          }
        }}
      >
        <LogOut className="h-4 w-4" />
        <span className="ml-3">Déconnexion</span>
      </Button>
    </div>
  );

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardContent className="p-4 md:p-6">
          <h1 className="text-xl md:text-2xl font-semibold mb-2">
            {getGreeting()}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mb-4">
            Prêt(e) pour votre session d'étude ?
          </p>
          <p className="text-xs md:text-sm text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {formatDateTime(currentDate)}
          </p>
        </CardContent>
      </Card>

      {/* Todo Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Votre Programme Aujourd'hui
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {planningEvents.filter(
            (event) =>
              event.date.getDate() === currentDate.getDate() &&
              event.date.getMonth() ===
                currentDate.getMonth() &&
              event.date.getFullYear() ===
                currentDate.getFullYear(),
          ).length > 0 ? (
            planningEvents
              .filter(
                (event) =>
                  event.date.getDate() ===
                    currentDate.getDate() &&
                  event.date.getMonth() ===
                    currentDate.getMonth() &&
                  event.date.getFullYear() ===
                    currentDate.getFullYear(),
              )
              .map((event) => (
                <TodoItem
                  key={event.id}
                  title={event.title}
                  meta={`${event.course} • ⏰ ${event.time} • ⏱️ ${event.duration}`}
                  checked={event.completed}
                  onClick={() =>
                    toggleEventCompletion(event.id)
                  }
                />
              ))
          ) : (
            <div className="p-6 text-center text-muted-foreground">
              <p>Aucun événement prévu aujourd'hui</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  showSection("organize");
                  showView("planning");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un événement
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides mobile */}
      <div className="grid grid-cols-2 gap-4 md:hidden">
        <Button
          className="w-full h-20 flex flex-col gap-2"
          onClick={() => {
            setCurrentSection("train");
            setCurrentView("series");
          }}
        >
          <PenTool className="h-5 w-5" />
          <span className="text-sm">QCM Séries</span>
        </Button>
        <Button
          className="w-full h-20 flex flex-col gap-2"
          onClick={() => {
            setCurrentSection("train");
            setCurrentView("custom");
          }}
        >
          <Filter className="h-5 w-5" />
          <span className="text-sm">QCM à la Carte</span>
        </Button>
      </div>

      {/* Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hidden md:block hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Play className="h-5 w-5" />
              Continuer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium mb-2">
              Cardio - Chapitre 3
            </p>
            <Progress value={78} className="mb-2" />
            <p className="text-sm text-muted-foreground mb-4">
              📖 78% terminé
            </p>
            <Button className="w-full">REPRENDRE</Button>
          </CardContent>
        </Card>

        <Card className="hidden md:block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Citation du Jour
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="italic mb-4 text-sm">
              "Le succès est la somme de petits efforts répétés
              jour après jour."
            </p>
            <p className="text-xs text-muted-foreground">
              - Robert Collier
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Progression
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <StatCard
                icon={<Flame className="h-4 w-4" />}
                value="🔥 7"
                label="Jours Série"
                color="text-orange-500"
              />
              <StatCard
                icon={<Target className="h-4 w-4" />}
                value="85%"
                label="Objectif"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              📚 12 cours terminés
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderTrain = () => {
    // Données détaillées des cours
    const courseDetails = {
      "cardio-ccv": {
        title: "Cardiologie – Chirurgie cardio-vasculaire",
        icon: <Heart className="h-6 w-6 text-red-500" />,
        courses: [
          {
            number: "22",
            title: "Douleurs thoraciques",
            progress: 85,
            completed: true,
          },
          {
            number: "25",
            title: "Endocardite infectieuse",
            progress: 60,
            completed: false,
          },
          {
            number: "38",
            title: "Hypertension artérielle aiguë",
            progress: 90,
            completed: true,
          },
          {
            number: "49",
            title: "Ischémie aiguë du membre",
            progress: 45,
            completed: false,
          },
          {
            number: "51",
            title: "Maladies veineuses thromboemboliques",
            progress: 75,
            completed: false,
          },
          {
            number: "65",
            title: "Syndrome coronarien aigu",
            progress: 95,
            completed: true,
          },
        ],
      },
      chirurgie: {
        title: "Chirurgie générale",
        icon: "🏥",
        courses: [
          {
            number: "4",
            title: "Appendicite aiguë",
            progress: 80,
            completed: true,
          },
          {
            number: "15",
            title: "Cancer colo-rectal",
            progress: 35,
            completed: false,
          },
          {
            number: "34",
            title: "Hémorragies digestives",
            progress: 55,
            completed: false,
          },
          {
            number: "36",
            title: "Hydatidose",
            progress: 70,
            completed: false,
          },
          {
            number: "54",
            title: "Occlusion intestinale aiguë",
            progress: 25,
            completed: false,
          },
          {
            number: "57",
            title: "Péritonites aigues",
            progress: 40,
            completed: false,
          },
        ],
      },
      endocrino: {
        title: "Endocrinologie",
        icon: "🧬",
        courses: [
          {
            number: "20",
            title: "Diabète",
            progress: 90,
            completed: true,
          },
          {
            number: "23",
            title: "Dyslipémie",
            progress: 75,
            completed: false,
          },
          {
            number: "37",
            title: "Hypercalcémie",
            progress: 50,
            completed: false,
          },
          {
            number: "39",
            title: "Hyperthyroïdie",
            progress: 65,
            completed: false,
          },
          {
            number: "40",
            title: "Hypothyroïdie",
            progress: 80,
            completed: true,
          },
          {
            number: "47",
            title: "Insuffisance surrénalienne aiguë",
            progress: 30,
            completed: false,
          },
        ],
      },
      gastro: {
        title: "Gastro-entérologie",
        icon: "🫄",
        courses: [
          {
            number: "21",
            title: "Diarrhées chroniques",
            progress: 70,
            completed: false,
          },
          {
            number: "24",
            title: "Dysphagie",
            progress: 85,
            completed: true,
          },
          {
            number: "35",
            title: "Les hépatites virales",
            progress: 60,
            completed: false,
          },
          {
            number: "41",
            title: "Ictères",
            progress: 45,
            completed: false,
          },
          {
            number: "74",
            title: "Ulcère",
            progress: 90,
            completed: true,
          },
        ],
      },
      gyneco: {
        title: "Gynécologie – Obstétrique",
        icon: "👶",
        courses: [
          {
            number: "13",
            title: "Cancer du col utérin",
            progress: 85,
            completed: true,
            pdfUrl: "https://rhbxaluwjrwditkjebxi.supabase.co/storage/v1/object/sign/cours-communs/13_COL%20UTERIN%20%20%20%20mai%202025.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMTI3NDg1Ni0xZjZhLTRhMDctYWFlMy1jMjkzNDZjZmQ5YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3Vycy1jb21tdW5zLzEzX0NPTCBVVEVSSU4gICAgbWFpIDIwMjUucGRmIiwiaWF0IjoxNzYwODA3ODM1LCJleHAiOjE3OTIzNDM4MzV9.xkLgEmwSQfOVoU1fLF-kyn7Yk2j8wwiG3IIjOA2P7ag"
          },
          {
            number: "14",
            title: "Cancer du sein",
            progress: 75,
            completed: false,
          },
          {
            number: "18",
            title: "Contraception",
            progress: 95,
            completed: true,
          },
          {
            number: "32",
            title: "Grossesse extra-utérine",
            progress: 50,
            completed: false,
          },
          {
            number: "53",
            title: "Métrorragies",
            progress: 40,
            completed: false,
          },
          {
            number: "60",
            title: "Prééclampsie et éclampsie",
            progress: 65,
            completed: false,
          },
        ],
      },
      hemato: {
        title: "Hématologie",
        icon: "🩸",
        courses: [
          {
            number: "2",
            title: "Les adénopathies superficielles",
            progress: 55,
            completed: false,
          },
          {
            number: "3",
            title: "Anémies",
            progress: 80,
            completed: true,
          },
          {
            number: "62",
            title: "Purpura",
            progress: 35,
            completed: false,
          },
          {
            number: "64",
            title: "Splénomégalie",
            progress: 25,
            completed: false,
          },
          {
            number: "66",
            title: "Transfusion sanguine",
            progress: 70,
            completed: false,
          },
        ],
      },
      psychiatrie: {
        title: "Psychiatrie",
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        courses: [
          {
            number: "67",
            title: "Troubles anxieux",
            progress: 42,
            completed: false,
          },
          {
            number: "68",
            title: "Troubles de l'humeur",
            progress: 38,
            completed: false,
          },
          {
            number: "69",
            title: "Schizophrénie",
            progress: 25,
            completed: false,
          },
        ],
      },
      neurologie: {
        title: "Neurologie",
        icon: <Brain className="h-6 w-6 text-blue-500" />,
        courses: [
          {
            number: "70",
            title: "AVC",
            progress: 33,
            completed: false,
          },
          {
            number: "71",
            title: "Épilepsie",
            progress: 45,
            completed: false,
          },
          {
            number: "72",
            title: "Céphalées",
            progress: 28,
            completed: false,
          },
        ],
      },
      "orl-ophta": {
        title: "ORL – Ophtalmologie",
        icon: "👁️",
        courses: [
          {
            number: "73",
            title: "Conjonctivite",
            progress: 47,
            completed: false,
          },
          {
            number: "74",
            title: "Otite",
            progress: 52,
            completed: false,
          },
        ],
      },
      pneumo: {
        title: "Pneumologie",
        icon: (
          <Stethoscope className="h-6 w-6 text-green-500" />
        ),
        courses: [
          {
            number: "75",
            title: "Pneumonie",
            progress: 72,
            completed: false,
          },
          {
            number: "76",
            title: "Asthme",
            progress: 68,
            completed: false,
          },
        ],
      },
      infectieux: {
        title: "Maladies infectieuses",
        icon: "🦠",
        courses: [
          {
            number: "77",
            title: "Méningite",
            progress: 28,
            completed: false,
          },
          {
            number: "78",
            title: "Tuberculose",
            progress: 35,
            completed: false,
          },
        ],
      },
      nephro: {
        title: "Néphrologie",
        icon: "🫘",
        courses: [
          {
            number: "79",
            title: "Insuffisance rénale",
            progress: 44,
            completed: false,
          },
          {
            number: "80",
            title: "Lithiase urinaire",
            progress: 39,
            completed: false,
          },
        ],
      },
      "ortho-rhumato": {
        title: "Orthopédie – Rhumatologie",
        icon: "🦴",
        courses: [
          {
            number: "81",
            title: "Fractures",
            progress: 36,
            completed: false,
          },
          {
            number: "82",
            title: "Arthrite",
            progress: 42,
            completed: false,
          },
        ],
      },
      reanimation: {
        title: "Réanimation",
        icon: "🚨",
        courses: [
          {
            number: "83",
            title: "Choc septique",
            progress: 58,
            completed: false,
          },
          {
            number: "84",
            title: "Détresse respiratoire",
            progress: 61,
            completed: false,
          },
        ],
      },
      pediatrie: {
        title: "Pédiatrie",
        icon: "👶",
        courses: [
          {
            number: "85",
            title: "Vaccinations",
            progress: 67,
            completed: false,
          },
          {
            number: "86",
            title: "Malnutrition",
            progress: 59,
            completed: false,
          },
        ],
      },
      urologie: {
        title: "Urologie",
        icon: "🫸",
        courses: [
          {
            number: "87",
            title: "Prostatite",
            progress: 29,
            completed: false,
          },
          {
            number: "88",
            title: "Cancer prostate",
            progress: 31,
            completed: false,
          },
        ],
      },
    };

    // Données J1
    const j1Courses = [
      {
        icon: <Heart className="h-6 w-6 text-red-500" />,
        title: "Cardiologie – Chirurgie cardio-vasculaire",
        shortTitle: "Cardio-CCV",
        progress: "78%",
        chapters: "6 chapitres",
        key: "cardio-ccv",
      },
      {
        icon: "👶",
        title: "Gynécologie – Obstétrique",
        shortTitle: "Gynéco-Obs",
        progress: "65%",
        chapters: "6 chapitres",
        key: "gyneco",
      },
      {
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        title: "Psychiatrie",
        shortTitle: "Psychiatrie",
        progress: "42%",
        chapters: "10 chapitres",
        key: "psychiatrie",
      },
      {
        icon: "🏥",
        title: "Chirurgie générale",
        shortTitle: "Chirurgie",
        progress: "38%",
        chapters: "6 chapitres",
        key: "chirurgie",
      },
      {
        icon: "🫄",
        title: "Gastro-entérologie",
        shortTitle: "Gastro",
        progress: "55%",
        chapters: "5 chapitres",
        key: "gastro",
      },
      {
        icon: <Brain className="h-6 w-6 text-blue-500" />,
        title: "Neurologie",
        shortTitle: "Neurologie",
        progress: "33%",
        chapters: "16 chapitres",
        key: "neurologie",
      },
      {
        icon: "👁️",
        title: "ORL – Ophtalmologie",
        shortTitle: "ORL-Ophta",
        progress: "47%",
        chapters: "11 chapitres",
        key: "orl-ophta",
      },
      {
        icon: (
          <Stethoscope className="h-6 w-6 text-green-500" />
        ),
        title: "Pneumologie",
        shortTitle: "Pneumo",
        progress: "72%",
        chapters: "9 chapitres",
        key: "pneumo",
      },
    ];

    // Données J2
    const j2Courses = [
      {
        icon: "🧬",
        title: "Endocrinologie",
        shortTitle: "Endocrino",
        progress: "62%",
        chapters: "6 chapitres",
        key: "endocrino",
      },
      {
        icon: "🦠",
        title: "Maladies infectieuses",
        shortTitle: "Infectieux",
        progress: "28%",
        chapters: "17 chapitres",
        key: "infectieux",
      },
      {
        icon: "🫘",
        title: "Néphrologie",
        shortTitle: "Néphro",
        progress: "44%",
        chapters: "10 chapitres",
        key: "nephro",
      },
      {
        icon: "🦴",
        title: "Orthopédie – Rhumatologie",
        shortTitle: "Ortho-Rhumato",
        progress: "36%",
        chapters: "20 chapitres",
        key: "ortho-rhumato",
      },
      {
        icon: "🚨",
        title: "Réanimation",
        shortTitle: "Réanimation",
        progress: "58%",
        chapters: "8 chapitres",
        key: "reanimation",
      },
      {
        icon: "🩸",
        title: "Hématologie",
        shortTitle: "Hémato",
        progress: "41%",
        chapters: "5 chapitres",
        key: "hemato",
      },
      {
        icon: "👶",
        title: "Pédiatrie",
        shortTitle: "Pédiatrie",
        progress: "67%",
        chapters: "22 chapitres",
        key: "pediatrie",
      },
      {
        icon: "🫸",
        title: "Urologie",
        shortTitle: "Urologie",
        progress: "29%",
        chapters: "9 chapitres",
        key: "urologie",
      },
    ];

    // Données des séries QCM par années et facultés
    const seriesData = {
      "2025": {
        tunis: {
          name: "Tunis",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        sousse: {
          name: "Sousse",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
        sfax: {
          name: "Sfax",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        monastir: {
          name: "Monastir",
          series: 3,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
      },
      "2024": {
        tunis: {
          name: "Tunis",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        sousse: {
          name: "Sousse",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
        sfax: {
          name: "Sfax",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        monastir: {
          name: "Monastir",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
      },
      "2023": {
        tunis: {
          name: "Tunis",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        sousse: {
          name: "Sousse",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
        sfax: {
          name: "Sfax",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        monastir: {
          name: "Monastir",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
      },
      "2022": {
        tunis: {
          name: "Tunis",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        sousse: {
          name: "Sousse",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
        sfax: {
          name: "Sfax",
          series: 4,
          difficulty: "Élevée",
          color: "text-red-600",
        },
        monastir: {
          name: "Monastir",
          series: 4,
          difficulty: "Modérée",
          color: "text-yellow-600",
        },
      },
    };

    // Vue des séries d'une faculté spécifique pour un cours et une année
    if (currentView.startsWith("series-list-")) {
      const parts = currentView
        .replace("series-list-", "")
        .split("-");
      const [
        level,
        specialtyKey,
        courseIndex,
        year,
        facultyKey,
      ] = parts;

      const specialty = courseDetails[specialtyKey];
      const course = specialty?.courses[parseInt(courseIndex)];
      const facultyData = seriesData[year]?.[facultyKey];

      if (!specialty || !course || !facultyData) {
        return (
          <div className="text-center p-8">
            <p>Séries non trouvées</p>
            <Button onClick={() => showView("series")}>
              Retour
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    showView(
                      `years-${level}-${specialtyKey}-${courseIndex}`,
                    )
                  }
                  className="hidden md:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-2xl">{specialty.icon}</div>
                <div>
                  <h1 className="text-2xl font-semibold">
                    {course.title} - {facultyData.name} {year}
                  </h1>
                  <p className="text-muted-foreground">
                    📚 Séries QCM officielles • Format
                    authentique
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {Array.from(
              { length: facultyData.series },
              (_, i) => i + 1,
            ).map((serieNumber) => (
              <Card
                key={serieNumber}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        <span className="font-bold text-primary">
                          {serieNumber}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          Série {serieNumber} - {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>🏥 {facultyData.name}</span>
                          <span>📅 {year}</span>
                          <span>⏱️ 90 minutes</span>
                          <span>❓ 25 questions</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            className={`${facultyData.color} bg-transparent border-current`}
                          >
                            {facultyData.difficulty}
                          </Badge>
                          <Badge variant="secondary">
                            Format officiel
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button>
                        <Play className="h-4 w-4 mr-2" />
                        COMMENCER
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques des séries */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                📊 Statistiques - {course.title}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  icon={<FileText className="h-4 w-4" />}
                  value={facultyData.series.toString()}
                  label="📚 Séries disponibles"
                />
                <StatCard
                  icon={<HelpCircle className="h-4 w-4" />}
                  value="25"
                  label="❓ Questions/série"
                />
                <StatCard
                  icon={<Clock className="h-4 w-4" />}
                  value="90min"
                  label="⏱️ Durée"
                />
                <StatCard
                  icon={<Target className="h-4 w-4" />}
                  value={facultyData.difficulty}
                  label="📈 Difficulté"
                  color={facultyData.color}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Vue des facultés pour un cours et une année spécifique
    if (currentView.startsWith("years-")) {
      const parts = currentView
        .replace("years-", "")
        .split("-");
      const [level, specialtyKey, courseIndex] = parts;

      const specialty = courseDetails[specialtyKey];
      const course = specialty?.courses[parseInt(courseIndex)];

      if (!specialty || !course) {
        return (
          <div className="text-center p-8">
            <p>Cours non trouvé</p>
            <Button onClick={() => showView("series")}>
              Retour
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    showView(`courses-${level}-${specialtyKey}`)
                  }
                  className="hidden md:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-2xl">{specialty.icon}</div>
                <h1 className="text-2xl font-semibold">
                  {course.title} - Séries par Année
                </h1>
              </div>
              <p className="text-muted-foreground">
                Sélectionnez une année puis une faculté
              </p>
            </CardContent>
          </Card>

          {Object.entries(seriesData).map(
            ([year, faculties]) => (
              <Card key={year}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Année {year}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(faculties).map(
                      ([facultyKey, facultyData]) => (
                        <Card
                          key={facultyKey}
                          className="hover:shadow-lg transition-shadow cursor-pointer"
                          onClick={() =>
                            showView(
                              `series-list-${level}-${specialtyKey}-${courseIndex}-${year}-${facultyKey}`,
                            )
                          }
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-semibold">
                                {facultyData.name}
                              </h4>
                              <Badge
                                className={`${facultyData.color} bg-transparent border-current`}
                              >
                                {facultyData.difficulty}
                              </Badge>
                            </div>
                            <div className="space-y-2 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span>
                                  {facultyData.series} séries
                                  disponibles
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>90 min par série</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      );
    }

    // Vue des cours d'une spécialité
    if (currentView.startsWith("courses-")) {
      const parts = currentView
        .replace("courses-", "")
        .split("-");
      const [level, specialtyKey] = parts;

      const specialty = courseDetails[specialtyKey];

      if (!specialty) {
        return (
          <div className="text-center p-8">
            <p>Spécialité non trouvée</p>
            <Button onClick={() => showView("series")}>
              Retour
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => showView("series")}
                  className="hidden md:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-2xl">{specialty.icon}</div>
                <h1 className="text-2xl font-semibold">
                  {specialty.title}
                </h1>
              </div>
              <p className="text-muted-foreground">
                Sélectionnez un cours pour voir les séries QCM
                disponibles
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {specialty.courses.map((course, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() =>
                  showView(
                    `years-${level}-${specialtyKey}-${index}`,
                  )
                }
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        <span className="font-bold text-primary">
                          {course.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                    <Button>
                      EXPLORER{" "}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    // Vue des spécialités pour le mode séries
    if (currentView === "series") {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => showView("")}
                  className="hidden md:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold">
                  📚 QCM Par Séries
                </h1>
              </div>
              <p className="text-muted-foreground">
                Navigation : J1/J2 → Spécialité → Cours → Année
                → Faculté ��� Séries
              </p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="j1" className="text-base">
                Jour 1
              </TabsTrigger>
              <TabsTrigger value="j2" className="text-base">
                Jour 2
              </TabsTrigger>
            </TabsList>

            <TabsContent value="j1" className="space-y-4">
              <div className="grid gap-4">
                {j1Courses.map((course, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      showView(`courses-j1-${course.key}`)
                    }
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {course.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {course.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="font-normal"
                            >
                              {courseDetails[course.key]
                                ?.courses?.length || "N/A"}{" "}
                              cours
                            </Badge>
                          </div>
                        </div>
                        <Button>EXPLORER</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="j2" className="space-y-4">
              <div className="grid gap-4">
                {j2Courses.map((course, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() =>
                      showView(`courses-j2-${course.key}`)
                    }
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {course.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg mb-1">
                              {course.title}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="font-normal"
                            >
                              {courseDetails[course.key]
                                ?.courses?.length || "N/A"}{" "}
                              cours
                            </Badge>
                          </div>
                        </div>
                        <Button>EXPLORER</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    // Vue QCM à la Carte avec filtres avancés
    if (currentView === "custom") {
      const statusOptions = [
        {
          id: "non-fait",
          label: "Non fait",
          color: "text-muted-foreground",
        },
        { id: "fait", label: "Fait", color: "text-blue-600" },
        {
          id: "reussi",
          label: "Réussi",
          color: "text-green-600",
        },
        {
          id: "incomplet",
          label: "Incomplet",
          color: "text-yellow-600",
        },
        { id: "faux", label: "Faux", color: "text-red-600" },
      ];

      const specialties = [
        "Cardiologie",
        "Pneumologie",
        "Gastroentérologie",
        "Neurologie",
        "Pédiatrie",
        "Gynécologie",
        "Urologie",
        "Dermatologie",
        "Psychiatrie",
        "Rhumatologie",
        "Endocrinologie",
        "Néphrologie",
      ];

      const subjects = [
        "ACR",
        "ADP",
        "Anémies",
        "Arthrite septique",
        "AVC",
        "BPCO",
        "Bronchiolites du nourrisson",
        "Bronchopneumopathies chroniques obstructives",
        "Brûlures cutanées récentes",
        "Cancer du cavum",
        "Cancer du col de l'utérus",
        "Cancer du sein",
        "CBP",
        "CCR",
        "Céphalées",
        "Coma",
        "Contraception",
        "Déshydratations aiguës de l'enfant",
        "Diabète",
        "Diarrhées chroniques",
        "Douleurs thoraciques aiguës",
        "Dyslipidémies",
        "Dysphagies",
        "EDC",
        "EDC Septique",
        "Endocardites infectieuses",
        "Épilepsies",
        "États confusionnels",
        "Fractures ouvertes de la jambe",
        "GEU",
        "Hématuries",
        "Hémorragies digestives",
        "Hépatites virales",
        "HTA",
        "Hydatidoses hépatiques et pulmonaires",
        "Hypercalcémies",
        "Hyperthyroïdies",
        "Hypothyroïdies de l'enfant et de l'adulte",
        "Infections des voies aériennes supérieures",
        "Infections respiratoires basses communautaires",
        "Intoxications par le CO, les organophosphorés et les psychotropes",
        "IRA",
        "IRB",
        "ISA",
        "IST",
        "IU",
        "IVAS",
        "Lithiase urinaire",
        "Méningites bactériennes et virales",
        "Métrorragies",
        "MVTE",
        "Œdèmes",
        "Œil rouge",
        "OIA",
        "PEC douleur aigue",
        "Péritonites aiguës",
        "Polytraumatisme",
        "PR",
        "Prééclampsies et Éclampsies",
        "Purpuras",
        "Schizophrénie",
        "SCA",
        "Splénomégalies",
        "Transfusion sanguine",
        "Traumatisme crânien",
        "Troubles acido-basiques",
        "Troubles de l'hydratation, dyskaliémies",
        "Tumeurs de la prostate",
        "Vaccinations",
      ];

      const years = ["2022", "2023", "2024", "2025"];

      const faculties = [
        { id: "tunis", label: "FMT" },
        { id: "sousse", label: "FMS" },
        { id: "monastir", label: "FMM" },
        { id: "sfax", label: "FMSf" },
      ];

      const tags = [
        "Anatomie",
        "Physiologie",
        "Pharmacologie",
        "Clinique",
        "Biologie",
        "Épidémiologie",
      ];

      const questionTypes = ["QCM", "Cas clinique"];

      const handleReset = () => {
        setQuestionCount([20]);
        setSelectedStatus([]);
        setSelectedExams([]);
        setSelectedSpecialities([]);
        setSelectedSubjects([]);
        setSelectedYears([]);
        setSelectedFaculties([]);
        setSelectedTags([]);
        setSelectedQuestionTypes([]);
      };

      const toggleSelection = (
        value: string,
        selectedArray: string[],
        setSelectedArray: (values: string[]) => void,
      ) => {
        if (selectedArray.includes(value)) {
          setSelectedArray(
            selectedArray.filter((item) => item !== value),
          );
        } else {
          setSelectedArray([...selectedArray, value]);
        }
      };

      return (
        <div className="space-y-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => showView("")}
                  className="hidden md:flex"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold">
                  🎯 QCM à la Carte
                </h1>
              </div>
              <p className="text-muted-foreground">
                Créez des séries personnalisées avec des filtres
                avancés
              </p>
            </CardContent>
          </Card>

          {/* Filtres de Sélection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtres de Sélection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Nombre de questions */}
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Nombre de questions
                </h3>
                <div className="px-4">
                  <Slider
                    value={questionCount}
                    onValueChange={setQuestionCount}
                    max={150}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-2">
                    <span>5</span>
                    <span className="font-medium text-foreground">
                      {questionCount[0]} questions
                    </span>
                    <span>150+</span>
                  </div>
                </div>
              </div>

              {/* Statut */}
              <div className="space-y-4">
                <h3 className="font-semibold">Statut</h3>
                <div className="flex flex-wrap gap-4">
                  {statusOptions.map((status) => (
                    <div
                      key={status.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={status.id}
                        checked={selectedStatus.includes(
                          status.id,
                        )}
                        onCheckedChange={() =>
                          toggleSelection(
                            status.id,
                            selectedStatus,
                            setSelectedStatus,
                          )
                        }
                      />
                      <label
                        htmlFor={status.id}
                        className={`text-sm ${status.color} cursor-pointer`}
                      >
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Épreuve */}
              <div className="space-y-4">
                <h3 className="font-semibold">Épreuve</h3>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="j1"
                      checked={selectedExams.includes("j1")}
                      onCheckedChange={() =>
                        toggleSelection(
                          "j1",
                          selectedExams,
                          setSelectedExams,
                        )
                      }
                    />
                    <label
                      htmlFor="j1"
                      className="text-sm cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className="bg-green-50 text-green-700 border-green-200"
                      >
                        J1
                      </Badge>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="j2"
                      checked={selectedExams.includes("j2")}
                      onCheckedChange={() =>
                        toggleSelection(
                          "j2",
                          selectedExams,
                          setSelectedExams,
                        )
                      }
                    />
                    <label
                      htmlFor="j2"
                      className="text-sm cursor-pointer"
                    >
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        J2
                      </Badge>
                    </label>
                  </div>
                </div>
              </div>

              {/* Spécialité */}
              <div className="space-y-4">
                <h3 className="font-semibold">Spécialité</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {specialties.map((specialty) => (
                    <div
                      key={specialty}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`specialty-${specialty}`}
                        checked={selectedSpecialities.includes(
                          specialty,
                        )}
                        onCheckedChange={() =>
                          toggleSelection(
                            specialty,
                            selectedSpecialities,
                            setSelectedSpecialities,
                          )
                        }
                      />
                      <label
                        htmlFor={`specialty-${specialty}`}
                        className="text-sm cursor-pointer"
                      >
                        {specialty}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sujet */}
              <div className="space-y-4">
                <h3 className="font-semibold">Sujet</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {subjects.map((subject) => (
                    <div
                      key={subject}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`subject-${subject}`}
                        checked={selectedSubjects.includes(
                          subject,
                        )}
                        onCheckedChange={() =>
                          toggleSelection(
                            subject,
                            selectedSubjects,
                            setSelectedSubjects,
                          )
                        }
                      />
                      <label
                        htmlFor={`subject-${subject}`}
                        className="text-sm cursor-pointer"
                      >
                        {subject}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Année */}
              <div className="space-y-4">
                <h3 className="font-semibold">Année</h3>
                <div className="flex gap-4">
                  {years.map((year) => (
                    <div
                      key={year}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`year-${year}`}
                        checked={selectedYears.includes(year)}
                        onCheckedChange={() =>
                          toggleSelection(
                            year,
                            selectedYears,
                            setSelectedYears,
                          )
                        }
                      />
                      <label
                        htmlFor={`year-${year}`}
                        className="text-sm cursor-pointer"
                      >
                        {year}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faculté */}
              <div className="space-y-4">
                <h3 className="font-semibold">Faculté</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {faculties.map((faculty) => (
                    <div
                      key={faculty.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`faculty-${faculty.id}`}
                        checked={selectedFaculties.includes(
                          faculty.id,
                        )}
                        onCheckedChange={() =>
                          toggleSelection(
                            faculty.id,
                            selectedFaculties,
                            setSelectedFaculties,
                          )
                        }
                      />
                      <label
                        htmlFor={`faculty-${faculty.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {faculty.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-4">
                <h3 className="font-semibold">Tags</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {tags.map((tag) => (
                    <div
                      key={tag}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`tag-${tag}`}
                        checked={selectedTags.includes(tag)}
                        onCheckedChange={() =>
                          toggleSelection(
                            tag,
                            selectedTags,
                            setSelectedTags,
                          )
                        }
                      />
                      <label
                        htmlFor={`tag-${tag}`}
                        className="text-sm cursor-pointer"
                      >
                        {tag}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Type de Question */}
              <div className="space-y-4">
                <h3 className="font-semibold">
                  Type de Question
                </h3>
                <div className="flex gap-4">
                  {questionTypes.map((type) => (
                    <div
                      key={type}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`type-${type}`}
                        checked={selectedQuestionTypes.includes(
                          type,
                        )}
                        onCheckedChange={() =>
                          toggleSelection(
                            type,
                            selectedQuestionTypes,
                            setSelectedQuestionTypes,
                          )
                        }
                      />
                      <label
                        htmlFor={`type-${type}`}
                        className="text-sm cursor-pointer"
                      >
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  Réinitialiser
                </Button>
                <Button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto">
                  <Play className="h-4 w-4" />
                  Générer Série ({questionCount[0]} questions)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Configuration Actuelle et Aperçu Statistique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuration Actuelle</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Résumé de votre sélection de filtres
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <span className="font-medium">
                    Questions:
                  </span>{" "}
                  {questionCount[0]}
                </div>
                {selectedStatus.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Statut:</span>{" "}
                    {selectedStatus.join(", ")}
                  </div>
                )}
                {selectedExams.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">
                      Épreuves:
                    </span>{" "}
                    {selectedExams.join(", ").toUpperCase()}
                  </div>
                )}
                {selectedSpecialities.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">
                      Spécialités:
                    </span>{" "}
                    {selectedSpecialities
                      .slice(0, 3)
                      .join(", ")}
                    {selectedSpecialities.length > 3 &&
                      ` +${selectedSpecialities.length - 3} autres`}
                  </div>
                )}
                {selectedYears.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">Années:</span>{" "}
                    {selectedYears.join(", ")}
                  </div>
                )}
                {selectedFaculties.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium">
                      Facultés:
                    </span>{" "}
                    {selectedFaculties.length} sélectionnées
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu Statistique</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Distribution estimée selon vos filtres
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <StatCard
                    value="~2,450"
                    label="📚 Questions disponibles"
                  />
                  <StatCard
                    value="85%"
                    label="🎯 Taux de réussite moyen"
                  />
                  <StatCard
                    value="~45min"
                    label="⏱️ Durée estimée"
                  />
                  <StatCard
                    value="Modérée"
                    label="📈 Difficulté"
                    color="text-yellow-600"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }

    // Vue principale de l'entraînement
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-2">
              ✍️ Entraînement QCM
            </h1>
            <p className="text-muted-foreground">
              QCM et séries de 2022 à 2025 - Toutes facultés
            </p>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showView("series")}
          >
            <CardHeader>
              <CardTitle>📚 Par Séries</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Séries officielles organisées
                <br />
                J1/J2 → Spécialité → Cours → Année → Faculté
                <br />
                Format authentique
              </p>
              <Button className="w-full">
                SÉRIES <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showView("custom")}
          >
            <CardHeader>
              <CardTitle>🎯 QCM à la Carte</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Créez vos séries personnalisées
                <br />
                Filtres avancés
                <br />
                Nombre personnalisable
              </p>
              <Button className="w-full">
                PERSONNALISER{" "}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderOrganize = () => <OrganizePage />;

  const renderLearn = () => {
    // Données détaillées des cours
    const courseDetails = {
      "cardio-ccv": {
        title: "Cardiologie – Chirurgie cardio-vasculaire",
        icon: <Heart className="h-6 w-6 text-red-500" />,
        courses: [
          {
            number: "22",
            title: "Douleurs thoraciques",
            progress: 85,
            completed: true,
          },
          {
            number: "25",
            title: "Endocardite infectieuse",
            progress: 60,
            completed: false,
          },
          {
            number: "38",
            title: "Hypertension artérielle aiguë",
            progress: 90,
            completed: true,
          },
          {
            number: "49",
            title: "Ischémie aiguë du membre",
            progress: 45,
            completed: false,
          },
          {
            number: "51",
            title: "Maladies veineuses thromboemboliques",
            progress: 75,
            completed: false,
          },
          {
            number: "65",
            title: "Syndrome coronarien aigu",
            progress: 95,
            completed: true,
          },
        ],
      },
      chirurgie: {
        title: "Chirurgie générale",
        icon: "🏥",
        courses: [
          {
            number: "4",
            title: "Appendicite aiguë",
            progress: 80,
            completed: true,
          },
          {
            number: "15",
            title: "Cancer colo-rectal",
            progress: 35,
            completed: false,
          },
          {
            number: "34",
            title: "Hémorragies digestives",
            progress: 55,
            completed: false,
          },
          {
            number: "36",
            title: "Hydatidose",
            progress: 70,
            completed: false,
          },
          {
            number: "54",
            title: "Occlusion intestinale aiguë",
            progress: 25,
            completed: false,
          },
          {
            number: "57",
            title: "Péritonites aigues",
            progress: 40,
            completed: false,
          },
        ],
      },
      endocrino: {
        title: "Endocrinologie",
        icon: "🧬",
        courses: [
          {
            number: "20",
            title: "Diabète",
            progress: 90,
            completed: true,
          },
          {
            number: "23",
            title: "Dyslipémie",
            progress: 75,
            completed: false,
          },
          {
            number: "37",
            title: "Hypercalcémie",
            progress: 50,
            completed: false,
          },
          {
            number: "39",
            title: "Hyperthyroïdie",
            progress: 65,
            completed: false,
          },
          {
            number: "40",
            title: "Hypothyroïdie",
            progress: 80,
            completed: true,
          },
          {
            number: "47",
            title: "Insuffisance surrénalienne aiguë",
            progress: 30,
            completed: false,
          },
        ],
      },
      gastro: {
        title: "Gastro-entérologie",
        icon: "🫄",
        courses: [
          {
            number: "21",
            title: "Diarrhées chroniques",
            progress: 70,
            completed: false,
          },
          {
            number: "24",
            title: "Dysphagie",
            progress: 85,
            completed: true,
          },
          {
            number: "35",
            title: "Les hépatites virales",
            progress: 60,
            completed: false,
          },
          {
            number: "41",
            title: "Ictères",
            progress: 45,
            completed: false,
          },
          {
            number: "74",
            title: "Ulcère",
            progress: 90,
            completed: true,
          },
        ],
      },
      gyneco: {
        title: "Gynécologie – Obstétrique",
        icon: "👶",
        courses: [
          {
            number: "13",
            title: "Cancer du col utérin",
            progress: 85,
            completed: true,
            pdfUrl: "https://rhbxaluwjrwditkjebxi.supabase.co/storage/v1/object/sign/cours-communs/13_COL%20UTERIN%20%20%20%20mai%202025.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8zMTI3NDg1Ni0xZjZhLTRhMDctYWFlMy1jMjkzNDZjZmQ5YzciLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJjb3Vycy1jb21tdW5zLzEzX0NPTCBVVEVSSU4gICAgbWFpIDIwMjUucGRmIiwiaWF0IjoxNzYwODA3ODM1LCJleHAiOjE3OTIzNDM4MzV9.xkLgEmwSQfOVoU1fLF-kyn7Yk2j8wwiG3IIjOA2P7ag"
          },
          {
            number: "14",
            title: "Cancer du sein",
            progress: 75,
            completed: false,
          },
          {
            number: "18",
            title: "Contraception",
            progress: 95,
            completed: true,
          },
          {
            number: "32",
            title: "Grossesse extra-utérine",
            progress: 50,
            completed: false,
          },
          {
            number: "53",
            title: "Métrorragies",
            progress: 40,
            completed: false,
          },
          {
            number: "60",
            title: "Prééclampsie et éclampsie",
            progress: 65,
            completed: false,
          },
        ],
      },
      hemato: {
        title: "Hématologie",
        icon: "🩸",
        courses: [
          {
            number: "2",
            title: "Les adénopathies superficielles",
            progress: 55,
            completed: false,
          },
          {
            number: "3",
            title: "Anémies",
            progress: 80,
            completed: true,
          },
          {
            number: "62",
            title: "Purpura",
            progress: 35,
            completed: false,
          },
          {
            number: "64",
            title: "Splénomégalie",
            progress: 25,
            completed: false,
          },
          {
            number: "66",
            title: "Transfusion sanguine",
            progress: 70,
            completed: false,
          },
        ],
      },
    };

    // Données J1
    const j1Courses = [
      {
        icon: <Heart className="h-6 w-6 text-red-500" />,
        title: "Cardiologie – Chirurgie cardio-vasculaire",
        shortTitle: "Cardio-CCV",
        progress: "78%",
        chapters: "6 chapitres",
        key: "cardio-ccv",
      },
      {
        icon: "👶",
        title: "Gynécologie – Obstétrique",
        shortTitle: "Gynéco-Obs",
        progress: "65%",
        chapters: "6 chapitres",
        key: "gyneco",
      },
      {
        icon: <Brain className="h-6 w-6 text-purple-500" />,
        title: "Psychiatrie",
        shortTitle: "Psychiatrie",
        progress: "42%",
        chapters: "10 chapitres",
        key: "psychiatrie",
      },
      {
        icon: "🏥",
        title: "Chirurgie générale",
        shortTitle: "Chirurgie",
        progress: "38%",
        chapters: "6 chapitres",
        key: "chirurgie",
      },
      {
        icon: "🫄",
        title: "Gastro-entérologie",
        shortTitle: "Gastro",
        progress: "55%",
        chapters: "5 chapitres",
        key: "gastro",
      },
      {
        icon: <Brain className="h-6 w-6 text-blue-500" />,
        title: "Neurologie",
        shortTitle: "Neurologie",
        progress: "33%",
        chapters: "16 chapitres",
        key: "neurologie",
      },
      {
        icon: "👁️",
        title: "ORL – Ophtalmologie",
        shortTitle: "ORL-Ophta",
        progress: "47%",
        chapters: "11 chapitres",
        key: "orl-ophta",
      },
      {
        icon: (
          <Stethoscope className="h-6 w-6 text-green-500" />
        ),
        title: "Pneumologie",
        shortTitle: "Pneumo",
        progress: "72%",
        chapters: "9 chapitres",
        key: "pneumo",
      },
    ];

    // Données J2
    const j2Courses = [
      {
        icon: "🧬",
        title: "Endocrinologie",
        shortTitle: "Endocrino",
        progress: "62%",
        chapters: "6 chapitres",
        key: "endocrino",
      },
      {
        icon: "🦠",
        title: "Maladies infectieuses",
        shortTitle: "Infectieux",
        progress: "28%",
        chapters: "17 chapitres",
        key: "infectieux",
      },
      {
        icon: "🫘",
        title: "Néphrologie",
        shortTitle: "Néphro",
        progress: "44%",
        chapters: "10 chapitres",
        key: "nephro",
      },
      {
        icon: "🦴",
        title: "Orthopédie – Rhumatologie",
        shortTitle: "Ortho-Rhumato",
        progress: "36%",
        chapters: "20 chapitres",
        key: "ortho-rhumato",
      },
      {
        icon: "🚨",
        title: "Réanimation",
        shortTitle: "Réanimation",
        progress: "58%",
        chapters: "8 chapitres",
        key: "reanimation",
      },
      {
        icon: "🩸",
        title: "Hématologie",
        shortTitle: "Hémato",
        progress: "41%",
        chapters: "5 chapitres",
        key: "hemato",
      },
      {
        icon: "👶",
        title: "Pédiatrie",
        shortTitle: "Pédiatrie",
        progress: "67%",
        chapters: "22 chapitres",
        key: "pediatrie",
      },
      {
        icon: "🫸",
        title: "Urologie",
        shortTitle: "Urologie",
        progress: "29%",
        chapters: "9 chapitres",
        key: "urologie",
      },
    ];

    // Vue détail d'une spécialité
    if (currentView.startsWith("specialty-")) {
      const specialtyKey = currentView.replace(
        "specialty-",
        "",
      );
      const specialty = courseDetails[specialtyKey];

      if (!specialty) {
        return (
          <div className="text-center p-8">
            <p>Spécialité non trouvée</p>
            <Button onClick={() => showView("cours-communs")}>
              Retour
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => showView("cours-communs")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-2xl">{specialty.icon}</div>
                <h1 className="text-2xl font-semibold">
                  {specialty.title}
                </h1>
              </div>
              <p className="text-muted-foreground">
                Cours disponibles • PDF interactifs imprimables
                • Surligneur et notes • Ask AI intégré
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {specialty.courses.map((course, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                        <span className="font-bold text-primary">
                          {course.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            📖 Progress: {course.progress}%
                          </span>
                          {course.completed && (
                            <span className="text-success">
                              ✅ Terminé
                            </span>
                          )}
                        </div>
                        <Progress
                          value={course.progress}
                          className="mt-2 w-48"
                        />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {course.pdfUrl && (
                        <Button
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(course.pdfUrl, '_blank');
                          }}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          PDF
                        </Button>
                      )}
                      {course.completed ? (
                        <Button variant="outline">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          RÉVISER
                        </Button>
                      ) : (
                        <Button>
                          <Play className="h-4 w-4 mr-2" />
                          {course.progress > 0
                            ? "CONTINUER"
                            : "COMMENCER"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistiques de la spécialité */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                📊 Progression de la spécialité
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  value={specialty.courses.length.toString()}
                  label="📚 Chapitres total"
                />
                <StatCard
                  value={specialty.courses
                    .filter((c) => c.completed)
                    .length.toString()}
                  label="✅ Terminés"
                  color="text-success"
                />
                <StatCard
                  value={
                    Math.round(
                      specialty.courses.reduce(
                        (acc, c) => acc + c.progress,
                        0,
                      ) / specialty.courses.length,
                    ) + "%"
                  }
                  label="📈 Progression moy."
                />
                <StatCard
                  value={specialty.courses
                    .filter(
                      (c) => c.progress > 0 && !c.completed,
                    )
                    .length.toString()}
                  label="🔄 En cours"
                  color="text-accent"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (currentView === "cours-communs") {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => showView("")}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-2xl font-semibold">
                  📖 Cours Communs
                </h1>
              </div>
              <p className="text-muted-foreground">
                PDF interactifs imprimables • Surligneur et
                notes • Ask AI intégré
              </p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-14">
              <TabsTrigger value="j1" className="text-base">
                Jour 1
              </TabsTrigger>
              <TabsTrigger value="j2" className="text-base">
                Jour 2
              </TabsTrigger>
            </TabsList>

            <TabsContent value="j1" className="space-y-4">
              <div className="grid gap-4">
                {j1Courses.map((course, index) => (
                  <CourseCard
                    key={index}
                    icon={course.icon}
                    title={course.title}
                    progress={`📖 ${course.progress}`}
                    chapters={course.chapters}
                    onClick={() =>
                      showView(`specialty-${course.key}`)
                    }
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="j2" className="space-y-4">
              <div className="grid gap-4">
                {j2Courses.map((course, index) => (
                  <CourseCard
                    key={index}
                    icon={course.icon}
                    title={course.title}
                    progress={`📖 ${course.progress}`}
                    chapters={course.chapters}
                    onClick={() =>
                      showView(`specialty-${course.key}`)
                    }
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    // Vue résumés d'une spécialité
    if (currentView.startsWith("resume-")) {
      const specialtyKey = currentView.replace("resume-", "");
      const specialty = courseDetails[specialtyKey];

      if (!specialty) {
        return (
          <div className="text-center p-8">
            <p>Résumés non disponibles pour cette spécialité</p>
            <Button onClick={() => showView("resumes")}>
              Retour
            </Button>
          </div>
        );
      }

      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => showView("resumes")}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour aux résumés
                </Button>
                <div className="text-2xl">{specialty.icon}</div>
                <h1 className="text-2xl font-semibold">
                  ⭐ {specialty.title} - Résumés By HM
                </h1>
              </div>
              <p className="text-muted-foreground">
                Format condensé • Consultation uniquement •
                Organisé par parties • Non imprimable
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {specialty.courses.map((course, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-lg">
                        <span className="font-bold text-accent">
                          {course.number}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">
                          {course.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>⭐ Résumé condensé</span>
                          <span>📄 Lecture seule</span>
                          <span>🚫 Non imprimable</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline">
                      <FileText className="h-4 w-4 mr-2" />
                      CONSULTER
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      );
    }

    if (currentView === "resumes") {
      return (
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Button
                  variant="outline"
                  onClick={() => showView("")}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Retour
                </Button>
                <h1 className="text-2xl font-semibold">
                  ⭐ Résumés By HM
                </h1>
              </div>
              <p className="text-muted-foreground">
                Format condensé • Consultation uniquement •
                Organisé par parties • Non imprimable
              </p>
            </CardContent>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="j1">Jour 1 (J1)</TabsTrigger>
              <TabsTrigger value="j2">Jour 2 (J2)</TabsTrigger>
            </TabsList>

            <TabsContent value="j1" className="space-y-4">
              <div className="grid gap-4">
                {j1Courses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() =>
                      course.key && courseDetails[course.key]
                        ? showView(`resume-${course.key}`)
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {course.icon}
                      </div>
                      <div>
                        <p className="font-medium">
                          {course.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ Résumé condensé • Lecture seule
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">CONSULTER</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="j2" className="space-y-4">
              <div className="grid gap-4">
                {j2Courses.map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors"
                    onClick={() =>
                      course.key && courseDetails[course.key]
                        ? showView(`resume-${course.key}`)
                        : {}
                    }
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {course.icon}
                      </div>
                      <div>
                        <p className="font-medium">
                          {course.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          ⭐ Résumé condensé • Lecture seule
                        </p>
                      </div>
                    </div>
                    <Button variant="outline">CONSULTER</Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-semibold mb-2">
              📚 Bibliothèque de Cours
            </h1>
            <p className="text-muted-foreground">
              Accédez à tous les cours organisés par journal et
              spécialité
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showView("cours-communs")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Cours Communs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <p>
                  <strong>16 spécialités disponibles</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• J1: 8 spécialités</div>
                  <div>• J2: 8 spécialités</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  PDF interactifs imprimables
                  <br />
                  Surligneur et notes
                  <br />
                  Ask AI intégré
                </div>
              </div>
              <Button className="w-full">
                EXPLORER <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => showView("resumes")}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                ⭐ Résumés By HM
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-4">
                <p>
                  <strong>16 spécialités disponibles</strong>
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                  <div>• J1: 8 spécialités</div>
                  <div>• J2: 8 spécialités</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Format condensé
                  <br />
                  Consultation uniquement
                  <br />
                  Non imprimable
                </div>
              </div>
              <Button className="w-full">
                EXPLORER <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (currentSection) {
      case "dashboard":
        return renderDashboard();
      case "learn":
        return renderLearn();
      case "organize":
        return renderOrganize();
      case "train":
        return renderTrain();
      case "exam":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-semibold mb-2">
                  🏆 Examens Blancs
                </h1>
                <p className="text-muted-foreground">
                  Examens blancs officiels de toutes les
                  facultés (2022-2025)
                </p>
              </CardContent>
            </Card>

            {/* Facultés Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculté de Tunis */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Faculté de Tunis
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        2022-2025
                      </p>
                    </div>
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      Élevée
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>15 examens</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>3h 30min</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>

              {/* Faculté de Sousse */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Faculté de Sousse
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        2022-2025
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Modérée
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>14 examens</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>3h 15min</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>

              {/* Faculté de Sfax */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Faculté de Sfax
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        2022-2025
                      </p>
                    </div>
                    <Badge
                      variant="destructive"
                      className="bg-red-100 text-red-700 border-red-200"
                    >
                      Élevée
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>16 examens</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>3h 45min</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>

              {/* Faculté de Monastir */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        Faculté de Monastir
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        2022-2025
                      </p>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Modérée
                    </Badge>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>13 examens</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>3h 20min</span>
                    </div>
                  </div>

                  <Button className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Commencer
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Aperçu des Examens Blancs */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  Aperçu des Examens Blancs
                </h2>
                <p className="text-muted-foreground mb-6">
                  Statistiques générales de vos performances
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      12
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Examens passés
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-success mb-2">
                      78%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Score moyen
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">
                      42h
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Temps total
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      85%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Meilleur score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "stats":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-semibold mb-2">
                  📊 Tableau de Bord Statistiques
                </h1>
                <p className="text-muted-foreground mb-6">
                  Analysez votre progression et comparez vos
                  performances
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatCard
                    value="24h"
                    label="⏱️ Étude ce mois"
                  />
                  <StatCard
                    value="127"
                    label="✍️ QCM semaine"
                  />
                  <StatCard
                    value="16.5/20"
                    label="🎯 Moyenne générale"
                  />
                  <StatCard
                    value="🔥 7"
                    label="Jours consécutifs"
                    color="text-orange-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "blog":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-semibold mb-2">
                  📝 Blog Médical QE.tn
                </h1>
                <p className="text-muted-foreground">
                  Articles, conseils et actualités pour les
                  étudiants en médecine tunisiens
                </p>
              </CardContent>
            </Card>

            {/* Articles récents */}
            <div className="grid gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Heart className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <Badge className="mb-2">
                        Cardiologie
                      </Badge>
                      <h3 className="font-semibold mb-2">
                        Guide complet : Syndrome coronarien aigu
                        en 2024
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Découvrez les dernières recommandations
                        pour le diagnostic et la prise en charge
                        du SCA selon les guidelines européens...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 15 Dec 2024</span>
                        <span>⏱️ 8 min de lecture</span>
                        <span>👁️ 1,245 vues</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-success/10 rounded-lg flex items-center justify-center">
                      <Brain className="h-8 w-8 text-success" />
                    </div>
                    <div className="flex-1">
                      <Badge
                        variant="secondary"
                        className="mb-2"
                      >
                        Méthodes d'étude
                      </Badge>
                      <h3 className="font-semibold mb-2">
                        Techniques de mémorisation pour les
                        étudiants en médecine
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Comment optimiser votre apprentissage
                        avec les techniques de répétition
                        espacée et les mnémotechniques
                        adaptées...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 12 Dec 2024</span>
                        <span>⏱️ 12 min de lecture</span>
                        <span>👁️ 2,156 vues</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className="w-32 h-24 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Trophy className="h-8 w-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <Badge variant="outline" className="mb-2">
                        Examens
                      </Badge>
                      <h3 className="font-semibold mb-2">
                        Stratégies pour réussir les examens J1
                        et J2 en Tunisie
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Conseils pratiques et retours
                        d'expérience d'anciens étudiants pour
                        optimiser votre préparation aux
                        examens...
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>📅 10 Dec 2024</span>
                        <span>⏱️ 15 min de lecture</span>
                        <span>👁️ 3,892 vues</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Catégories populaires */}
            <Card>
              <CardHeader>
                <CardTitle>🏷️ Catégories Populaires</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Cardiologie
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Méthodes d'étude
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Examens
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Pneumologie
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Conseils pratiques
                  </Badge>
                  <Badge
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                  >
                    Actualités médicales
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      case "settings":
        return (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h1 className="text-2xl font-semibold mb-2">
                  ⚙️ Paramètres
                </h1>
                <p className="text-muted-foreground">
                  Personnalisez votre expérience d'apprentissage
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>👤 Profil Utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  <strong>Dr. Sarah</strong>
                  <br />
                  📧 sarah@email.com
                  <br />
                  🎓 Externe en médecine
                </p>
                <Button>MODIFIER PROFIL</Button>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return renderDashboard();
    }
  };

  // Afficher la page d'accueil
  if (currentPage === "home" || currentPage === "menu") {
    return <SimpleHomePage onNavigate={setCurrentPage} />;
  }

  // Afficher la page de login/inscription
  if (currentPage === "login") {
    return <SimpleLoginPage onNavigate={setCurrentPage} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`bg-card border-b border-border px-4 md:px-6 py-3 md:py-4 sticky top-0 z-50 backdrop-blur transition-transform duration-300 ${showHeader ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="flex items-center justify-between gap-2 md:gap-0">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <LogoComponent />

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher cours, QCM, termes médicaux..."
                className="pl-10 bg-input-background"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Mobile Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-white flex items-center justify-center text-[10px]">
                3
              </span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
            >
              {getThemeIcon()}
            </Button>
            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger className="hidden md:flex items-center gap-2 cursor-pointer">
                <Avatar>
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
                <span className="font-medium">Sarah</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentSection("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentSection("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage("home")} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Mobile Avatar Only */}
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden">
                <Avatar>
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentSection("profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setCurrentSection("settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setCurrentPage("home")} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Mobile Menu Sheet */}
      <Sheet
        open={mobileMenuOpen}
        onOpenChange={setMobileMenuOpen}
      >
        <SheetContent side="left" className="w-64 p-0">
          <SheetHeader className="p-4 border-b border-border">
            <SheetTitle>
              <LogoComponent />
            </SheetTitle>
            <SheetDescription className="sr-only">
              Navigation principale de la plateforme QE.tn
            </SheetDescription>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <NavigationMenu isMobile={true} />
          </div>
        </SheetContent>
      </Sheet>

      <div className="flex">
        {/* Desktop Sidebar - Caché sur mobile */}
        <nav
          className={`hidden md:block ${sidebarCollapsed ? "w-16" : "w-64"} bg-sidebar border-r border-sidebar-border h-[calc(100vh-80px)] sticky top-[80px] overflow-y-auto transition-all duration-300 relative`}
        >
          {/* Toggle Button - 5mm distance from right edge */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-5 top-2 z-10 w-6 h-6 bg-transparent border-transparent rounded-md hover:bg-accent hover:border-accent hover:shadow-sm transition-all duration-300 flex items-center justify-center group"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-3 w-3 group-hover:text-accent-foreground" />
            ) : (
              <ChevronLeft className="h-3 w-3 group-hover:text-accent-foreground" />
            )}
          </Button>

          <div className="space-y-1 p-4 pt-10">
            <Button
              variant={
                currentSection === "dashboard"
                  ? "default"
                  : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("dashboard")}
              title={sidebarCollapsed ? "Accueil" : ""}
            >
              <Home className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">Accueil</span>
              )}
            </Button>

            {!sidebarCollapsed && (
              <div className="h-px bg-border my-4" />
            )}

            {/* Apprendre avec sous-menu */}
            <div>
              <Button
                variant={
                  currentSection === "learn"
                    ? "default"
                    : "ghost"
                }
                className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-between"}`}
                onClick={() => {
                  if (sidebarCollapsed) {
                    showSection("learn");
                  } else {
                    setLearnExpanded(!learnExpanded);
                  }
                }}
                title={sidebarCollapsed ? "Apprendre" : ""}
              >
                <div className="flex items-center">
                  <BookOpen className="h-4 w-4" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">Apprendre</span>
                  )}
                </div>
                {!sidebarCollapsed &&
                  (learnExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  ))}
              </Button>

              {learnExpanded && !sidebarCollapsed && (
                <div className="ml-4 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setCurrentSection("learn");
                      setCurrentView("cours-communs");
                    }}
                  >
                    <span className="ml-3">Cours Communs</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setCurrentSection("learn");
                      setCurrentView("resumes");
                    }}
                  >
                    <span className="ml-3">Résumé By HM</span>
                  </Button>
                </div>
              )}
            </div>

            <Button
              variant={
                currentSection === "organize"
                  ? "default"
                  : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("organize")}
              title={sidebarCollapsed ? "S'organiser" : ""}
            >
              <Calendar className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">S'organiser</span>
              )}
            </Button>

            {/* S'entraîner avec sous-menu */}
            <div>
              <Button
                variant={
                  currentSection === "train"
                    ? "default"
                    : "ghost"
                }
                className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-between"}`}
                onClick={() => {
                  if (sidebarCollapsed) {
                    showSection("train");
                  } else {
                    setTrainExpanded(!trainExpanded);
                  }
                }}
                title={sidebarCollapsed ? "S'entraîner" : ""}
              >
                <div className="flex items-center">
                  <PenTool className="h-4 w-4" />
                  {!sidebarCollapsed && (
                    <span className="ml-3">S'entraîner</span>
                  )}
                </div>
                {!sidebarCollapsed &&
                  (trainExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  ))}
              </Button>

              {trainExpanded && !sidebarCollapsed && (
                <div className="ml-4 mt-1 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setCurrentSection("train");
                      setCurrentView("series");
                    }}
                  >
                    <span className="ml-3">QCM par Séries</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => {
                      setCurrentSection("train");
                      setCurrentView("custom");
                    }}
                  >
                    <span className="ml-3">QCM à la Carte</span>
                  </Button>
                </div>
              )}
            </div>
            <Button
              variant={
                currentSection === "exam" ? "default" : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("exam")}
              title={sidebarCollapsed ? "S'examiner" : ""}
            >
              <Trophy className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">S'examiner</span>
              )}
            </Button>
            <Button
              variant={
                currentSection === "stats" ? "default" : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("stats")}
              title={sidebarCollapsed ? "Mes Stats" : ""}
            >
              <BarChart3 className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">Mes Stats</span>
              )}
            </Button>

            {!sidebarCollapsed && (
              <div className="h-px bg-border my-4" />
            )}

            <Button
              variant={
                currentSection === "blog" ? "default" : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("blog")}
              title={sidebarCollapsed ? "Blog" : ""}
            >
              <FileText className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">Blog</span>
              )}
            </Button>

            <Button
              variant={
                currentSection === "settings"
                  ? "default"
                  : "ghost"
              }
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              onClick={() => showSection("settings")}
              title={sidebarCollapsed ? "Paramètres" : ""}
            >
              <Settings className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">Paramètres</span>
              )}
            </Button>
            <Button
              variant="ghost"
              className={`w-full ${sidebarCollapsed ? "justify-center px-0" : "justify-start"}`}
              title={sidebarCollapsed ? "Aide & Support" : ""}
            >
              <HelpCircle className="h-4 w-4" />
              {!sidebarCollapsed && (
                <span className="ml-3">Aide & Support</span>
              )}
            </Button>
          </div>
        </nav>

        {/* Main Content */}
        <main 
          className="flex-1 p-4 md:p-8 bg-secondary/30"
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