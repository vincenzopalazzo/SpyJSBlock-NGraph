//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

import BuildNGraph from 'ngraph.graph'
import DAOLocalFile from './DAOLocalFile'

const PATH_RES = "resources/";

const TYPE_OF_GRAPH = [
    "tx",
    "id-wallet"
];

class BuildGraph{

    constructor(typeOfGraph, indexBlk){
        this.typeOfGraph = typeOfGraph;
        this.indexBlk = indexBlk;
        this.graph = BuildNGraph();
    }

    getGraph(){
        return this.graph;
    }

    //The console.log build a graph lower
    async buildGraph(){
        let dao = new DAOLocalFile();
        if(this.typeOfGraph === TYPE_OF_GRAPH[0]){
            console.debug('************* GRAPH of Transactions *************');
            let actualIndex = this.indexBlk;
            let pathInput = _getNameFile(PATH_RES + 'tx/', '_tx.txt', actualIndex);
            console.debug('Name file: ', pathInput);
            while(pathInput != null){
                await _parseringTheFile(this.graph, dao, pathInput, '|-|')
                actualIndex++;
                pathInput = _getNameFile(PATH_RES + 'tx/', '_tx.txt', actualIndex);
                if(actualIndex == 2){break;} //TODO this must be removed because it limit the number file
                console.debug('Name file: ', pathInput);
            }
        }else if(this.typeOfGraph === TYPE_OF_GRAPH[1]){
            console.debug('************* GRAPH of ID Wallet *************');
            let actualIndex = this.indexBlk;
            let pathInput = _getNameFile(PATH_RES + 'pubKey/', '_idw.txt', actualIndex);
            console.debug('Name file: ', pathInput);
            while(pathInput != null){
                await _parseringTheFile(this.graph, dao, pathInput, '|-|')
                actualIndex++;
                pathInput =  _getNameFile(PATH_RES + 'pubkey/', '_idw.txt', actualIndex);
                if(actualIndex == 2){break;} //TODO TMP
                console.debug('Name file: ', pathInput);
            }
        }
        mmdShowToast('Graph Builded');
        return this.graph;
    }
}

//This method get the information for parsing file not compressed
async function _parseringTheFile(graph, dao, pathInput, stringToken){
    let fileBlkPromisse = dao.loadFileText(pathInput);
    await fileBlkPromisse.then(function(fileBlkData) {
               // console.debug('File content: ', fileBlkData);
                let lines = fileBlkData.split('\n');
                let simpleRenderer = 0;
                lines.forEach(line => {
                   if(simpleRenderer === 10000){ return; }
                    simpleRenderer++;
                    let token = line.split(stringToken);
                    let toNode = token[0];
                    //console.debug('To node with id: ', toNode);
                    let fromNode = token[token.length - 1];
                    //console.debug('From node with id: ', fromNode);
                    graph.beginUpdate();

                    graph.addNode(toNode);
                    graph.addNode(fromNode);
                    //console.debug('Information node is: ', token.slice(1, token.length - 1));
                    graph.addLink(toNode, fromNode, token.slice(1, token.length - 1));
                    
                    graph.endUpdate();
                });
               // actualIndex++;
                //pathInput = self.getNameFile(PATH_RES + 'tx/', '_tx.txt', actualIndex);
            }).catch(ex => console.error(ex));
}

function _getNameFile(pathInput, exstension, numberBlock) {
    if(numberBlock < 10){
      return pathInput + 'blk0000' + String(numberBlock) + exstension;
    }else if(numberBlock < 100){
      return pathInput + 'blk000' + String(numberBlock) + exstension;
    }else if (numberBlock < 1000){
      return pathInput + 'blk00' + String(numberBlock) + exstension;
    }else if (numberBlock < 10000){
      return pathInput + 'blk0' + String(numberBlock) + exstension;
    }else if (numberBlock < 100000) {
      return pathInput + 'blk0' + String(numberBlock) + exstension;
    }
    return null;
}

export default BuildGraph;