/*
To add a new project: 
- Save the project folder in the 'projects' folder within this directory.
- Look at the interface below. You will need to provide an id, a name, a short description, and a regular-length description for your project.
- Open the psychopy-projects.tsx file in this directory.
- Following the example of the current projects, add your project to the end of PsychopyProject[].
- That's it!
*/
export interface PsychopyProject {
    id: string  // The name of the folder you added to the 'projects' folder.
    name: string  // Name of the project
    shortDescription: string  // Short description for the project
    description: string  // Longer description for for the project
}
