function addSkill() {
  const container = document.getElementById('skills-container');
  const entry = document.createElement('div');
  entry.className = 'skill-entry flex gap-2';
  entry.innerHTML = '<input type="text" name="skills[]" placeholder="Skill name" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />';
  container.appendChild(entry);
}

function addExperience() {
  const container = document.getElementById('experience-container');
  const entry = document.createElement('div');
  entry.className = 'experience-entry border-b pb-4';
  entry.innerHTML = '<input type="text" name="experience_position[]" placeholder="Position" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="experience_company[]" placeholder="Company" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="experience_duration[]" placeholder="Duration (e.g., 2022 - Present)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><textarea name="experience_description[]" placeholder="Description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>';
  container.appendChild(entry);
}

function addEducation() {
  const container = document.getElementById('education-container');
  const entry = document.createElement('div');
  entry.className = 'education-entry border-b pb-4';
  entry.innerHTML = '<input type="text" name="education_degree[]" placeholder="Degree" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="text" name="education_institution[]" placeholder="Institution" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><input type="number" name="education_year[]" placeholder="Year (e.g., 2018)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
  container.appendChild(entry);
}

function addLanguage() {
  const container = document.getElementById('languages-container');
  const entry = document.createElement('div');
  entry.className = 'language-entry flex gap-2';
  entry.innerHTML = '<input type="text" name="language_name[]" placeholder="Language" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" /><input type="text" name="language_proficiency[]" placeholder="Proficiency (e.g., Fluent)" class="shadow appearance-none border rounded flex-1 py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
  container.appendChild(entry);
}

function addAchievement() {
  const container = document.getElementById('achievements-container');
  const entry = document.createElement('div');
  entry.className = 'achievement-entry';
  entry.innerHTML = '<textarea name="achievements[]" placeholder="Achievement description" rows="2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"></textarea>';
  container.appendChild(entry);
}

function addProject() {
  const container = document.getElementById('projects-container');
  const entry = document.createElement('div');
  entry.className = 'project-entry border-b pb-4';
  entry.innerHTML = '<input type="text" name="project_name[]" placeholder="Project name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline" /><textarea name="project_description[]" placeholder="Project description" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-2 focus:outline-none focus:shadow-outline"></textarea><input type="url" name="project_link[]" placeholder="Project link (optional)" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline" />';
  container.appendChild(entry);
}

function addPortfolioLink() {
  const container = document.getElementById('portfolio-container');
  const entry = document.createElement('div');
  entry.className = 'portfolio-entry';
  entry.innerHTML = '<input type="url" name="portfolioLinks[]" placeholder="Portfolio/Website URL" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />';
  container.appendChild(entry);
}