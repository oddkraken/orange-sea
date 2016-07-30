# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* MOBILE
    * improve controls!
* "As he takes flight from the advancing Shadow, the aeronaut ascends far above the waves and eyes the approaching legion. He must not allow these fallen souls to strengthen their Master. Brandishing his empty musket in vain, he pilots the fire balloon into the gale and steels himself for the trials to come..."
* Specter makes noise as it flies by
* Pearl rips hole in balloon
* vary pop noise based on size of balloon
* gradually increase sycophants
* Angler Fish doesn't actually do anything, just looks scary
    * snaps jaws shut if you fall in
* Then clouds start
* Then specter
    * Specter auto-initializes if x < 0
    * Pushes balloon forward (and up if close to water)
* BOSS
    * After storm ends, pirate ship arrives, waves stop, Pirates bar the way and shoot cannons
    * Cannons put holes in balloon, each one makes it harder to stay up
    * Drop 3 pearls on ship to sink it
    * Each one lowers its level in the water and stays on the deck
    * When it sinks, leave sparkling flotsam containing a powerup
    * After you pick it up, right side of screen glows indicating level end

* tint camera color in spectral plane if possible
* Replace speech with webfont, maybe
* Does fish fall while off screen? look into that.
* "SPACE: interact" in instructions
* Every 10th cloud is white and pushes you forward?
* Trim silence in thunder mp3
* Design good and bad "encounters" to be used throughout Chapters
    * Good
        * goodies - blunderbuss, weight (slower balloon, less effected by wind)
        * find goodies in derelict balloon, ship, or flotsam
        * commandeer derelict
        * "eye of the storm" - stop clouds for 10 seconds or so.
        * sky opens up and you can play above the dark clouds.
        * specters
    * Bad
        * Whale jumping
        * pirates shooting at you
        * tentacle
        * mountain
* New music - 3/4 time? Accordion / bagpipe / violin - idk

## Issues

* Renderers
    * Phaser.WEBGL
        * blending modes don't work, so lightning doesn't look right
        * still a little too slow for fog filter
    * Phaser.CANVAS - rope alpha very buggy
