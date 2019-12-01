//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

const ManagerUtils = require('../../utils/ManagerUtils')
let detectClusters = require('ngraph.louvain');

let mapClusterForColor = new Map();

module.exports = (function () {
    let instance;
 
    function createInstance() {
       console.log('Instance singleton');
        return {
            calculateCluster: function(graph){
                if(!graph){
                    throw Error('graph null');
                }
                instance.claster = detectClusters(graph);
                console.debug('***** CALCULATED CLUSTER ***********');
            },
            getColorForClass: function(node){
                if(!instance.claster){
                    //console.debug('****** no color ******');
                    return null;
                }
                //console.debug('****** color ******');
                let classNode = instance.claster.getClass(node.id);
                if(mapClusterForColor.has(classNode)){
                    return mapClusterForColor.get(classNode);
                }else{
                    let color = ManagerUtils.getInstance().getRandomColor();
                    mapClusterForColor.set(classNode, color);
                    return color;
                }
            }
        };
    }
 
    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();