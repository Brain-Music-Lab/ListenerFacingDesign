#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
This experiment was created using PsychoPy3 Experiment Builder (v2023.2.3),
    on September 11, 2024, at 17:01
If you publish work using this script the most relevant publication is:

    Peirce J, Gray JR, Simpson S, MacAskill M, Höchenberger R, Sogo H, Kastman E, Lindeløv JK. (2019) 
        PsychoPy2: Experiments in behavior made easy Behav Res 51: 195. 
        https://doi.org/10.3758/s13428-018-01193-y

"""

# --- Import packages ---
from psychopy import locale_setup
from psychopy import prefs
from psychopy import plugins
plugins.activatePlugins()
prefs.hardware['audioLib'] = 'ptb'
prefs.hardware['audioLatencyMode'] = '3'
from psychopy import sound, gui, visual, core, data, event, logging, clock, colors, layout
from psychopy.tools import environmenttools
from psychopy.constants import (NOT_STARTED, STARTED, PLAYING, PAUSED,
                                STOPPED, FINISHED, PRESSED, RELEASED, FOREVER, priority)

import numpy as np  # whole numpy lib is available, prepend 'np.'
from numpy import (sin, cos, tan, log, log10, pi, average,
                   sqrt, std, deg2rad, rad2deg, linspace, asarray)
from numpy.random import random, randint, normal, shuffle, choice as randchoice
import os  # handy system and path functions
import sys  # to get file system encoding

import psychopy.iohub as io
from psychopy.hardware import keyboard

# --- Setup global variables (available in all functions) ---
# Ensure that relative paths start from the same directory as this script
_thisDir = os.path.dirname(os.path.abspath(__file__))
# Store info about the experiment session
psychopyVersion = '2023.2.3'
expName = 'psychopy_test_app'  # from the Builder filename that created this script
expInfo = {
    'participant': f"{randint(0, 999999):06.0f}",
    'session': '001',
    'date': data.getDateStr(),  # add a simple timestamp
    'expName': expName,
    'psychopyVersion': psychopyVersion,
}


def showExpInfoDlg(expInfo):
    """
    Show participant info dialog.
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    
    Returns
    ==========
    dict
        Information about this experiment.
    """
    # temporarily remove keys which the dialog doesn't need to show
    poppedKeys = {
        'date': expInfo.pop('date', data.getDateStr()),
        'expName': expInfo.pop('expName', expName),
        'psychopyVersion': expInfo.pop('psychopyVersion', psychopyVersion),
    }
    # show participant info dialog
    dlg = gui.DlgFromDict(dictionary=expInfo, sortKeys=False, title=expName)
    if dlg.OK == False:
        core.quit()  # user pressed cancel
    # restore hidden keys
    expInfo.update(poppedKeys)
    # return expInfo
    return expInfo


def setupData(expInfo, dataDir=None):
    """
    Make an ExperimentHandler to handle trials and saving.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    dataDir : Path, str or None
        Folder to save the data to, leave as None to create a folder in the current directory.    
    Returns
    ==========
    psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    
    # data file name stem = absolute path + name; later add .psyexp, .csv, .log, etc
    if dataDir is None:
        dataDir = _thisDir
    filename = u'data/%s_%s_%s' % (expInfo['participant'], expName, expInfo['date'])
    # make sure filename is relative to dataDir
    if os.path.isabs(filename):
        dataDir = os.path.commonprefix([dataDir, filename])
        filename = os.path.relpath(filename, dataDir)
    
    # an ExperimentHandler isn't essential but helps with data saving
    thisExp = data.ExperimentHandler(
        name=expName, version='',
        extraInfo=expInfo, runtimeInfo=None,
        originPath='C:\\Users\\sophi\\Documents\\CU BOULDER\\research\\BML\\psychopy_test_app.py',
        savePickle=True, saveWideText=True,
        dataFileName=dataDir + os.sep + filename, sortColumns='time'
    )
    thisExp.setPriority('thisRow.t', priority.CRITICAL)
    thisExp.setPriority('expName', priority.LOW)
    # return experiment handler
    return thisExp


def setupLogging(filename):
    """
    Setup a log file and tell it what level to log at.
    
    Parameters
    ==========
    filename : str or pathlib.Path
        Filename to save log file and data files as, doesn't need an extension.
    
    Returns
    ==========
    psychopy.logging.LogFile
        Text stream to receive inputs from the logging system.
    """
    # this outputs to the screen, not a file
    logging.console.setLevel(logging.EXP)
    # save a log file for detail verbose info
    logFile = logging.LogFile(filename+'.log', level=logging.EXP)
    
    return logFile


def setupWindow(expInfo=None, win=None):
    """
    Setup the Window
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    win : psychopy.visual.Window
        Window to setup - leave as None to create a new window.
    
    Returns
    ==========
    psychopy.visual.Window
        Window in which to run this experiment.
    """
    if win is None:
        # if not given a window to setup, make one
        win = visual.Window(
            size=[1600, 1067], fullscr=True, screen=0,
            winType='pyglet', allowStencil=True,
            monitor='testMonitor', color=[0,0,0], colorSpace='rgb',
            backgroundImage='', backgroundFit='none',
            blendMode='avg', useFBO=True,
            units='height'
        )
        if expInfo is not None:
            # store frame rate of monitor if we can measure it
            expInfo['frameRate'] = win.getActualFrameRate()
    else:
        # if we have a window, just set the attributes which are safe to set
        win.color = [0,0,0]
        win.colorSpace = 'rgb'
        win.backgroundImage = ''
        win.backgroundFit = 'none'
        win.units = 'height'
    win.mouseVisible = False
    win.hideMessage()
    return win


def setupInputs(expInfo, thisExp, win):
    """
    Setup whatever inputs are available (mouse, keyboard, eyetracker, etc.)
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    win : psychopy.visual.Window
        Window in which to run this experiment.
    Returns
    ==========
    dict
        Dictionary of input devices by name.
    """
    # --- Setup input devices ---
    inputs = {}
    ioConfig = {}
    
    # Setup iohub keyboard
    ioConfig['Keyboard'] = dict(use_keymap='psychopy')
    
    ioSession = '1'
    if 'session' in expInfo:
        ioSession = str(expInfo['session'])
    ioServer = io.launchHubServer(window=win, **ioConfig)
    eyetracker = None
    
    # create a default keyboard (e.g. to check for escape)
    defaultKeyboard = keyboard.Keyboard(backend='iohub')
    # return inputs dict
    return {
        'ioServer': ioServer,
        'defaultKeyboard': defaultKeyboard,
        'eyetracker': eyetracker,
    }

def pauseExperiment(thisExp, inputs=None, win=None, timers=[], playbackComponents=[]):
    """
    Pause this experiment, preventing the flow from advancing to the next routine until resumed.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    inputs : dict
        Dictionary of input devices by name.
    win : psychopy.visual.Window
        Window for this experiment.
    timers : list, tuple
        List of timers to reset once pausing is finished.
    playbackComponents : list, tuple
        List of any components with a `pause` method which need to be paused.
    """
    # if we are not paused, do nothing
    if thisExp.status != PAUSED:
        return
    
    # pause any playback components
    for comp in playbackComponents:
        comp.pause()
    # prevent components from auto-drawing
    win.stashAutoDraw()
    # run a while loop while we wait to unpause
    while thisExp.status == PAUSED:
        # make sure we have a keyboard
        if inputs is None:
            inputs = {
                'defaultKeyboard': keyboard.Keyboard(backend='ioHub')
            }
        # check for quit (typically the Esc key)
        if inputs['defaultKeyboard'].getKeys(keyList=['escape']):
            endExperiment(thisExp, win=win, inputs=inputs)
        # flip the screen
        win.flip()
    # if stop was requested while paused, quit
    if thisExp.status == FINISHED:
        endExperiment(thisExp, inputs=inputs, win=win)
    # resume any playback components
    for comp in playbackComponents:
        comp.play()
    # restore auto-drawn components
    win.retrieveAutoDraw()
    # reset any timers
    for timer in timers:
        timer.reset()


def run(expInfo, thisExp, win, inputs, globalClock=None, thisSession=None):
    """
    Run the experiment flow.
    
    Parameters
    ==========
    expInfo : dict
        Information about this experiment, created by the `setupExpInfo` function.
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    psychopy.visual.Window
        Window in which to run this experiment.
    inputs : dict
        Dictionary of input devices by name.
    globalClock : psychopy.core.clock.Clock or None
        Clock to get global time from - supply None to make a new one.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    # mark experiment as started
    thisExp.status = STARTED
    # make sure variables created by exec are available globally
    exec = environmenttools.setExecEnvironment(globals())
    # get device handles from dict of input devices
    ioServer = inputs['ioServer']
    defaultKeyboard = inputs['defaultKeyboard']
    eyetracker = inputs['eyetracker']
    # make sure we're running in the directory for this experiment
    os.chdir(_thisDir)
    # get filename from ExperimentHandler for convenience
    filename = thisExp.dataFileName
    frameTolerance = 0.001  # how close to onset before 'same' frame
    endExpNow = False  # flag for 'escape' or other condition => quit the exp
    # get frame duration from frame rate in expInfo
    if 'frameRate' in expInfo and expInfo['frameRate'] is not None:
        frameDur = 1.0 / round(expInfo['frameRate'])
    else:
        frameDur = 1.0 / 60.0  # could not measure, so guess
    
    # Start Code - component code to be run after the window creation
    
    # --- Initialize components for Routine "intro" ---
    text_intro = visual.TextStim(win=win, name='text_intro',
        text='This text box displays an introduction to the task and instructions for participants.\n\nPress [space] to proceed.',
        font='Open Sans',
        pos=(0, 0), height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    key_resp_intro = keyboard.Keyboard()
    
    # --- Initialize components for Routine "button_press_task" ---
    text_button_press_task = visual.TextStim(win=win, name='text_button_press_task',
        text='Click buttons. They should turn green when selected, and white when de-selected. Press [enter] to proceed.',
        font='Open Sans',
        units='norm', pos=(0, 0.8), height=0.05, wrapWidth=1.8, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    button1 = visual.ButtonStim(win, 
        text='Click here', font='Arvo',
        pos=(-0.7, -0.7),units='norm',
        letterHeight=0.05,
        size=(0.3, 0.1), borderWidth=0.0,
        fillColor=[1.0000, 1.0000, 1.0000], borderColor=None,
        color=[-1.0000, -1.0000, -1.0000], colorSpace='rgb',
        opacity=None,
        bold=True, italic=False,
        padding=None,
        anchor='center',
        name='button1',
        depth=-1
    )
    button1.buttonClock = core.Clock()
    button2 = visual.ButtonStim(win, 
        text='and here', font='Arvo',
        pos=(-0.3, -0.7),units='norm',
        letterHeight=0.05,
        size=(0.3, 0.1), borderWidth=0.0,
        fillColor=[1.0000, 1.0000, 1.0000], borderColor=None,
        color=[-1.0000, -1.0000, -1.0000], colorSpace='rgb',
        opacity=None,
        bold=True, italic=False,
        padding=None,
        anchor='center',
        name='button2',
        depth=-2
    )
    button2.buttonClock = core.Clock()
    button3 = visual.ButtonStim(win, 
        text='not here', font='Arvo',
        pos=(0.1, -0.7),units='norm',
        letterHeight=0.05,
        size=(0.3, 0.1), borderWidth=0.0,
        fillColor=[1.0000, 1.0000, 1.0000], borderColor=None,
        color=[-1.0000, -1.0000, -1.0000], colorSpace='rgb',
        opacity=None,
        bold=True, italic=False,
        padding=None,
        anchor='center',
        name='button3',
        depth=-3
    )
    button3.buttonClock = core.Clock()
    button4 = visual.ButtonStim(win, 
        text='also click here', font='Arvo',
        pos=(0.5, -0.7),units='norm',
        letterHeight=0.05,
        size=(0.4, 0.1), borderWidth=0.0,
        fillColor=[1.0000, 1.0000, 1.0000], borderColor=None,
        color=[-1.0000, -1.0000, -1.0000], colorSpace='rgb',
        opacity=None,
        bold=True, italic=False,
        padding=None,
        anchor='center',
        name='button4',
        depth=-4
    )
    button4.buttonClock = core.Clock()
    key_resp_button_press_task = keyboard.Keyboard()
    
    # --- Initialize components for Routine "text_entry_task" ---
    text_text_entry_task = visual.TextStim(win=win, name='text_text_entry_task',
        text='Type something into the textbox below. Click the button to proceed.',
        font='Open Sans',
        units='norm', pos=(0, 0.8), height=0.05, wrapWidth=1.8, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    textbox_text_entry_task = visual.TextBox2(
         win, text=None, placeholder='Type here...', font='Arial',
         pos=(0, 0),units='norm',     letterHeight=0.05,
         size=(1, 0.5), borderWidth=2.0,
         color=[-1.0000, -1.0000, -1.0000], colorSpace='rgb',
         opacity=None,
         bold=False, italic=False,
         lineSpacing=1.0, speechPoint=None,
         padding=0.0, alignment='center',
         anchor='center', overflow='visible',
         fillColor=[1.0000, 1.0000, 1.0000], borderColor=None,
         flipHoriz=False, flipVert=False, languageStyle='LTR',
         editable=True,
         name='textbox_text_entry_task',
         depth=-1, autoLog=True,
    )
    button_text_entry_task = visual.ButtonStim(win, 
        text='Proceed', font='Arvo',
        pos=(0, -0.7),units='norm',
        letterHeight=0.05,
        size=(0.3, 0.1), borderWidth=0.0,
        fillColor='darkgrey', borderColor=None,
        color='white', colorSpace='rgb',
        opacity=None,
        bold=True, italic=False,
        padding=None,
        anchor='center',
        name='button_text_entry_task',
        depth=-2
    )
    button_text_entry_task.buttonClock = core.Clock()
    
    # --- Initialize components for Routine "slider_task" ---
    text_slider_task = visual.TextStim(win=win, name='text_slider_task',
        text='Move the sliders around. Press [t] to continue.',
        font='Open Sans',
        units='norm', pos=(0, 0.8), height=0.05, wrapWidth=1.8, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    key_resp_slider_task = keyboard.Keyboard()
    slider1 = visual.Slider(win=win, name='slider1',
        startValue=3, size=(1.0, 0.1), pos=(0, 0), units='norm',
        labels=(1, 2, 3, 4, 5), ticks=(1, 2, 3, 4, 5), granularity=0.0,
        style='rating', styleTweaks=(), opacity=None,
        labelColor='LightGray', markerColor='Red', lineColor='White', colorSpace='rgb',
        font='Open Sans', labelHeight=0.05,
        flip=False, ori=0.0, depth=-2, readOnly=False)
    slider2 = visual.Slider(win=win, name='slider2',
        startValue=4, size=(1.0, 0.1), pos=(0, -0.5), units='norm',
        labels=(1, 2, 3, 4, 5, 6, 7), ticks=(1, 2, 3, 4, 5, 6, 7), granularity=0.0,
        style='rating', styleTweaks=(), opacity=None,
        labelColor='LightGray', markerColor='Red', lineColor='White', colorSpace='rgb',
        font='Open Sans', labelHeight=0.05,
        flip=False, ori=0.0, depth=-3, readOnly=False)
    
    # --- Initialize components for Routine "finish" ---
    text_finish = visual.TextStim(win=win, name='text_finish',
        text="Congrats! You're done now.\n\nTask should close in 5 sec.",
        font='Open Sans',
        pos=(0, 0), height=0.05, wrapWidth=None, ori=0.0, 
        color='white', colorSpace='rgb', opacity=None, 
        languageStyle='LTR',
        depth=0.0);
    
    # create some handy timers
    if globalClock is None:
        globalClock = core.Clock()  # to track the time since experiment started
    if ioServer is not None:
        ioServer.syncClock(globalClock)
    logging.setDefaultClock(globalClock)
    routineTimer = core.Clock()  # to track time remaining of each (possibly non-slip) routine
    win.flip()  # flip window to reset last flip timer
    # store the exact time the global clock started
    expInfo['expStart'] = data.getDateStr(format='%Y-%m-%d %Hh%M.%S.%f %z', fractionalSecondDigits=6)
    
    # --- Prepare to start Routine "intro" ---
    continueRoutine = True
    # update component parameters for each repeat
    thisExp.addData('intro.started', globalClock.getTime())
    key_resp_intro.keys = []
    key_resp_intro.rt = []
    _key_resp_intro_allKeys = []
    # keep track of which components have finished
    introComponents = [text_intro, key_resp_intro]
    for thisComponent in introComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "intro" ---
    routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *text_intro* updates
        
        # if text_intro is starting this frame...
        if text_intro.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            text_intro.frameNStart = frameN  # exact frame index
            text_intro.tStart = t  # local t and not account for scr refresh
            text_intro.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(text_intro, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'text_intro.started')
            # update status
            text_intro.status = STARTED
            text_intro.setAutoDraw(True)
        
        # if text_intro is active this frame...
        if text_intro.status == STARTED:
            # update params
            pass
        
        # *key_resp_intro* updates
        waitOnFlip = False
        
        # if key_resp_intro is starting this frame...
        if key_resp_intro.status == NOT_STARTED and tThisFlip >= 1.0-frameTolerance:
            # keep track of start time/frame for later
            key_resp_intro.frameNStart = frameN  # exact frame index
            key_resp_intro.tStart = t  # local t and not account for scr refresh
            key_resp_intro.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(key_resp_intro, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'key_resp_intro.started')
            # update status
            key_resp_intro.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(key_resp_intro.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(key_resp_intro.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if key_resp_intro.status == STARTED and not waitOnFlip:
            theseKeys = key_resp_intro.getKeys(keyList=['space'], ignoreKeys=["escape"], waitRelease=False)
            _key_resp_intro_allKeys.extend(theseKeys)
            if len(_key_resp_intro_allKeys):
                key_resp_intro.keys = _key_resp_intro_allKeys[-1].name  # just the last key pressed
                key_resp_intro.rt = _key_resp_intro_allKeys[-1].rt
                key_resp_intro.duration = _key_resp_intro_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, inputs=inputs, win=win)
            return
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in introComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "intro" ---
    for thisComponent in introComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    thisExp.addData('intro.stopped', globalClock.getTime())
    # check responses
    if key_resp_intro.keys in ['', [], None]:  # No response was made
        key_resp_intro.keys = None
    thisExp.addData('key_resp_intro.keys',key_resp_intro.keys)
    if key_resp_intro.keys != None:  # we had a response
        thisExp.addData('key_resp_intro.rt', key_resp_intro.rt)
        thisExp.addData('key_resp_intro.duration', key_resp_intro.duration)
    thisExp.nextEntry()
    # the Routine "intro" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # --- Prepare to start Routine "button_press_task" ---
    continueRoutine = True
    # update component parameters for each repeat
    thisExp.addData('button_press_task.started', globalClock.getTime())
    # reset button1 to account for continued clicks & clear times on/off
    button1.reset()
    # reset button2 to account for continued clicks & clear times on/off
    button2.reset()
    # reset button3 to account for continued clicks & clear times on/off
    button3.reset()
    # reset button4 to account for continued clicks & clear times on/off
    button4.reset()
    key_resp_button_press_task.keys = []
    key_resp_button_press_task.rt = []
    _key_resp_button_press_task_allKeys = []
    # keep track of which components have finished
    button_press_taskComponents = [text_button_press_task, button1, button2, button3, button4, key_resp_button_press_task]
    for thisComponent in button_press_taskComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "button_press_task" ---
    routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *text_button_press_task* updates
        
        # if text_button_press_task is starting this frame...
        if text_button_press_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            text_button_press_task.frameNStart = frameN  # exact frame index
            text_button_press_task.tStart = t  # local t and not account for scr refresh
            text_button_press_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(text_button_press_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'text_button_press_task.started')
            # update status
            text_button_press_task.status = STARTED
            text_button_press_task.setAutoDraw(True)
        
        # if text_button_press_task is active this frame...
        if text_button_press_task.status == STARTED:
            # update params
            pass
        # *button1* updates
        
        # if button1 is starting this frame...
        if button1.status == NOT_STARTED and tThisFlip >= 0-frameTolerance:
            # keep track of start time/frame for later
            button1.frameNStart = frameN  # exact frame index
            button1.tStart = t  # local t and not account for scr refresh
            button1.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(button1, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'button1.started')
            # update status
            button1.status = STARTED
            button1.setAutoDraw(True)
        
        # if button1 is active this frame...
        if button1.status == STARTED:
            # update params
            pass
            # check whether button1 has been pressed
            if button1.isClicked:
                if not button1.wasClicked:
                    # if this is a new click, store time of first click and clicked until
                    button1.timesOn.append(button1.buttonClock.getTime())
                    button1.timesOff.append(button1.buttonClock.getTime())
                elif len(button1.timesOff):
                    # if click is continuing from last frame, update time of clicked until
                    button1.timesOff[-1] = button1.buttonClock.getTime()
                if not button1.wasClicked:
                    # run callback code when button1 is clicked
                    if (button1.fillColor == [1.0,1.0,1.0]).all():
                        button1.fillColor = [-1.0, 0.0039, -1.0]
                    elif (button1.fillColor == [-1.0, 0.0039, -1.0]).all():
                        button1.fillColor = [1.0,1.0,1.0]
        # take note of whether button1 was clicked, so that next frame we know if clicks are new
        button1.wasClicked = button1.isClicked and button1.status == STARTED
        # *button2* updates
        
        # if button2 is starting this frame...
        if button2.status == NOT_STARTED and tThisFlip >= 0-frameTolerance:
            # keep track of start time/frame for later
            button2.frameNStart = frameN  # exact frame index
            button2.tStart = t  # local t and not account for scr refresh
            button2.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(button2, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'button2.started')
            # update status
            button2.status = STARTED
            button2.setAutoDraw(True)
        
        # if button2 is active this frame...
        if button2.status == STARTED:
            # update params
            pass
            # check whether button2 has been pressed
            if button2.isClicked:
                if not button2.wasClicked:
                    # if this is a new click, store time of first click and clicked until
                    button2.timesOn.append(button2.buttonClock.getTime())
                    button2.timesOff.append(button2.buttonClock.getTime())
                elif len(button2.timesOff):
                    # if click is continuing from last frame, update time of clicked until
                    button2.timesOff[-1] = button2.buttonClock.getTime()
                if not button2.wasClicked:
                    # run callback code when button2 is clicked
                    if (button2.fillColor == [1.0,1.0,1.0]).all():
                        button2.fillColor = [-1.0, 0.0039, -1.0]
                    elif (button2.fillColor == [-1.0, 0.0039, -1.0]).all():
                        button2.fillColor = [1.0,1.0,1.0]
        # take note of whether button2 was clicked, so that next frame we know if clicks are new
        button2.wasClicked = button2.isClicked and button2.status == STARTED
        # *button3* updates
        
        # if button3 is starting this frame...
        if button3.status == NOT_STARTED and tThisFlip >= 0-frameTolerance:
            # keep track of start time/frame for later
            button3.frameNStart = frameN  # exact frame index
            button3.tStart = t  # local t and not account for scr refresh
            button3.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(button3, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'button3.started')
            # update status
            button3.status = STARTED
            button3.setAutoDraw(True)
        
        # if button3 is active this frame...
        if button3.status == STARTED:
            # update params
            pass
            # check whether button3 has been pressed
            if button3.isClicked:
                if not button3.wasClicked:
                    # if this is a new click, store time of first click and clicked until
                    button3.timesOn.append(button3.buttonClock.getTime())
                    button3.timesOff.append(button3.buttonClock.getTime())
                elif len(button3.timesOff):
                    # if click is continuing from last frame, update time of clicked until
                    button3.timesOff[-1] = button3.buttonClock.getTime()
                if not button3.wasClicked:
                    # run callback code when button3 is clicked
                    if (button3.fillColor == [1.0,1.0,1.0]).all():
                        button3.fillColor = [-1.0, 0.0039, -1.0]
                    elif (button3.fillColor == [-1.0, 0.0039, -1.0]).all():
                        button3.fillColor = [1.0,1.0,1.0]
        # take note of whether button3 was clicked, so that next frame we know if clicks are new
        button3.wasClicked = button3.isClicked and button3.status == STARTED
        # *button4* updates
        
        # if button4 is starting this frame...
        if button4.status == NOT_STARTED and tThisFlip >= 0-frameTolerance:
            # keep track of start time/frame for later
            button4.frameNStart = frameN  # exact frame index
            button4.tStart = t  # local t and not account for scr refresh
            button4.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(button4, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'button4.started')
            # update status
            button4.status = STARTED
            button4.setAutoDraw(True)
        
        # if button4 is active this frame...
        if button4.status == STARTED:
            # update params
            pass
            # check whether button4 has been pressed
            if button4.isClicked:
                if not button4.wasClicked:
                    # if this is a new click, store time of first click and clicked until
                    button4.timesOn.append(button4.buttonClock.getTime())
                    button4.timesOff.append(button4.buttonClock.getTime())
                elif len(button4.timesOff):
                    # if click is continuing from last frame, update time of clicked until
                    button4.timesOff[-1] = button4.buttonClock.getTime()
                if not button4.wasClicked:
                    # run callback code when button4 is clicked
                    if (button4.fillColor == [1.0,1.0,1.0]).all():
                        button4.fillColor = [-1.0, 0.0039, -1.0]
                    elif (button4.fillColor == [-1.0, 0.0039, -1.0]).all():
                        button4.fillColor = [1.0,1.0,1.0]
        # take note of whether button4 was clicked, so that next frame we know if clicks are new
        button4.wasClicked = button4.isClicked and button4.status == STARTED
        
        # *key_resp_button_press_task* updates
        waitOnFlip = False
        
        # if key_resp_button_press_task is starting this frame...
        if key_resp_button_press_task.status == NOT_STARTED and tThisFlip >= 1-frameTolerance:
            # keep track of start time/frame for later
            key_resp_button_press_task.frameNStart = frameN  # exact frame index
            key_resp_button_press_task.tStart = t  # local t and not account for scr refresh
            key_resp_button_press_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(key_resp_button_press_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'key_resp_button_press_task.started')
            # update status
            key_resp_button_press_task.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(key_resp_button_press_task.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(key_resp_button_press_task.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if key_resp_button_press_task.status == STARTED and not waitOnFlip:
            theseKeys = key_resp_button_press_task.getKeys(keyList=['return'], ignoreKeys=["escape"], waitRelease=False)
            _key_resp_button_press_task_allKeys.extend(theseKeys)
            if len(_key_resp_button_press_task_allKeys):
                key_resp_button_press_task.keys = _key_resp_button_press_task_allKeys[-1].name  # just the last key pressed
                key_resp_button_press_task.rt = _key_resp_button_press_task_allKeys[-1].rt
                key_resp_button_press_task.duration = _key_resp_button_press_task_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, inputs=inputs, win=win)
            return
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in button_press_taskComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "button_press_task" ---
    for thisComponent in button_press_taskComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    thisExp.addData('button_press_task.stopped', globalClock.getTime())
    thisExp.addData('button1.numClicks', button1.numClicks)
    if button1.numClicks:
       thisExp.addData('button1.timesOn', button1.timesOn)
       thisExp.addData('button1.timesOff', button1.timesOff)
    else:
       thisExp.addData('button1.timesOn', "")
       thisExp.addData('button1.timesOff', "")
    thisExp.addData('button2.numClicks', button2.numClicks)
    if button2.numClicks:
       thisExp.addData('button2.timesOn', button2.timesOn)
       thisExp.addData('button2.timesOff', button2.timesOff)
    else:
       thisExp.addData('button2.timesOn', "")
       thisExp.addData('button2.timesOff', "")
    thisExp.addData('button3.numClicks', button3.numClicks)
    if button3.numClicks:
       thisExp.addData('button3.timesOn', button3.timesOn)
       thisExp.addData('button3.timesOff', button3.timesOff)
    else:
       thisExp.addData('button3.timesOn', "")
       thisExp.addData('button3.timesOff', "")
    thisExp.addData('button4.numClicks', button4.numClicks)
    if button4.numClicks:
       thisExp.addData('button4.timesOn', button4.timesOn)
       thisExp.addData('button4.timesOff', button4.timesOff)
    else:
       thisExp.addData('button4.timesOn', "")
       thisExp.addData('button4.timesOff', "")
    # check responses
    if key_resp_button_press_task.keys in ['', [], None]:  # No response was made
        key_resp_button_press_task.keys = None
    thisExp.addData('key_resp_button_press_task.keys',key_resp_button_press_task.keys)
    if key_resp_button_press_task.keys != None:  # we had a response
        thisExp.addData('key_resp_button_press_task.rt', key_resp_button_press_task.rt)
        thisExp.addData('key_resp_button_press_task.duration', key_resp_button_press_task.duration)
    thisExp.nextEntry()
    # the Routine "button_press_task" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # --- Prepare to start Routine "text_entry_task" ---
    continueRoutine = True
    # update component parameters for each repeat
    thisExp.addData('text_entry_task.started', globalClock.getTime())
    textbox_text_entry_task.reset()
    # reset button_text_entry_task to account for continued clicks & clear times on/off
    button_text_entry_task.reset()
    # keep track of which components have finished
    text_entry_taskComponents = [text_text_entry_task, textbox_text_entry_task, button_text_entry_task]
    for thisComponent in text_entry_taskComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "text_entry_task" ---
    routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *text_text_entry_task* updates
        
        # if text_text_entry_task is starting this frame...
        if text_text_entry_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            text_text_entry_task.frameNStart = frameN  # exact frame index
            text_text_entry_task.tStart = t  # local t and not account for scr refresh
            text_text_entry_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(text_text_entry_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'text_text_entry_task.started')
            # update status
            text_text_entry_task.status = STARTED
            text_text_entry_task.setAutoDraw(True)
        
        # if text_text_entry_task is active this frame...
        if text_text_entry_task.status == STARTED:
            # update params
            pass
        
        # *textbox_text_entry_task* updates
        
        # if textbox_text_entry_task is starting this frame...
        if textbox_text_entry_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            textbox_text_entry_task.frameNStart = frameN  # exact frame index
            textbox_text_entry_task.tStart = t  # local t and not account for scr refresh
            textbox_text_entry_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(textbox_text_entry_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'textbox_text_entry_task.started')
            # update status
            textbox_text_entry_task.status = STARTED
            textbox_text_entry_task.setAutoDraw(True)
        
        # if textbox_text_entry_task is active this frame...
        if textbox_text_entry_task.status == STARTED:
            # update params
            pass
        # *button_text_entry_task* updates
        
        # if button_text_entry_task is starting this frame...
        if button_text_entry_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            button_text_entry_task.frameNStart = frameN  # exact frame index
            button_text_entry_task.tStart = t  # local t and not account for scr refresh
            button_text_entry_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(button_text_entry_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'button_text_entry_task.started')
            # update status
            button_text_entry_task.status = STARTED
            button_text_entry_task.setAutoDraw(True)
        
        # if button_text_entry_task is active this frame...
        if button_text_entry_task.status == STARTED:
            # update params
            pass
            # check whether button_text_entry_task has been pressed
            if button_text_entry_task.isClicked:
                if not button_text_entry_task.wasClicked:
                    # if this is a new click, store time of first click and clicked until
                    button_text_entry_task.timesOn.append(button_text_entry_task.buttonClock.getTime())
                    button_text_entry_task.timesOff.append(button_text_entry_task.buttonClock.getTime())
                elif len(button_text_entry_task.timesOff):
                    # if click is continuing from last frame, update time of clicked until
                    button_text_entry_task.timesOff[-1] = button_text_entry_task.buttonClock.getTime()
                if not button_text_entry_task.wasClicked:
                    # end routine when button_text_entry_task is clicked
                    continueRoutine = False
                if not button_text_entry_task.wasClicked:
                    # run callback code when button_text_entry_task is clicked
                    pass
        # take note of whether button_text_entry_task was clicked, so that next frame we know if clicks are new
        button_text_entry_task.wasClicked = button_text_entry_task.isClicked and button_text_entry_task.status == STARTED
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, inputs=inputs, win=win)
            return
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in text_entry_taskComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "text_entry_task" ---
    for thisComponent in text_entry_taskComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    thisExp.addData('text_entry_task.stopped', globalClock.getTime())
    thisExp.addData('textbox_text_entry_task.text',textbox_text_entry_task.text)
    thisExp.addData('button_text_entry_task.numClicks', button_text_entry_task.numClicks)
    if button_text_entry_task.numClicks:
       thisExp.addData('button_text_entry_task.timesOn', button_text_entry_task.timesOn)
       thisExp.addData('button_text_entry_task.timesOff', button_text_entry_task.timesOff)
    else:
       thisExp.addData('button_text_entry_task.timesOn', "")
       thisExp.addData('button_text_entry_task.timesOff', "")
    # the Routine "text_entry_task" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # --- Prepare to start Routine "slider_task" ---
    continueRoutine = True
    # update component parameters for each repeat
    thisExp.addData('slider_task.started', globalClock.getTime())
    key_resp_slider_task.keys = []
    key_resp_slider_task.rt = []
    _key_resp_slider_task_allKeys = []
    slider1.reset()
    slider2.reset()
    # keep track of which components have finished
    slider_taskComponents = [text_slider_task, key_resp_slider_task, slider1, slider2]
    for thisComponent in slider_taskComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "slider_task" ---
    routineForceEnded = not continueRoutine
    while continueRoutine:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *text_slider_task* updates
        
        # if text_slider_task is starting this frame...
        if text_slider_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            text_slider_task.frameNStart = frameN  # exact frame index
            text_slider_task.tStart = t  # local t and not account for scr refresh
            text_slider_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(text_slider_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'text_slider_task.started')
            # update status
            text_slider_task.status = STARTED
            text_slider_task.setAutoDraw(True)
        
        # if text_slider_task is active this frame...
        if text_slider_task.status == STARTED:
            # update params
            pass
        
        # *key_resp_slider_task* updates
        waitOnFlip = False
        
        # if key_resp_slider_task is starting this frame...
        if key_resp_slider_task.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            key_resp_slider_task.frameNStart = frameN  # exact frame index
            key_resp_slider_task.tStart = t  # local t and not account for scr refresh
            key_resp_slider_task.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(key_resp_slider_task, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'key_resp_slider_task.started')
            # update status
            key_resp_slider_task.status = STARTED
            # keyboard checking is just starting
            waitOnFlip = True
            win.callOnFlip(key_resp_slider_task.clock.reset)  # t=0 on next screen flip
            win.callOnFlip(key_resp_slider_task.clearEvents, eventType='keyboard')  # clear events on next screen flip
        if key_resp_slider_task.status == STARTED and not waitOnFlip:
            theseKeys = key_resp_slider_task.getKeys(keyList=['t'], ignoreKeys=["escape"], waitRelease=False)
            _key_resp_slider_task_allKeys.extend(theseKeys)
            if len(_key_resp_slider_task_allKeys):
                key_resp_slider_task.keys = _key_resp_slider_task_allKeys[-1].name  # just the last key pressed
                key_resp_slider_task.rt = _key_resp_slider_task_allKeys[-1].rt
                key_resp_slider_task.duration = _key_resp_slider_task_allKeys[-1].duration
                # a response ends the routine
                continueRoutine = False
        
        # *slider1* updates
        
        # if slider1 is starting this frame...
        if slider1.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            slider1.frameNStart = frameN  # exact frame index
            slider1.tStart = t  # local t and not account for scr refresh
            slider1.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(slider1, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'slider1.started')
            # update status
            slider1.status = STARTED
            slider1.setAutoDraw(True)
        
        # if slider1 is active this frame...
        if slider1.status == STARTED:
            # update params
            pass
        
        # *slider2* updates
        
        # if slider2 is starting this frame...
        if slider2.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            slider2.frameNStart = frameN  # exact frame index
            slider2.tStart = t  # local t and not account for scr refresh
            slider2.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(slider2, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'slider2.started')
            # update status
            slider2.status = STARTED
            slider2.setAutoDraw(True)
        
        # if slider2 is active this frame...
        if slider2.status == STARTED:
            # update params
            pass
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, inputs=inputs, win=win)
            return
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in slider_taskComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "slider_task" ---
    for thisComponent in slider_taskComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    thisExp.addData('slider_task.stopped', globalClock.getTime())
    # check responses
    if key_resp_slider_task.keys in ['', [], None]:  # No response was made
        key_resp_slider_task.keys = None
    thisExp.addData('key_resp_slider_task.keys',key_resp_slider_task.keys)
    if key_resp_slider_task.keys != None:  # we had a response
        thisExp.addData('key_resp_slider_task.rt', key_resp_slider_task.rt)
        thisExp.addData('key_resp_slider_task.duration', key_resp_slider_task.duration)
    thisExp.nextEntry()
    thisExp.addData('slider1.response', slider1.getRating())
    thisExp.addData('slider1.rt', slider1.getRT())
    thisExp.addData('slider2.response', slider2.getRating())
    thisExp.addData('slider2.rt', slider2.getRT())
    # the Routine "slider_task" was not non-slip safe, so reset the non-slip timer
    routineTimer.reset()
    
    # --- Prepare to start Routine "finish" ---
    continueRoutine = True
    # update component parameters for each repeat
    thisExp.addData('finish.started', globalClock.getTime())
    # keep track of which components have finished
    finishComponents = [text_finish]
    for thisComponent in finishComponents:
        thisComponent.tStart = None
        thisComponent.tStop = None
        thisComponent.tStartRefresh = None
        thisComponent.tStopRefresh = None
        if hasattr(thisComponent, 'status'):
            thisComponent.status = NOT_STARTED
    # reset timers
    t = 0
    _timeToFirstFrame = win.getFutureFlipTime(clock="now")
    frameN = -1
    
    # --- Run Routine "finish" ---
    routineForceEnded = not continueRoutine
    while continueRoutine and routineTimer.getTime() < 5.0:
        # get current time
        t = routineTimer.getTime()
        tThisFlip = win.getFutureFlipTime(clock=routineTimer)
        tThisFlipGlobal = win.getFutureFlipTime(clock=None)
        frameN = frameN + 1  # number of completed frames (so 0 is the first frame)
        # update/draw components on each frame
        
        # *text_finish* updates
        
        # if text_finish is starting this frame...
        if text_finish.status == NOT_STARTED and tThisFlip >= 0.0-frameTolerance:
            # keep track of start time/frame for later
            text_finish.frameNStart = frameN  # exact frame index
            text_finish.tStart = t  # local t and not account for scr refresh
            text_finish.tStartRefresh = tThisFlipGlobal  # on global time
            win.timeOnFlip(text_finish, 'tStartRefresh')  # time at next scr refresh
            # add timestamp to datafile
            thisExp.timestampOnFlip(win, 'text_finish.started')
            # update status
            text_finish.status = STARTED
            text_finish.setAutoDraw(True)
        
        # if text_finish is active this frame...
        if text_finish.status == STARTED:
            # update params
            pass
        
        # if text_finish is stopping this frame...
        if text_finish.status == STARTED:
            # is it time to stop? (based on global clock, using actual start)
            if tThisFlipGlobal > text_finish.tStartRefresh + 5.0-frameTolerance:
                # keep track of stop time/frame for later
                text_finish.tStop = t  # not accounting for scr refresh
                text_finish.frameNStop = frameN  # exact frame index
                # add timestamp to datafile
                thisExp.timestampOnFlip(win, 'text_finish.stopped')
                # update status
                text_finish.status = FINISHED
                text_finish.setAutoDraw(False)
        
        # check for quit (typically the Esc key)
        if defaultKeyboard.getKeys(keyList=["escape"]):
            thisExp.status = FINISHED
        if thisExp.status == FINISHED or endExpNow:
            endExperiment(thisExp, inputs=inputs, win=win)
            return
        
        # check if all components have finished
        if not continueRoutine:  # a component has requested a forced-end of Routine
            routineForceEnded = True
            break
        continueRoutine = False  # will revert to True if at least one component still running
        for thisComponent in finishComponents:
            if hasattr(thisComponent, "status") and thisComponent.status != FINISHED:
                continueRoutine = True
                break  # at least one component has not yet finished
        
        # refresh the screen
        if continueRoutine:  # don't flip if this routine is over or we'll get a blank screen
            win.flip()
    
    # --- Ending Routine "finish" ---
    for thisComponent in finishComponents:
        if hasattr(thisComponent, "setAutoDraw"):
            thisComponent.setAutoDraw(False)
    thisExp.addData('finish.stopped', globalClock.getTime())
    # using non-slip timing so subtract the expected duration of this Routine (unless ended on request)
    if routineForceEnded:
        routineTimer.reset()
    else:
        routineTimer.addTime(-5.000000)
    
    # mark experiment as finished
    endExperiment(thisExp, win=win, inputs=inputs)


def saveData(thisExp):
    """
    Save data from this experiment
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    """
    filename = thisExp.dataFileName
    # these shouldn't be strictly necessary (should auto-save)
    thisExp.saveAsWideText(filename + '.csv', delim='auto')
    thisExp.saveAsPickle(filename)


def endExperiment(thisExp, inputs=None, win=None):
    """
    End this experiment, performing final shut down operations.
    
    This function does NOT close the window or end the Python process - use `quit` for this.
    
    Parameters
    ==========
    thisExp : psychopy.data.ExperimentHandler
        Handler object for this experiment, contains the data to save and information about 
        where to save it to.
    inputs : dict
        Dictionary of input devices by name.
    win : psychopy.visual.Window
        Window for this experiment.
    """
    if win is not None:
        # remove autodraw from all current components
        win.clearAutoDraw()
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed
        win.flip()
    # mark experiment handler as finished
    thisExp.status = FINISHED
    # shut down eyetracker, if there is one
    if inputs is not None:
        if 'eyetracker' in inputs and inputs['eyetracker'] is not None:
            inputs['eyetracker'].setConnectionState(False)
    logging.flush()


def quit(thisExp, win=None, inputs=None, thisSession=None):
    """
    Fully quit, closing the window and ending the Python process.
    
    Parameters
    ==========
    win : psychopy.visual.Window
        Window to close.
    inputs : dict
        Dictionary of input devices by name.
    thisSession : psychopy.session.Session or None
        Handle of the Session object this experiment is being run from, if any.
    """
    thisExp.abort()  # or data files will save again on exit
    # make sure everything is closed down
    if win is not None:
        # Flip one final time so any remaining win.callOnFlip() 
        # and win.timeOnFlip() tasks get executed before quitting
        win.flip()
        win.close()
    if inputs is not None:
        if 'eyetracker' in inputs and inputs['eyetracker'] is not None:
            inputs['eyetracker'].setConnectionState(False)
    logging.flush()
    if thisSession is not None:
        thisSession.stop()
    # terminate Python process
    core.quit()


# if running this experiment as a script...
if __name__ == '__main__':
    # call all functions in order
    expInfo = showExpInfoDlg(expInfo=expInfo)
    thisExp = setupData(expInfo=expInfo)
    logFile = setupLogging(filename=thisExp.dataFileName)
    win = setupWindow(expInfo=expInfo)
    inputs = setupInputs(expInfo=expInfo, thisExp=thisExp, win=win)
    run(
        expInfo=expInfo, 
        thisExp=thisExp, 
        win=win, 
        inputs=inputs
    )
    saveData(thisExp=thisExp)
    quit(thisExp=thisExp, win=win, inputs=inputs)
