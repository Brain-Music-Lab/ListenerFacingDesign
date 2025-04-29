'use client'

import { useRouter } from "next/navigation"
// import { PsychopyProjects } from "../../components/PsychopyProjects"
import Button from 'react-bootstrap/Button';

export default function dashboard() {
    const router = useRouter();

    return (
        <div className="container d-flex justify-content-center">
            <div className="row">
                <div className="col-12">
                    <h1 className="m-4 text-center">Brain Music Lab Study Dashboard</h1>
                    <h3 className="text-center m-5">
                        Click on a study below to get started!
                    </h3>
                </div>
                <div>
                    <Button 
                        className="btn btn-primary"
                        onClick={() => router.push('/memory-listening/')}
                    >
                        Memorable Music
                    </Button>
                    {/* <PsychopyProjects/> */}
                </div>
            </div>
        </div>
    )
}
