from PyQt6.QtWidgets import QMainWindow, QPushButton, QWidget, QVBoxLayout
from PyQt6.QtCore import pyqtSignal


class ConsentWindow(QMainWindow):
    closed = pyqtSignal()  # Add close signal
    
    def __init__(self, parent):
        super().__init__()
        self.main_window: QMainWindow = parent
        self.setWindowTitle("Consent Form")
        self.setGeometry(200, 200, 400, 200)
        
        # Create central widget and layout
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        layout = QVBoxLayout(central_widget)
        
        # Add accept button
        self.accept_button = QPushButton("Accept")
        self.accept_button.clicked.connect(self.on_accept)
        layout.addWidget(self.accept_button)
    
    def on_accept(self):
        self.main_window.open_dashboard()
        self.close()

    def closeEvent(self, event):
        self.closed.emit()
        super().closeEvent(event)
