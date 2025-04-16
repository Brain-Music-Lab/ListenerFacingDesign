from PyQt6.QtWidgets import QApplication, QMainWindow, QPushButton
from PyQt6.QtGui import QCloseEvent
from consent import ConsentWindow
from dashboard import Dashboard
import sys

from assets.bml_css import bml_style
import utils.screen_text

class DataStation():
    def __init__(self):
        super().__init__()
        self.style = bml_style

        self.consent_window = None
        self.dashboard = None
    
    def open_consent(self):
        if not self.consent_window or not self.consent_window.isVisible():
            self.consent_window = ConsentWindow(self, self.style)
            self.consent_window.setProperty("class", "main-background")
            self.consent_window.closed.connect(self.on_consent_closed)
            self.consent_window.show()

    def open_dashboard(self):
        if not self.dashboard or not self.dashboard.isVisible():
            self.dashboard = Dashboard(self, self.style)
            self.dashboard.setProperty("class", "main-background")
            self.dashboard.closed.connect(self.on_dashboard_closed)
            self.dashboard.show()

    def on_consent_closed(self):
        self.consent_window.destroy()
        self.consent_window = None

    def on_dashboard_closed(self):
        self.dashboard.destroy()
        self.dashboard = None

    def closeEvent(self, event: QCloseEvent):
        if self.dashboard:
            self.dashboard.close()

        if self.consent_window:
            self.consent_window.close()
        
        super().closeEvent(event)


def main():
    app = QApplication(sys.argv)
    data_station = DataStation()
    data_station.open_consent()
    sys.exit(app.exec())


if __name__ == '__main__':
    main()
