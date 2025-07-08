import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@/store/userStore';
import { cn } from '@/lib/utils';
import { 
  Calculator, 
  Shapes, 
  Clock, 
  Minus, 
  Plus, 
  X, 
  Divide,
  PieChart,
  BarChart3,
  TrendingUp,
  Brain,
  Ruler
} from 'lucide-react';

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  difficulty: 'easy' | 'medium' | 'hard';
  ageGroup: '5-7' | '8-10' | '10-13';
  status: 'not-started' | 'in-progress' | 'completed';
  responsible: string;
  route?: string;
}

const learningTopics: LearningTopic[] = [
  // Age 5-7
  {
    id: 'addition-1-10',
    title: 'Addition 1-10',
    description: 'Learn basic addition with visual counting',
    icon: Plus,
    difficulty: 'easy',
    ageGroup: '5-7',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'addition-10-50',
    title: 'Addition 10-50',
    description: 'Addition with larger numbers',
    icon: Plus,
    difficulty: 'easy',
    ageGroup: '5-7',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'subtraction-1-10',
    title: 'Subtraction 1-10',
    description: 'Learn basic subtraction with visual objects',
    icon: Minus,
    difficulty: 'easy',
    ageGroup: '5-7',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'shapes-1',
    title: 'Shapes and Measurement 1',
    description: 'Circles, squares, sort shapes by sides and corners',
    icon: Shapes,
    difficulty: 'easy',
    ageGroup: '5-7',
    status: 'not-started',
    responsible: 'Ion'
  },
  {
    id: 'time-money-1',
    title: 'Time and Money 1',
    description: 'Tell time and understand money basics',
    icon: Clock,
    difficulty: 'easy',
    ageGroup: '5-7',
    status: 'not-started',
    responsible: 'Fred'
  },
  
  // Age 8-10
  {
    id: 'multiplication-1',
    title: 'Multiplication 1',
    description: '1x1 digit multiplication with visual methods',
    icon: X,
    difficulty: 'medium',
    ageGroup: '8-10',
    status: 'in-progress',
    responsible: 'Fred',
    route: '/box'
  },
  {
    id: 'multiplication-2',
    title: 'Multiplication 2',
    description: 'One x two-digit multiplication',
    icon: X,
    difficulty: 'medium',
    ageGroup: '8-10',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'division-1',
    title: 'Division 1',
    description: '1x two digits division',
    icon: Divide,
    difficulty: 'medium',
    ageGroup: '8-10',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'fractions-1',
    title: 'Fractions 1',
    description: 'Basic intro with pie charts ½, ⅓ and more',
    icon: PieChart,
    difficulty: 'medium',
    ageGroup: '8-10',
    status: 'not-started',
    responsible: 'Ion'
  },
  
  // Age 10-13
  {
    id: 'fractions-2',
    title: 'Fractions 2',
    description: 'Add/subtract like and unlike fractions with models',
    icon: PieChart,
    difficulty: 'hard',
    ageGroup: '10-13',
    status: 'not-started',
    responsible: 'Ion'
  },
  {
    id: 'negative-numbers',
    title: 'Negative Numbers',
    description: 'What is -1 and how to add and subtract with them',
    icon: Minus,
    difficulty: 'hard',
    ageGroup: '10-13',
    status: 'not-started',
    responsible: 'Fred'
  },
  {
    id: 'equations-1',
    title: 'Equations 1',
    description: 'Build expressions with algebra tiles',
    icon: Calculator,
    difficulty: 'hard',
    ageGroup: '10-13',
    status: 'not-started',
    responsible: 'Ion'
  },
  {
    id: 'statistics-1',
    title: 'Statistics 1',
    description: 'Simulate spinners and dice rolls',
    icon: BarChart3,
    difficulty: 'hard',
    ageGroup: '10-13',
    status: 'not-started',
    responsible: 'Fred'
  }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<'5-7' | '8-10' | '10-13' | 'all'>('all');
  const { userModel } = useUserStore();

  const filteredTopics = selectedAgeGroup === 'all' 
    ? learningTopics 
    : learningTopics.filter(topic => topic.ageGroup === selectedAgeGroup);

  const handleTopicClick = (topic: LearningTopic) => {
    if (topic.route) {
      navigate(topic.route);
    } else {
      // For now, show a message that the topic is coming soon
      console.log(`${topic.title} - Coming soon!`);
    }
  };

  const getStatusColor = (status: LearningTopic['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAgeGroupColor = (ageGroup: LearningTopic['ageGroup']) => {
    switch (ageGroup) {
      case '5-7': return 'bg-yellow-100 text-yellow-800';
      case '8-10': return 'bg-orange-100 text-orange-800';
      case '10-13': return 'bg-purple-100 text-purple-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Math Learning Journey
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visual learning for every age
          </p>
        </header>

        {/* Age Group Filter */}
        <div className="flex justify-center gap-4 mb-8">
          {['all', '5-7', '8-10', '10-13'].map((age) => (
            <Button
              key={age}
              variant={selectedAgeGroup === age ? 'default' : 'outline'}
              onClick={() => setSelectedAgeGroup(age as any)}
              className="px-6 py-2"
            >
              {age === 'all' ? 'All Ages' : `Age ${age}`}
            </Button>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTopics.map((topic) => {
            const Icon = topic.icon;
            return (
              <Card 
                key={topic.id} 
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105",
                  topic.status === 'completed' && "ring-2 ring-green-200",
                  topic.status === 'in-progress' && "ring-2 ring-blue-200"
                )}
                onClick={() => handleTopicClick(topic)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <Icon className="h-8 w-8 text-blue-600" />
                    <Badge className={getAgeGroupColor(topic.ageGroup)}>
                      {topic.ageGroup}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {topic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    {topic.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge className={getStatusColor(topic.status)}>
                      {topic.status.replace('-', ' ')}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      by {topic.responsible}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Progress Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {learningTopics.filter(t => t.status === 'completed').length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <Badge className="bg-blue-100 text-blue-800">
                    {learningTopics.filter(t => t.status === 'in-progress').length}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Not Started:</span>
                  <Badge className="bg-gray-100 text-gray-800">
                    {learningTopics.filter(t => t.status === 'not-started').length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Current Focus</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <X className="h-12 w-12 mx-auto mb-2 text-blue-600" />
              <p className="font-semibold">Multiplication 1</p>
              <p className="text-sm text-gray-600">Box Method Learning</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Next Up</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <Divide className="h-12 w-12 mx-auto mb-2 text-orange-600" />
              <p className="font-semibold">Division 1</p>
              <p className="text-sm text-gray-600">Coming Soon</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;