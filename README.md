# ROTATOR

A simple web app for managing player substitutions in sports that allow unlimited rotation (ie, futsal.) 

Set up your game, players and sub rules and Rotator will automatically calculate a subs plan that ensures the team equally shares the time on the field and bench. If you need to make unexpected subs, it'll help you track who still needs to be subbed and when. 


## Usage


### Configuration 

In Game Setup, configure the number of periods, period length and how many players are on the field at once. 

In the Players view, set up your roster of players. If players on the roster aren't available for a match you can set them as inactive to hide them from the Game view. 

In Sub Setup, configure how many players to change at each sub and how many spells on the bench a player should have per period. You can also configure when the app will play an alert sound to let you know that a sub is coming up soon. 


### During the game

Start the game clock to begin the game. The Next Sub clock shows the time until your next sub is due. 

A sound plays when a sub is coming up soon, and an arrow icon displays next to the players who should be subbed according to the plan. To make the suggested sub, press the Auto Sub button to queue it up. To make a different sub, select the players by pressing their names. A second sound will play whne it's time for the sub; press the Make Sub button to make the change. 

Once a player's completed all of their subs, a hand icon will appear next to their name, indicating they need to stay where they are. These players will be moved to the bottom of the list; if you've 

If you miss a sub, can't make a sub or have to make an unplanned sub, a circled arrow icon indicates that a player has exceeded their time in the current state and should be subbed when you get a chance. 


Note - once the game clock starts the pause button is hidden to prevent accidentally stopping the clock. Click the lock button to display it for five seconds. 


#### Pinning players 

Players can be "pinned" to the field or the bench if you don't want them to rotate (ie, goalkeeper, an injured player.) Long-press on the player's name to toggle; a padlock icon indicates a pinned player. 

Pinning a player (or toggling inactive/active in the Players config) will recalculate the sub plan. If it happens early enough in the game, the existing subs will be kept with the timing adjusted to make up for the change. If it happens later on then the existing timing will be kept but some players may miss out on a sub. 


#### Locking the UI

Pressing the padlock icon in the top left will lock the entire interface so no buttons can be pressed - useful if you need to put your phone in your pocket during gameplay. You can then unlock the UI by pressing the button again.
