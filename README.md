# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* After 3 specters, balloon starts flashing, "Press SPACE to enter the spectral plane"
    * balloon becomes ghostly, spooky hum plays, no collisions occur
    * last 10 seconds or so
    * can make the game more difficult with this powerup
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
