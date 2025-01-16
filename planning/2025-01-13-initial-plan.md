# Goal
The goal is to have a system that can be deployed in the wild and in a public place that we can use to be able to collect large amounts of music research data.

# User Experience
- The participant sits down at the Brain Music Data Station: Welcome screen
	- Explains the controls, hit green button to continue. Otherwise walk away. 
	- Explains what it is and how it works. 
	- Choose between a number of music related activities or games
	- Your data will help advance music cognition science
	- This is the informed consent page. They click "I understand and would like to proceed."
- They are brought to a dashboard with a bunch of different studies or activities that they can choose from.
	- Hovering over an activity gives a summary of the project and estimated time to complete.
	- Help icon in the corner to help people confused.
- Controls:
	- Joystick in place of mouse
	- Four buttons
	- sliders
	- hand sensors
	- qwerty keyboard
- Click an activity - that activity launches
	- Designed user experience for that specific activity launches
	- At the end of the activity, go back to the welcome screen. (We don't want people getting to an activity without seeing the informed consent on the welcome screen.)

# Requirements
### The application must
- Display a welcome screen with informed consent information
- display a dashboard where multiple studies can be seen and started
- Dashboard should time out after no user input for X minutes and go back to welcome screen.
- provide a help option to confused users
- Respond to user input via hardware controls for all studies
- Transmit data using the protocol set up by Thiago and Daniel Ll.
- be able to seamlessly run different PsychoPy studies (all studies will be made with PsychoPy). This means being able to execute a python script.

# UX / UI Design
### Brainstorming
- Header and footer seen across the top and bottom
	- Maybe the header displays control instructions. Ex: Use the joystick to move, buttons to do stuff"
	- Footer maybe for contact info or to report a problem. 
- Study icons are squares on the dashboard with image or icon that study.
	- Hovering over it makes a highlighted edge around the square (feedback to user)
	- Maybe the square gets slightly darker on hover, and info pops up.
- When a study is clicked
	- separate window maximized over the dashboard (from python file)

# Tech Stack Options
- PsychoPy
- Dashboard backend and GUI
	- C++ and QT
	- C++ and ImGui
	- Python and Tkinter
	- Typescript and Node.js