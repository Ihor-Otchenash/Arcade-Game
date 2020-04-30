# Endless Adventure

A game where Player has to survive as long as he can with no time count with the score option implemented.

# Running a game

Simply open index.html file in your browser.

# Game dependencies

The game has no specific dependencies, the font has been taken from Google fonts page and is connected to this game.

# Application logic

There are **3 types of fields** in the game:

* Grass. Here Player can freely move, no enemies should appear here. Also, no extra stuff to be expected on this ground.
* Stones. Enemies are walking around this zone. Also, some useful stuff can be picked up here (gems, extra lives).
* Water. When Player reaches the water, he gets into the new round (just resetting the standard position of the Player) with no lives loss.

The main purpose of the game is to get more scores till character still has lives.

There is a **Player** (main character in the game). User can go with the character all sides (top, right, bottom, left), but cannot go out of the game board.

There are **3 Enemies** which appear on only Stones fields. When Player and any Enemy meet each other, Player loses 1 live and his positions is being reset. Enemies are going from the very left to the very right side on the Stones lines. Their position and speed are randomly generated every time they appear.

Every time user reaches the Water, he will get in to the **New Round**. New round means that the Round count is growing by 1 in the background. Everytime it reaches 10th round (called Bonus level), new extra live will appear randomly on the Stones zone. Every time Player meets an Enemy, round will be restared with a 1 live loss. After Bonus level has passed the count also will be reset.

Player has **3 Lives** at the beginning of the game. Each time Player meets an enemy, he loses 1 live. There is an extra live is being randomly generated every 10th Round on the Stones fields which can be picked within 5 seconds. If Player takes that live, he get +1 live to the total count. If not, extra live disappers within 5 seconds. Also, if the heart appeared on the game board and Player met an Enemy, live will disappear. If user goes to next Round and hasn't taken an extra live, it will disappear from the game board. Player can have not more than 5 lives. If Player has 5 lives, no extra lives to be generated on the board until he loses one live.

There is 1 **Blue Gem** is being randomly generated every 5 seconds. If user picks it up, he gets +100 point to the scores count (left top corner) after new gem will appear somewhere on the game board. If user didn't pick it up, it will change the position. If user picks up the gem.

**Game over** pop up will show up when Player loses all lives. Player cannot move and the user has an option to restart the game by pressing Enter. If user decided to restart the game, it will be reset to standard set (3 lives, 0 round, standard Player position, new gem generated, Enemies start coming from the beginning with new speed).