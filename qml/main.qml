import QtQuick.Controls
import Psychopy 1.0

ApplicationWindow {
    id: root
    visible: true
    width: 800
    height: 600

    Psychopy {
        id: psycho
    }

    Button {
        text: "Hiiiiiii"
        anchors.centerIn: parent
        onClicked: psycho.buttonClicked()
    }
}