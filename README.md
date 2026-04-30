# ROTATOR

A simple web app for managing substitutions in sports that let have unlimited subs (ie, futsal.)



## Usage


### Configuration 

In the Players view, add all the players on your team. You can toggle players as active/inactive so any players who aren't available for a match can be temporarily hidden from the game view.

In Game Setup, configure the number of periods, period length and how many players are on the field at once. 

In Sub Setup, configure how many players you want to change at a time and how many turns a player should have on the bench during a period. The summary underneath will explain what's going to happen in detail. 


### During the game

Start the game clock to begin the game. The sub clock will show you how long until the next sub should be made. 30 seconds before a sub is due, you'll get an alert sound. You'll get a second alert sound when it's time to make the sub. 

To make a sub, you can either press the Auto Sub button to automatically select the players for the sub, or you can manually select the players. Press the Make Sub button to make the substitution. 


When a player has spent enough time either on the field or on the bench for their current turn, a light arrow icon will appear next to their name, indicating they're ready to be subbed. 

If the player has spent enough time on the field or the bench for the entire period, a darker circular arrow icon will appear next to their name, indicating that they're ready to be subbed for the last time. If the hand icon appears next to a player's name, it means they've spent enough time in the _other_ state and shouldn't be subbed. 


You can pause the game clock at any time by pressing the pause button, and reset it by pressing the reset button underneath it. 



## Todo List

### New features & improvements
- Hide or lock the play/reset buttons so you don't accidentally press them. 


### Minor fixes & Tweaks
- I think changing inactive/active players need to recalc sub config
- Game component visual updates
	- Sub/clear button styling needs work
	- Player list headers ("field" and "bench") also a bit off 


