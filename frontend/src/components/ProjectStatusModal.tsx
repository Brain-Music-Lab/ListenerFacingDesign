import styles from "@/assets/modal.module.css"
import { Button } from "react-bootstrap";

interface ModalProps {
    setIsOpen: (isOpen: boolean) => void;
    projectName: string;
    projectWorking: boolean;
}

export const Modal = ({ 
  setIsOpen, 
  projectName, 
  projectWorking 
} : ModalProps) => {
    return (
      <div>
        <div className={styles.darkBG}>
          <div className={styles.centered}>

            {/* The Project is working */}
            {projectWorking && (
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <h5 className={styles.heading}>{projectName} is Running</h5>
                </div> 
                <div className={styles.modalContent}>
                  Please wait while the project is running.
                  This window will close automatically when the project completes.
                </div> 
              </div> )}

            {/* The Project is not working */}
            {!projectWorking && (
              <div className={styles.modal}>
                <div className={styles.modalHeader}>
                  <h5 className={styles.heading}>{projectName} is not working</h5>
                </div> 
                <div className={styles.modalContent}>
                  Sadly, this project is not working. Please let someone in the brain music lab know!
                </div> 
                <div className="text-center">
                  <Button onClick={() => setIsOpen(false)}>Close window</Button>
                </div>
              </div>)}
          </div>
        </div>
      </div>
      );
};
