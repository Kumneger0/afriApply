import type { FC } from 'hono/jsx';

type ProjectsSectionProps = {
  projects?: Array<{ name: string; description: string; link?: string }>;
};

export const ProjectsSection: FC<ProjectsSectionProps> = ({ projects }) => {
  return (
    <details class="p-6 border border-gray-200 rounded-lg shadow-sm bg-white mb-6">
      <summary class="text-xl font-semibold cursor-pointer text-gray-700">Projects</summary>
      <div class="mt-4 space-y-4" id="projects-container">
        {projects && projects.length > 0 ? (
          projects.map(project => (
            <div class="project-entry border-b pb-4">
              <input 
                type="text" 
                name="project_name[]" 
                value={project.name} 
                placeholder="Project name"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
              />
              <textarea 
                name="project_description[]" 
                placeholder="Project description" 
                rows={3}
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"
              >
                {project.description}
              </textarea>
              <input 
                type="url" 
                name="project_link[]" 
                value={project.link || ''} 
                placeholder="Project link (optional)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
              />
            </div>
          ))
        ) : (
          <div class="project-entry border-b pb-4">
            <input 
              type="text" 
              name="project_name[]" 
              placeholder="Project name"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" 
            />
            <textarea 
              name="project_description[]" 
              placeholder="Project description" 
              rows={3}
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"
            />
            <input 
              type="url" 
              name="project_link[]" 
              placeholder="Project link (optional)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" 
            />
          </div>
        )}
      </div>
      <button type="button" onclick="addProject()" class="mt-3 text-blue-500 hover:text-blue-700 text-sm">
        + Add Project
      </button>
    </details>
  );
};