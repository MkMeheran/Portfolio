import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Code,
  Map,
  Languages,
  Trophy,
  Target,
  TrendingUp,
  Calendar,
  Flame,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { placeholderLearningStats } from "@/lib/placeholders";

export const metadata: Metadata = {
  title: "Progress Dashboard",
  description: "Track my learning journey and daily progress.",
};

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  leetcode: Code,
  gis_projects: Map,
  language: Languages,
  kaggle: Trophy,
};

const colorMap: Record<string, { color: string; bgColor: string }> = {
  leetcode: {
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/30",
  },
  gis_projects: {
    color: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  language: {
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
  },
  kaggle: {
    color: "text-cyan-600",
    bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
  },
};

const weeklyGoals = [
  { task: "Complete 1 GIS Map Project", completed: true },
  { task: "Solve 5 LeetCode Problems", completed: true },
  { task: "Write 1 Blog Post", completed: false },
  { task: "Practice German (30 min/day)", completed: true },
  { task: "Study for CGPA improvement", completed: false },
];

// Generate mock streak data for the last 12 weeks
const generateStreakData = () => {
  const data = [];
  for (let week = 0; week < 12; week++) {
    for (let day = 0; day < 7; day++) {
      // Random activity level 0-4
      const level = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
      data.push(level);
    }
  }
  return data;
};

const streakData = generateStreakData();

function StatCard({
  stat,
}: {
  stat: typeof mockLearningStats[0];
}) {
  const Icon = iconMap[stat.type] || Code;
  const colors = colorMap[stat.type] || colorMap.leetcode;
  const percentage = stat.target ? Math.round((stat.current / stat.target) * 100) : 0;

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colors.bgColor} group-hover:scale-110 transition-transform`}>
            <Icon className={`h-6 w-6 ${colors.color}`} />
          </div>
          <Badge variant="outline" className="text-xs font-medium">
            {stat.label || `${stat.current}/${stat.target}`}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="font-semibold mb-3">{stat.name}</h3>
        <div className="space-y-2">
          <Progress value={percentage} className="h-2.5" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{percentage}% complete</span>
            <span className="flex items-center gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {stat.streak || 0} day streak
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StreakCalendar() {
  const levelColors = [
    "bg-muted",
    "bg-emerald-200 dark:bg-emerald-900",
    "bg-emerald-300 dark:bg-emerald-800",
    "bg-emerald-400 dark:bg-emerald-700",
    "bg-emerald-500 dark:bg-emerald-600",
  ];

  return (
    <div className="flex flex-wrap gap-1">
      {streakData.map((level, index) => (
        <div
          key={index}
          className={`w-3 h-3 rounded-sm ${levelColors[level]} transition-colors hover:ring-2 hover:ring-primary/50`}
          title={`Activity level: ${level}`}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  // Calculate overall stats
  const totalProgress = placeholderLearningStats.reduce((acc, stat) => {
    return acc + (stat.current / stat.target) * 100;
  }, 0) / placeholderLearningStats.length;

  const completedGoals = weeklyGoals.filter(g => g.completed).length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mx-auto max-w-3xl text-center mb-12">
        <Badge variant="outline" className="mb-4">Continuous Learning</Badge>
        <h1 className="text-4xl font-bold mb-4">Progress Dashboard</h1>
        <p className="text-lg text-muted-foreground">
          Tracking my daily learning journey towards academic excellence and career goals.
          Updated regularly to maintain accountability and show growth.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-12">
        {/* Quick Stats Summary */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">
                  {Math.round(totalProgress)}%
                </div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border-emerald-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-1">
                  {completedGoals}/{weeklyGoals.length}
                </div>
                <p className="text-sm text-muted-foreground">Weekly Goals</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-500/20">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-1 flex items-center justify-center gap-1">
                  <Flame className="h-7 w-7" />
                  14
                </div>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Learning Stats</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {placeholderLearningStats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
            ))}
          </div>
        </section>

        {/* Weekly Goals */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Target className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Weekly Goals</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                This Week&apos;s Targets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {weeklyGoals.map((goal, index) => (
                  <li key={index} className="flex items-center gap-3 group">
                    {goal.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <span
                      className={
                        goal.completed
                          ? "line-through text-muted-foreground"
                          : "group-hover:text-primary transition-colors"
                      }
                    >
                      {goal.task}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* Streak Calendar */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Activity Streak</h2>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Last 12 Weeks</span>
                <div className="flex items-center gap-2 text-xs font-normal text-muted-foreground">
                  <span>Less</span>
                  <div className="flex gap-0.5">
                    {[0, 1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`w-3 h-3 rounded-sm ${
                          level === 0
                            ? "bg-muted"
                            : level === 1
                            ? "bg-emerald-200 dark:bg-emerald-900"
                            : level === 2
                            ? "bg-emerald-300 dark:bg-emerald-800"
                            : level === 3
                            ? "bg-emerald-400 dark:bg-emerald-700"
                            : "bg-emerald-500 dark:bg-emerald-600"
                        }`}
                      />
                    ))}
                  </div>
                  <span>More</span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <StreakCalendar />
            </CardContent>
          </Card>
        </section>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="py-6">
            <div className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">About This Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  This dashboard tracks my daily learning activities including LeetCode
                  problem-solving, weekly GIS projects, German language learning, and
                  academic progress. All data can be managed through the admin panel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
