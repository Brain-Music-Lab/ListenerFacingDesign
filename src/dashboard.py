from PyQt6.QtWidgets import (QWidget, QVBoxLayout, QLabel, 
                           QPushButton, QGridLayout)
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtGui import QCloseEvent
import os
import subprocess

from utils.geometry import center_geom
from base_window import BaseWindow

class Dashboard(BaseWindow):
    closed = pyqtSignal()
    
    def format_folder_name(self, name):
        """Convert folder names like 'my-folder-name' to 'My Folder Name'"""
        return ' '.join(word.capitalize() for word in name.split('-'))
    
    def launch_project(self, folder_name):
        """Launch a PsychoPy project from the given folder"""
        app_file = os.path.join('/app/psychopy-projects', 
                                folder_name, 
                                f"{folder_name.replace('-', '_')}_app.py")
        
        if os.path.exists(app_file):
            subprocess.Popen(['python3', app_file])
        else:
            print(f"Could not find app file: {app_file}")

    def __init__(self, parent, style):
        super().__init__(parent, style)
        self.setWindowTitle("Dashboard")
        self.setStyleSheet(style)
        screen = self.screen().availableGeometry()
        x, y, width, height = center_geom(screen)
        self.setGeometry(x, y, width, height)
        
        # Create central widget and main layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        
        # Add return to consent button at the top
        self.consent_button = QPushButton("Back to consent form")
        self.consent_button.setProperty("class", "button")
        self.consent_button.clicked.connect(self.on_return_to_dashboard)
        main_layout.addWidget(self.consent_button)
        
        # Create grid layout for project buttons
        grid_layout = QGridLayout()
        main_layout.addLayout(grid_layout)
        
        # Add all project folder buttons in a grid
        projects_path = "psychopy-projects"
        if os.path.exists(projects_path):
            folders = [f for f in os.listdir(projects_path) 
                      if os.path.isdir(os.path.join(projects_path, f))]
            
            # Calculate grid dimensions (3 buttons per row)
            buttons_per_row = 3
            
            for i, folder in enumerate(folders):
                display_name = self.format_folder_name(folder)
                button = QPushButton(display_name)
                button.setProperty("class", "button")
                button.setMinimumSize(200, 100)
                button.clicked.connect(lambda checked, name=folder: self.launch_project(name))
                row = i // buttons_per_row
                col = i % buttons_per_row
                grid_layout.addWidget(button, row, col)
        else:
            placeholder = QLabel("No projects found in psychopy-projects directory")
            placeholder.setStyleSheet("font-size: 24px; color: gray;")
            main_layout.addWidget(placeholder)

    def on_return_to_dashboard(self):
        self.data_station.open_consent()
        self.close()
    
    def closeEvent(self, event: QCloseEvent):
        self.closed.emit()
        super().closeEvent(event)
