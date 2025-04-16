from abc import ABC, abstractmethod
from PyQt6.QtWidgets import QMainWindow
from PyQt6.QtGui import QCloseEvent


class BaseWindow(QMainWindow): 
    def __init__(self, parent, style):
        super().__init__()
        self.data_station = parent
        self.style = style

    @abstractmethod
    def closeEvent(self, event: QCloseEvent):
        pass
