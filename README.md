# Orange Sea

An HTML5 game written in JavaScript using the [Phaser](http://phaser.io) library. The player controls a hot air balloon and guides it through various perils in an attempt to cross the Orange Sea. Work in progress! Play for free at [orangesea.oddkraken.com](http://orangesea.oddkraken.com).

## Todo

* boss shoots!
* Spooky phantasm sound, gets louder when close
* badBalloon/fish collisions/strike cause you to drop pearls
* enemy types - each have different graphic
    * standard
    * fast/small (lightning bolt icon)
    * shooter (muskets)
* Balloons drop chests
    * 10, 25, or 50 pearls
* boss
    * Happy music on victory
    * drops shiny balloon slot
* Different night music
* flying merchant to spend pearls...flies from left after level ends
    * repeater - no reload, usually too expensive to buy from first merchant
    * propeller - double tap to boost
    * shield - more hp
    * theme!
* End screen: "Best multi-hit: 5; Enemies Vanquished: 10"
* Level configuration system:
    * boss HP
    * SPEECH
* Dead animation
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
