import React from 'react';
import { FolderOpen, Clock, CheckCircle, AlertCircle, Calendar, Users, BarChart3 } from 'lucide-react';

const ClientProjects: React.FC = () => {
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of company website with SEO optimization',
      status: 'in-progress',
      progress: 65,
      startDate: '2024-01-10',
      endDate: '2024-02-28',
      team: ['Sarah Johnson', 'Mike Chen'],
      tasks: [
        { name: 'Wireframes', status: 'completed' },
        { name: 'Design', status: 'completed' },
        { name: 'Development', status: 'in-progress' },
        { name: 'Content Migration', status: 'pending' },
        { name: 'Testing', status: 'pending' }
      ]
    },
    {
      id: 2,
      name: 'PPC Campaign Q1',
      description: 'Google and Facebook ads campaign for Q1 product launch',
      status: 'in-progress',
      progress: 40,
      startDate: '2024-01-15',
      endDate: '2024-03-31',
      team: ['Emily Rodriguez'],
      tasks: [
        { name: 'Keyword Research', status: 'completed' },
        { name: 'Ad Copy Creation', status: 'completed' },
        { name: 'Campaign Setup', status: 'in-progress' },
        { name: 'A/B Testing', status: 'pending' },
        { name: 'Performance Optimization', status: 'pending' }
      ]
    },
    {
      id: 3,
      name: 'Content Calendar',
      description: 'Social media and blog content calendar for Q1',
      status: 'completed',
      progress: 100,
      startDate: '2023-12-01',
      endDate: '2023-12-31',
      team: ['David Wilson', 'Sarah Johnson'],
      tasks: [
        { name: 'Topic Research', status: 'completed' },
        { name: 'Content Planning', status: 'completed' },
        { name: 'Content Creation', status: 'completed' },
        { name: 'Publishing Schedule', status: 'completed' },
        { name: 'Performance Analysis', status: 'completed' }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'delayed': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Active Projects</h2>
        <p className="text-gray-600">Track the progress of your marketing projects</p>
      </div>

      {/* Projects Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Total Projects</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-signal-blue to-blue-600 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">{projects.length}</div>
          <p className="text-sm text-gray-600">Active and completed</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-beacon-orange to-orange-600 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {projects.filter(p => p.status === 'in-progress').length}
          </div>
          <p className="text-sm text-gray-600">Currently active</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {projects.filter(p => p.status === 'completed').length}
          </div>
          <p className="text-sm text-gray-600">Successfully delivered</p>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-signal-blue to-beacon-orange rounded-lg flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.description}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(project.status)}`}>
                  {project.status.replace('-', ' ')}
                </span>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Progress</span>
                  <span className="text-sm font-bold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-signal-blue to-beacon-orange h-2 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Timeline</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.startDate} - {project.endDate}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Team</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.team.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Tasks</p>
                    <p className="text-sm font-medium text-gray-900">
                      {project.tasks.filter(t => t.status === 'completed').length} / {project.tasks.length} completed
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Tasks</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.tasks.map((task, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                      {getTaskStatusIcon(task.status)}
                      <span className="text-sm text-gray-700">{task.name}</span>
                      <span className={`ml-auto text-xs font-medium capitalize ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientProjects;