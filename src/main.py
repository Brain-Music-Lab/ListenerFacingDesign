from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton
from PyQt6.QtGui import QCloseEvent
from consent import ConsentWindow
from dashboard import Dashboard
import sys

class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Brain Music Lab - Data Station")
        self.setGeometry(100, 100, 400, 200)
        
        # Create and center the button
        self.consent_button = QPushButton("Run", self)
        button_width = 200
        button_height = 40
        x = (self.width() - button_width) // 2
        y = (self.height() - button_height) // 2
        self.consent_button.setGeometry(x, y, button_width, button_height)
        self.consent_button.clicked.connect(self.open_consent)
        self.consent_window = None
        self.dashboard = None
    
    def open_consent(self):
        if not self.consent_window or not self.consent_window.isVisible():
            self.consent_window = ConsentWindow(self)
            self.consent_window.closed.connect(self.on_consent_closed)
            self.consent_button.setText("Running")
            self.consent_window.show()

    def open_dashboard(self):
        if not self.dashboard or not self.dashboard.isVisible():
            self.dashboard = Dashboard(self)
            self.dashboard.closed.connect(self.on_dashboard_closed)
            self.consent_button.setText("Running")
            self.dashboard.show()

    def on_consent_closed(self):
        self.consent_window.destroy()
        self.consent_window = None

        if not self.dashboard:
            self.consent_button.setText("Run")

    def on_dashboard_closed(self):
        self.dashboard.destroy()
        self.dashboard = None

        if not self.consent_window:
            self.consent_button.setText("Run")

    def closeEvent(self, event: QCloseEvent):
        if self.dashboard:
            self.dashboard.close()

        if self.consent_window:
            self.consent_window.close()
        
        super().closeEvent(event)



def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()
    sys.exit(app.exec())

if __name__ == '__main__':
    main()
