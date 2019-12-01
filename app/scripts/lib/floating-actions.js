//SpyJSBlock-Ngraph (c) by Vincenzo Palazzo vincenzopalazzodev@gmail.com
//
//SpyJSBlock-Ngraph is licensed under a
//Creative Commons Attribution 4.0 International License.
//
//You should have received a copy of the license along with this
//work. If not, see <http://creativecommons.org/licenses/by/4.0/>

//configuration
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
                resumeRenderd();
            }
        },{
            'bgcolor':'#212121',
            'color':'#ffbd39',
            'icon':'<i class=\'material-icons\'>stop</i>',
            'target':'_blank',
            'title' : 'Stop',
            onClick: function(){
                stopRenderd();
            }
        }
    ]
}

$(document).ready(function(){
    rbt_display($('.rbt_wrapper'),config,(menu) => {
        menu.slideDown( 'slow' );
    });
});