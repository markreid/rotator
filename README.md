# ROTATOR

A simple web app for managing substitutions in sports that let have unlimited subs (ie, futsal.)



## Usage


### Configuration 

In the Players view, add all the players on your team. You can toggle players as active/inactive so any players who aren't available for a match can be temporarily hidden from the game view.

In Game Setup, configure the number of periods, period length and how many players are on the field at once. 

In Sub Setup, configure how many players you want to change at a time and how many turns a player should have on the bench during a period. You can also configure how long in advance the app will warn you about an upcoming sub by playing an alert tone (default is 30s.) The summary underneath explains what's going to happen in detail. 


### During the game

Start the game clock to begin the game. The pause button is hidden during gameplay so you don't press it by mistake; click the unlock button to display it for five seconds. 

The Next Sub clock will show you how long until the next sub should be made. When the upcoming sub alert plays, an arrow icon will display next to the players who should be subbed next, based on how much time they've spend on the field or bench during the current spell. If you want to make the suggested sub, click the Auto Sub button to queue it up. Otherwise manually select the players by pressing on their names. 

When you're ready to make the sub, press the Make Sub button. 


Once a player has exceeded the total amount of time they should be spending on the field or bench for a period, a darker circular arrow icon will appear on their name, indicating that they should be subbed as soon as possible. 

If a player shouldn't be subbed because they've already exceeded their time on the field or bench, a hand icon will appear next to their name, indicating they should stay where they are. 



## Todo List

### New features & improvements


### Minor fixes & Tweaks
- I think changing inactive/active players need to recalc sub config
- Game component visual updates
	- Sub/clear button styling needs work
	- Player list headers ("field" and "bench") also a bit off 


