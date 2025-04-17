'use client'

import { PsychopyProjects } from "../../components/PsychopyProjects"

export default function dashboard() {
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
                    <PsychopyProjects/>
                </div>
            </div>
        </div>
    )
}
