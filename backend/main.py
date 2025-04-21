from typing import Union
from fastapi import FastAPI, HTTPException, status
from fastapi.routing import APIRouter
from fastapi.middleware.cors import CORSMiddleware
import subprocess
from pathlib import Path
import os


# Add prefix to all routes using APIRouter
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

router = APIRouter(prefix="/api")

@router.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@router.get("/projects/{project_id}")
def start_project(project_id: str):

    curr_dir = str(Path(__file__).parent.absolute())
    project_app = os.path.join(curr_dir, 
                               "psychopy-projects",
                               project_id,
                               f"{project_id.replace('-', '_')}.py")

    try:
        subprocess.run(['python', project_app], check=True)
        return {"status": "success", "project_id": project_id}
    except subprocess.CalledProcessError as e:
        pass
        # raise HTTPException(status_code=400, detail="Project not found")
        # return {"status": "error", "message": str(e)}
    return {"dir calleddd": project_app}
    

# Include the router in the app
app.include_router(router)
