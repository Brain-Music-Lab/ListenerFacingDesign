#pragma once
#include <QObject>
#include <string>

class Psychopy : public QObject
{
    Q_OBJECT

private:
    std::string executeCommand(const std::string& command);
    std::string getVenvPath() const;
    bool activateVenv(const std::string& venvPath);

public:
    explicit Psychopy(QObject *parent = nullptr);
    Q_INVOKABLE void buttonClicked();
};