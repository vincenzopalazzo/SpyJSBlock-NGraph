//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

// TODO remove the animation
module.exports = function (node) {
  return new AnimatedNode(node);
}

var colorLookup = [0x1967be, 0x2780e3];

function AnimatedNode(node) {
  this.node = node;
  this.color = colorLookup[(Math.random() * colorLookup.length)|0];
  this.frame = Math.random();
  this.width = Math.random() * 5 + 5;
  this.v = 1 - Math.random() * 0.01;
}

AnimatedNode.prototype.renderFrame = function() {
  if (this.frame < 0.6) {
    this.frame = 1;
    this.color = colorLookup[(Math.random() * colorLookup.length)|0];
    this.width = Math.random() * 5 + 5;
    this.v = 0.99999 - Math.random() * 0.01;
  }

  this.frame *= this.v;
  this.width *= this.v;
}
