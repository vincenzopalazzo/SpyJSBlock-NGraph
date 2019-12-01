//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

import NGraphFromComputation from 'ngraph.fromprecompute'


export default async function(graph, layout){
    await NGraphFromComputation(graph, layout, {/* TODO SETTING*/});
}