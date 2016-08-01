# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* More balloon drag
* TUTORIAL - only show once, after they kill 1 balloon, don't repeat it
    * One balloon, VERY slow
    * "A servant of the Shadow! I must not let it pass. If only I had some ammunition..."
    * THEN pearls start
    * Only add pearl explanation when caught
* Let 3 balloons get by before dying
    * "A servant has eluded me! The Shadow grows stronger."
    * bad balloon flashes red if x < ~200
    * Shadow gets larger (no longer a function of balloon.x)
    * Loss animation that explains what happens
* Shadow and sea don't kill you?
* No power-up in level 1
* Short easy level, congratulate player,
* Add MUSKET graphic to balloon, change direction with arrow keys
* Specter makes noise as it flies by
* Angler Fish?
* tint camera color in spectral plane if possible
* Replace speech with webfont, maybe
* Does fish fall while off screen? look into that.
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
