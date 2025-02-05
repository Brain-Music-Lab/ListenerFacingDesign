#ifndef _LFD_PSYCHOPY_H_
#define _LFD_PSYCHOPY_H_

#include <QObject>

class Psychopy : public QObject
{
    Q_OBJECT
public:
    explicit Psychopy(QObject* parent = nullptr);

public slots:
    void buttonClicked();

};

#endif  // _LFD_PSYCHOPY_H_