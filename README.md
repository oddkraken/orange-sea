# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* Fix hitboxes: compose craft of balloon + basket sprites
* first boss - small weak spot
* enemy types - each have different graphic
    * standard
    * fast/small (lightning bolt icon)
    * shooter (muskets)
* Balloons drop chests
    * "+10 Pearls!"
    * "+3 Gems!"
    * ding ding piano sound
* badBalloon/fish collisions cause you to drop pearls
* propellers
* Happy music when boss falls
* Different night music
* mollusks throw gems sometimes
* island with merchant to spend gems
    * repeater - no reload, usually too expensive to buy from first merchant
    * propeller - double tap to boost
    * shield - more hp
* Evil ghost balloons come from shadow at night and try to knock you into the water!
* End screen: "Best multi-hit: 5; Enemies Vanquished: 10"
* Level configuration system:
    * boss HP
    * SPEECH
* Dead animation
* New Title??
    * "Aeronaut Defender" - aeronaut.oddkraken.com / aeronaut.mtk4000.com
    * "The Aeronaut's Odyssey"
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
