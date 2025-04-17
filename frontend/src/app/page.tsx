'use client'
 
import { useRouter } from 'next/navigation'

import styles from "./page.module.css";
import Button from "react-bootstrap/Button";

export default function Home() {
  const router = useRouter();

  return (
    <div className={"min-vh-100 d-flex align-items-center justify-content-center"}>
      <div className="container">
        <div className="row row-cols-1 justify-content-center">
          <div className="col text-center">
            <h1 className={styles.underspace}>Welcome to the Brain Music Lab Data Station
            </h1>
          </div>
          <div className="col">
            <p className="mb-4">
              This system was developed to allow members of the brain music lab to pursue a more unsupervised form of data collection for research. There are various applications that have been developed and uploaded onto this device for this purpose.
            </p>
            <p>
              By utilizing this device, you are consenting to the use of your anonymized data for academic research purposes. Your data will not be traceable back to you. 
            </p>
          </div>
          <div className="col text-center">
            <Button variant="primary" size="lg" className="mt-3"
              onClick={() => router.push("/dashboard")}>
              Accept
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}