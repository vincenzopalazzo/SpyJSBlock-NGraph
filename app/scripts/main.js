//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

import 'regenerator-runtime/runtime';
import BuildGraph from './graph/BuildGraph'
import RendererGraph from './graph/RendererGraph'
import FromPrecomputeGraph from './graph/FromPrecomputeGraph'
import ChartBuilder from './ChartBuilder'

let LouvianAlgo = require('./graph/algorithms/Louvian');
let renderer = undefined;

const commands = new Map([
    ['benckmark-graphtx-json', 'benckmark-graphtx-json'],
    ['graph-transaction', 'graph-transaction'],
    ['id-wallet', 'id-wallet'],
    ['stop-renderer', 'stop-renderer'],
    ['resume-renderer', 'resume-renderer'],
    ['cluster', 'cluster']
]);

let graph = undefined;


window.mainApp = async function(operation) {
    console.debug('Main with operation is: '  + operation);
    let commandsChoise = commands.get(operation);
    if(commandsChoise == undefined){
        throw Error('The command ' + operation + ' not supported');
    }
    if(commandsChoise === 'benckmark-graphtx-json'){
        let builderChar = new ChartBuilder('benchmark-chart', 'benchmark-conf.json', 'benckmark-graphtx-json', 'bar', ['GraphTX', 'JSON']);
        builderChar.intChart();
    }else if(commandsChoise === 'graph-transaction'){
        mmdShowToast('Take a Coffe ☕');
        let graphBuilder = new BuildGraph('tx', 0);
        graph = graphBuilder.getGraph();
        graph = await graphBuilder.buildGraph();
        renderer = new RendererGraph('graph-container', graph, 'pixel');
        
        //graph = graphBuilder.buildGraph(); //from file no await

        //let precompute = await FromPrecomputeGraph(graph, renderer.getLayout()); //from precompute

        renderer.rendererGraph();
        renderer.runRenderer();
        renderer.computeLayout(9000);
    }else if(commandsChoise === 'id-wallet'){
        mmdShowToast('Take a Coffe ☕');
        let graphBuilder = new BuildGraph('id-wallet', 0);
        graph = graphBuilder.getGraph();
        graph = await graphBuilder.buildGraph();
        renderer = new RendererGraph('graph-container', graph, 'pixi');
        //graph = graphBuilder.buildGraph();
        renderer.rendererGraph();
        renderer.runRenderer();
    }else if(commandsChoise === 'stop-renderer'){
        graphBuilder.renderStop();
    }else if(commandsChoise === 'cluster'){
        if(graph){
           console.log('****** ALGO *****')
            LouvianAlgo.getInstance().calculateCluster(graph);
        }
    }
}

//floating button configuration
let config = {
    main: {
        'bgcolor':'#ffbd39',
        'color':'#212121',
        'icon':'<i class=\'material-icons\'>add</i>',
        onClick: function(){
            
        }
    },
    links:[
       {
            'bgcolor':'#212121',
            'color':'#ffbd39',
            'icon':'<i class=\'material-icons\'>restore</i>',
            'title' : 'Resume',
            onClick: function(){
                if(renderer === undefined){
                    mmdShowToast('You must have created the Graph....');
                    throw Error('Graph builder undefined');
                }
                renderer.resumeRenderer();
            }
        },
        {
            'bgcolor':'#212121',
            'color':'#ffbd39',
            'icon':'<i class=\'material-icons\'>stop</i>',
            'target':'_blank',
            'title' : 'Stop',
            onClick: function(){
                if(renderer === undefined){
                    mmdShowToast('You must have created the Graph....');
                    throw Error('Graph builder undefined');
                }
                renderer.stopRenderer();
            }
        },
        {
            'bgcolor':'#212121',
            'color':'#ffbd39',
            'icon':'<i class=\'material-icons\'>group</i>',
            'target':'_blank',
            'title' : 'Cluster with louvian alg.',
            onClick: function(){
                if(!graph){
                    mmdShowToast('You must have created the Graph....');
                    throw Error('Graph builder undefined');
                }
                mainApp('cluster');
            }
        }
    ]
}

$(document).ready(function(){
    rbt_display($('.rbt_wrapper'),config,(menu) => {
        menu.slideDown( 'slow' );
    });
});
