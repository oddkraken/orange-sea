# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* badBalloon/fish collisions cause you to drop pearls
* propellers
* Happy music when boss falls
* Different night music
* Give player a sense of progress and curiosity...
    * big balloons drop something
        * chest full of pearls
    * items - cycle through with numbers
        * 1. add reload sound/delay to musket, rename to rifle - IMPORTANT SO YOU CAN'T RAPIDFIRE THE BOSSES!
        * 2. repeater - weaker/slower shot, no delay
        * 3. boost - ram to melee attack balloon
* Evil ghost balloons come from shadow at night and try to knock you into the water!
* End screen: "Best multi-hit: 5; Enemies Vanquished: 10"
* Something GOOD needs to lure player to right of screen
    * rapid pearl burst?
* Level configuration system:
    * boss HP
    * write moonrise function
    * SPEECH
* Dead animation
    * Shadow grows, evil music plays, camera fades out
* New Title??
    * "The Lost Aeronaut" - aeronaut.oddkraken.com / aeronaut.mtk4000.com
* Angler Fish?
* Does fish fall while off screen? look into that.
* Trim silence in thunder mp3
* New music - 3/4 time? Accordion / bagpipe / violin - idk

## Issues

* Renderers
    * Phaser.WEBGL
        * blending modes don't work, so lightning doesn't look right
        * still a little too slow for fog filter
    * Phaser.CANVAS - rope alpha very buggy
