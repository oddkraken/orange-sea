# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* INVESTIGATE MEMORY LEAKS!
* Let 3 balloons get by before dying
    * "A servant has eluded me! The Shadow grows stronger."
    * bad balloon flashes red if x < ~200
    * Shadow gets larger (no longer a function of balloon.x)
    * Loss animation that explains what happens
* Shadow doesn't kill you
* Use smaller boxes
    * place hole at correct height
    * vary hole.x randomly?
* Part Two: Nocturnal Sycophants
    * Get rid of the "not flying at night" thing, find another way to indicate there's a level end / reprieve
* Combos
    * "2 for 1!"
    * End screen: "Best multi-shot: 4 for 1!"
* Dead animation
* BIG balloon BOSS that takes 5 pearls to bring down
    * Music
    * "A formidable airship!"
* Add MUSKET graphic to balloon, change direction with arrow keys
* Angler Fish?
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
