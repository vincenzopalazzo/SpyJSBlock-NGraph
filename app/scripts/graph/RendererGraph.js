//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

import BuildPixiGraphics from 'ngraph.pixi';
import { scene as makeWGLScene, PointCollection, WireCollection} from 'w-gl';
import Layout from 'ngraph.forcelayout';
import workerize from 'workerize'
import PiexeBuilder from 'ngraph.pixel'
import ManagerUtil from '../utils/ManagerUtils'

const physicsSettings = {
  springLength: 30,
  springCoeff: 0.0008,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 20,
};

let settings = {
  //Setting ngraph.pixi
  rendererOptions: {
    backgroundColor: 0x424242,
    antialias: true,
  },
  labelConf: {
    enable: false,
  },
  physics: physicsSettings
  //layout: self.layout,
};

let layoutSteps = 1000;
let drawLinks = true;

class RendererGraph{

    constructor(idContainer, graph, type_module='pixi'){
        this.graph = graph;
        settings.container = document.getElementById(idContainer);
        this.type_module = type_module;
        if(type_module === 'pixi'){
          this.pixiGraphics = BuildPixiGraphics(graph, settings);
          this.layout = this.pixiGraphics.layout;
        }else if(type_module === 'w-gl'){
          this.layout = Layout(graph, physicsSettings);
        }else if(type_module === 'pixel'){
          this.renderer = PiexeBuilder(graph, {
            is3d: true,
            container: settings.container,
            node: _createNodePixel,
            link: _createPixelLink,
            clearColor: 0x616161,
            physics: {
              integrator: 'verlet'
            }
          })
          this.renderer.background = _background;
          this.layout = this.renderer.layout;
        }

        this.computationWorker = workerize(`
          export function comp(computation, layout) {
            for(let i = 0; i < computation; i++){
              layout.step();
            }
          }
      `);
    }

    rendererGraph(){
      if(this.type_module === 'pixi'){
        _configurePixiGraphics(this.pixiGraphics);
      }else if(this.type_module === 'w-gl'){
        _config_wgl(this.graph, this.layout);
      }else if(this.type_module === 'pixel'){
        _events(this.renderer);
      }
    }

    stopRenderer(){
      if(this.type_module === 'pixi'){
        this.pixiGraphics.stop();
      }else if(this.type_module === 'pixel'){
        this.renderer.stable(true);
      }
    }

    resumeRenderer(){
      if(this.type_module === 'pixi'){
        this.pixiGraphics.resume();
      }else if(this.type_module === 'pixel'){
        this.renderer.stable(false);
      }
    }

    runRenderer(){
        if(this.type_module === 'pixi'){
          this.pixiGraphics.run();
          
        }else if(this.type_module === 'w-gl'){
          this.layout.step();
        }
    }

    computeLayout(computation){
      if(computation < 0){
        console.log('**** START COMPUTATION ******');
        this.computationWorker.comp(computation, this.layout);
      }
    }

    //getter
    getLayout(){
      if(!this.layout){
        throw Error('layout null');
      }
      return this.layout;
    }

}

export default RendererGraph;

//private method

//PRIVATE API w-gl
function _config_wgl(graph, layout){
  if(!graph){
    throw Error('Graph null');
  }

  let scene = _initScene();

  layout.step();
  let ui = _initUIElements(graph, scene, layout);
  let linkUI = ui.linkUI;
  let nodeUI = ui.nodeUI;
  let rafHandle = requestAnimationFrame(_frame);

  function _frame() {
    rafHandle = requestAnimationFrame(_frame);

    if (layoutSteps > 0) {
      layoutSteps -= 1;
      layout.step();
    }
    _drawGraph(graph, layout, nodeUI, linkUI);
    scene.renderFrame();
  }
}

function _initScene() {
    let canvas = _createCanvas();
    console.debug('Canvas: ', canvas)
    let scene = makeWGLScene(canvas);
    scene.setClearColor(42/255, 42/255, 42/255, 1)
    let initialSceneSize = 100;
    scene.setViewBox({
      left:  -initialSceneSize,
      top:   -initialSceneSize,
      right:  initialSceneSize,
      bottom: initialSceneSize,
    });
    return scene;
}

function _initUIElements(graph, scene, layout) {
    let nodeIdToUI = new Map();
    let linkIdToUI = new Map();
    let nodes = new PointCollection(graph.getNodesCount());
    graph.forEachNode(node => {
      var point = layout.getNodePosition(node.id);
      let size = 10;
      if (node.data && node.data.size) {
        size = node.data.size;
      } else {
        if (!node.data) node.data = {};
        node.data.size = size;
      }
      point.size = size
      point.color = {
        r: 114/255,
        g: 248/255,
        b: 252/255,
      }
      var ui = nodes.add(point, node.id);
      nodeIdToUI.set(node.id, ui);
    });

    let lines = new WireCollection(graph.getLinksCount());
    lines.color.r = 6/255;
    lines.color.g = 28/255;
    lines.color.b = 70/255;
    lines.color.a = 0.2;

    graph.forEachLink(link => {
      var from = layout.getNodePosition(link.fromId);
      var to = layout.getNodePosition(link.toId);
      var line = { from, to };
      var ui = lines.add(line);
      linkIdToUI.set(link.id, ui);
    });

    scene.appendChild(lines);
    scene.appendChild(nodes);

    return {nodeUI: nodeIdToUI, linkUI: linkIdToUI};
  }


function _drawGraph(graph, layout, nodeUI, linkUI) {
  graph.forEachNode(node => {
    var pos = layout.getNodePosition(node.id);
    nodeUI.get(node.id).update(pos);
  });
  if (drawLinks) {
    graph.forEachLink(link => {
      var fromPos = layout.getNodePosition(link.fromId);
      var toPos = layout.getNodePosition(link.toId);
      linkUI.get(link.id).update(fromPos, toPos);
    })
  }
}

function _createCanvas(){
  let containerCanvas = settings.container;
  var canvas = document.createElement('canvas');

  canvas.id = "w-gl-container";
  canvas.style.width ='100%';
  canvas.style.height='100%';
  // ...then set the internal size to match
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  containerCanvas.appendChild(canvas);
  return canvas;
}

//private API pixi
function _configurePixiGraphics(pixiGraphics){
    pixiGraphics.createNodeUI(require('./style/createNodeUI'));
    pixiGraphics.renderNode(require('./style/renderNode'));
    pixiGraphics.createLinkUI(require('./style/createLinkUI'));
    pixiGraphics.renderLink(require('./style/renderLink'));
}

//private API pixel
function _createNodePixel(node){
  if (node.data === 'hidden'){return;}
  return {
    color: ManagerUtil.getInstance().getRandomNodeColor(),
    size: 50
  }
}

function _createPixelLink(link){
  return {
    fromColor: 0xcfd8dc,
    toColor: 0x546e7a
  };
}

function _background(){
 return _normalizeColor(0x424242);
}

function _normalizeColor(color) {
  if (color === undefined) return color;
  var colorType = typeof color;
  if (colorType === 'number') return color;
  if (colorType === 'string') return parseStringColor(color);
  if (color.length === 3) return (color[0] << 16) | (color[1] << 8) | (color[2]);
  throw new Error('Unrecognized color type: ' + color);
}

function _events(renderer){
  renderer.on('nodedblclick', function(node) {
    mcxDialog.confirm('The tx id of the node is: ' + node.id,{
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
          window.open('https://blockstream.info/tx/' + node.id);
        }
      }
    });
  });
}