from PyQt6.QtWidgets import QPushButton, QWidget, QVBoxLayout
from PyQt6.QtCore import pyqtSignal
from PyQt6.QtWidgets import QLabel
from PyQt6.QtCore import Qt
from PyQt6.QtGui import QFont

from utils.geometry import center_geom
from utils.screen_text import consent_form_title, consent_form_contents
from base_window import BaseWindow
from pathlib import Path
import os


class ConsentWindow(BaseWindow):
    closed = pyqtSignal()  # Add close signal
    
    def __init__(self, parent, style):
        super().__init__(parent, style)
        self.setWindowTitle("Consent Form")
        self.setStyleSheet(style)
        screen = self.screen().availableGeometry()
        x, y, width, height = center_geom(screen)
        self.setGeometry(x, y, width, height)
        
        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        
        title = QLabel(consent_form_title())
        title.setProperty("class", "h1")
        title.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(title)

        description = QLabel(consent_form_contents())
        description.setWordWrap(True)
        description.setAlignment(Qt.AlignmentFlag.AlignJustify)
        description.setProperty("class", "p")
        layout.addWidget(description)

        # Add accept button
        self.accept_button = QPushButton("Accept")
        self.accept_button.setProperty("class", "button")
        self.accept_button.setFixedWidth(200)
        self.accept_button.clicked.connect(self.on_accept)
        layout.addWidget(self.accept_button, alignment=Qt.AlignmentFlag.AlignCenter)
    
    def on_accept(self):
        self.data_station.open_dashboard()
        self.close()

    def closeEvent(self, event):
        self.closed.emit()
        super().closeEvent(event)
