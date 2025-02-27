from PyQt6.QtWidgets import (QMainWindow, QWidget, QVBoxLayout, QLabel, 
                           QPushButton, QGridLayout)
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtGui import QCloseEvent
import os

class Dashboard(QMainWindow):
    closed = pyqtSignal()  # Add close signal
    
    def format_folder_name(self, name):
        """Convert folder names like 'my-folder-name' to 'My Folder Name'"""
        return ' '.join(word.capitalize() for word in name.split('-'))
    
    def __init__(self, parent):
        super().__init__()
        self.main_window = parent
        self.setWindowTitle("Dashboard")
        self.setGeometry(200, 200, 800, 600)
        
        # Create central widget and main layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        
        # Add return to consent button at the top
        self.consent_button = QPushButton("Back to consent form")
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
                button.setMinimumSize(200, 100)  # Make buttons bigger
                button.clicked.connect(lambda checked, name=folder: 
                    print(f"Selected project: {self.format_folder_name(name)}"))
                row = i // buttons_per_row
                col = i % buttons_per_row
                grid_layout.addWidget(button, row, col)
        else:
            placeholder = QLabel("No projects found in psychopy-projects directory")
            placeholder.setStyleSheet("font-size: 24px; color: gray;")
            main_layout.addWidget(placeholder)

    def on_return_to_dashboard(self):
        self.main_window.open_consent()
        self.close()
    
    def closeEvent(self, event: QCloseEvent):
        self.closed.emit()
        super().closeEvent(event)
