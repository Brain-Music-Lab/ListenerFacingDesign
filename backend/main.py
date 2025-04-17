from typing import Union
from fastapi import FastAPI, HTTPException, status
from fastapi.routing import APIRouter
import subprocess


# Add prefix to all routes using APIRouter
app = FastAPI()
router = APIRouter(prefix="/api")

@router.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}

@router.get("/projects/{project_id}")
def start_project(project_id: str):
    try:
        subprocess.run(['python', 
                        f'./psychopy-projects/{project_id}/{project_id.replace("-", "_")}.py'], check=True)
        return {"status": "success", "project_id": project_id}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=400, detail="Project not found")
        return {"status": "error", "message": str(e)}

# Include the router in the app
app.include_router(router)
