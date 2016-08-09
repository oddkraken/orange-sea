# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* STATS!
    * Combos will make it WAY more fun
        * "Double hit!"
        * End screen: "Best multi-hit: 5; Enemies Vanquished: 10"
    * Enemy killed count above ALL enemies, like pearl count except allow duplicates
* Let player go all the way to the right, and make pearls appear at any x val
* Something GOOD needs to lure player to right of screen
    * rapid pearl burst?
* MOON! SUPER EASY!
* Design level configuration system:
    * boss HP
    * write moonrise function
    * SPEECH
* Dead animation
    * Shadow grows, evil music plays, camera fades out
* "The Aeronaut" - aeronaut.oddkraken.com
* Boss music
* Angler Fish?
* Does fish fall while off screen? look into that.
* Trim silence in thunder mp3
* Let 3 balloons get by before dying
    * "A servant has eluded me! The Shadow grows stronger."
    * bad balloon flashes red if x < ~200
    * Shadow gets larger (no longer a function of balloon.x)
    * Loss animation that explains what happens
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
