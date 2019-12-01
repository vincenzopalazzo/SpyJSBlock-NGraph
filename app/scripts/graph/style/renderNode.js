//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

import eventfy from 'ngraph.events'

let LouvianAlgo = require('../algorithms/Louvian');

module.exports = function (animatedNode, ctx) {
/*
  if(animatedNode.addEvent === undefined || animatedNode.addEvent === false){
    console.log('add events');
    animatedNode.addEvent = true;
    eventfy(animatedNode);
  }*/

  animatedNode.renderFrame();
  ctx.lineStyle(0);
  let colorClass = LouvianAlgo.getInstance().getColorForClass(animatedNode.node);
  if(colorClass){
    ctx.beginFill(colorClass, 1);
  }else{
    ctx.beginFill(animatedNode.color,1);
  }
  ctx.drawCircle(animatedNode.pos.x, animatedNode.pos.y, animatedNode.width);
/*
  animatedNode.on('explore', function(text){
    mcxDialog.confirm('The tx id of the node is: ' + text,{
      animationType: 'zoom',
      width: 550,  
      height: 200, 
      titleStyle: {
        color: '#ffbd39',
        background: '#212121'
      },
      buttonStyle: [{
        color: '#ffbd39',
        border: '1px solid #323232',
        backgroundColor: '#323232'
      },{
        color: '#FFFFFF',
        border: '1px solid #323232',
        backgroundColor: '#323232'
      }
      ],
      title: 'Info node',
      btn: ['Find on Blockstream', 'Close'],
      btnClick: function(index){  
        if(index === 0){
          window.open('https://blockstream.info/tx/' + text);
        }
      }
    });
  })

  ctx.click = function(){
    animatedNode.fire('explore', animatedNode.textLabel);
  };*/

}
