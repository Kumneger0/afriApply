import type { FC } from 'hono/jsx';

type ProjectsSectionProps = {
  projects?: Array<{ name: string; description: string; link?: string }>;
};

export const ProjectsSection: FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <div class="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden">
      <div class="bg-gradient-to-r from-green-600/20 to-emerald-600/20 px-8 py-6 border-b border-gray-700/50">
        <h2 class="text-2xl font-bold text-white flex items-center">
          <span class="mr-3">🚀</span>
          Projects
        </h2>
        <p class="text-gray-300 mt-1">Personal and professional projects you've worked on</p>
      </div>
      
      <div class="p-8">
        <div class="space-y-6" id="projects-container">
          {projects && projects.length > 0 ? (
            projects.map(project => (
              <div class="project-entry bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                <div class="mb-4">
                  <input 
                    type="text" 
                    name="project_name[]" 
                    value={project.name} 
                    placeholder="Project Name"
                    class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400" 
                  />
                </div>
                <div class="mb-4">
                  <textarea 
                    name="project_description[]" 
                    placeholder="Describe the project, technologies used, and your role..." 
                    rows={3}
                    class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
                  >
                    {project.description}
                  </textarea>
                </div>
                <input 
                  type="url" 
                  name="project_link[]" 
                  value={project.link || ''} 
                  placeholder="Project link (GitHub, live demo, etc.) - Optional"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
            ))
          ) : (
            <div class="project-entry bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
              <div class="mb-4">
                <input 
                  type="text" 
                  name="project_name[]" 
                  placeholder="Project Name"
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400" 
                />
              </div>
              <div class="mb-4">
                <textarea 
                  name="project_description[]" 
                  placeholder="Describe the project, technologies used, and your role..." 
                  rows={3}
                  class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400 resize-none"
                />
              </div>
              <input 
                type="url" 
                name="project_link[]" 
                placeholder="Project link (GitHub, live demo, etc.) - Optional"
                class="w-full px-4 py-3 bg-gray-900/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-white placeholder-gray-400" 
              />
            </div>
          )}
        </div>
        <button 
          type="button" 
          onclick="addProject()" 
          class="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium text-green-300 bg-green-500/20 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors duration-200"
        >
          <span class="mr-2">➕</span>
          Add Project
        </button>
      </div>
    </div>
  );
};