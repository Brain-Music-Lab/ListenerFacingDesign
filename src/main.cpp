#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QUrl>
#include <QQmlContext>
#include <QQmlEngine>

#include "psychopy.h"

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);
    QQmlApplicationEngine engine;
    
    // Register Psychopy type
    qmlRegisterType<Psychopy>("Psychopy", 1, 0, "Psychopy");

    // Load QML file using proper URL
    const QUrl url(QStringLiteral("../qml/main.qml"));
    engine.load(url);
    
    if (engine.rootObjects().isEmpty()) {
        return -1;
    }
    
    return app.exec();
}