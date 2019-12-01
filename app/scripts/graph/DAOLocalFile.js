//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

'use strict';

class DAOLocalFile{

    constructor(path){}

    async loadFile(path){
        try {
            const response = await fetch(path);
            const data = await response.json();
            return data;
        }
        catch (ex) {
            return console.error(ex);
        }
    }

    async loadFileText(path){
        try {
            const response = await fetch(path);
            const data = await response.text();
            return data;
        }
        catch (ex) {
            return console.error(ex);
        }
    }
}

export default DAOLocalFile