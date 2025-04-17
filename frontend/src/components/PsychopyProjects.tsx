import { useState } from "react";
import { projects } from "../psychopy/psychopy-projects";
import Button from 'react-bootstrap/Button';
import { Modal } from "./ProjectStatusModal";

export const PsychopyProjects = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState('');
    const [projectWorking, setProjectWorking] = useState(true);

    const handleClick = async (projectId: string, projectName: string) => {
        setIsModalOpen(true);
        setCurrentProject(projectName);
        setProjectWorking(true);
        
        try {
            console.log(`http://localhost:${process.env.FASTAPI_PORT}/api/projects/${projectId}`);
            const response = await fetch(`http://localhost:${process.env.FASTAPI_PORT}/api/projects/${projectId}`);

            if (!response.ok) {
                throw new Error("Psychopy project not found");
            }
            
            const data = await response.json();
            console.log(data);
            setIsModalOpen(false);

        } catch (error) {
            console.error(error);
            setProjectWorking(false);
        }
    }

    return(
        <div>
            <div className="row row-cols-3 d-flex justify-content-center">
                {projects.map((project) => (
                    <div key={project.id} className="col text-center">
                        <Button onClick={() => handleClick(project.id, project.name)}>
                            {project.name}
                        </Button>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <Modal 
                    setIsOpen={setIsModalOpen}
                    projectName={currentProject}
                    projectWorking={projectWorking}
                />
            )}
        </div>
    )
}