import Cesium from 'cesium/Cesium';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as olProj from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';

// IMPORT pinch zoom controle
import {defaults as defaultInteractions, PinchZoom} from 'ol/interaction.js';
//import 'css/main.css'; //error
//import '/css/main.css'; //error
//import 'src/css/main.css'; //error

// IMPORT layerswitcher testlayers
import Stamen from 'ol/source/Stamen.js';


// START moonswitcher definition in index.js attempt
import Collection from 'ol/Collection';
import {defaults as defaultControls, Control} from 'ol/control.js';

var MoonSwitcher = (function (Control){
  function MoonSwitcher(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-moonswitcher';

  var label = options.label !== undefined ? options.label : 'M';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label2 = options.label2 !== undefined ? options.label2 : 'M2';
  this.label2Node_ = typeof label2 === 'string' ? document.createTextNode(label2) : label2;

  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Moon';
  

  //what happens when clicking on dropdown element
  var selectList = document.createElement("select");
  selectList.id = "mySelect";
  selectList.title = tipLabel; //see next commented paragraph
  selectList.appendChild(this.label2Node_);//see next commented paragraph
  selectList.setAttribute('type', 'select');//see next commented paragraph

  selectList.addEventListener('click',MoonSwitcher.prototype.handleSelection_, this); //OL5 of ol.events.listen = ListenerFunction?
  

  //what appears on drop down menu
  var array = ["Mimas","Enceladus"];
  for (var i = 0; i < array.length; i++) {
    var option = document.createElement("option");
    option.value = array[i];
    option.text = array[i];
    //option.setAttribute("class", "hover-on-item"); //doesn't work yet, trying to avoid organge background
    selectList.appendChild(option);
	};

  //classes
  var cssClasses = className + ' ' + css.CLASS_UNSELECTABLE + ' ' + css.CLASS_CONTROL; // ol. removed
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(selectList);//drop down menu becomes part of the element div

  Control.call(this, {
    element: element,
    target: options.target
  });
  };

inherits(MoonSwitcher, Control); // PROBLEM HERE

//what should happend when drop drop down menu is clicked
  MoonSwitcher.prototype.handleSelection_ = function handleSelection_ (event) {
    event.preventDefault();
    this.toggleMoon();
  };

  MoonSwitcher.prototype.toggleMoon = function toggleMoon () {

    var map = this.getMap();
    var view = map.getView();

    console.dir(map.getLayers());
    if (isMimas==true) {
      console.dir("switch to M2");
      isMimas=false;
    } else {
      console.dir("switch to M");
      isMimas=true;
    }
    moonlayers = isMimas == true ?  m: m2;
    map.getLayerGroup().setLayers(new Collection(moonlayers));
    LayerSwitcher.renderPanel();
  };

  return MoonSwitcher
}(Control));
// END moonswitcher definition in index.js attempt



let tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });

// START layerwitcher testlayers
let stamen = new TileLayer({
    source: new Stamen({
      layer: 'watercolor'
    })
  });
// END layerswitcher testlayers

//START moonswitcher attempts
var m = [stamen, tileWorldImagery];
var m2 = [tileWorldImagery,stamen];

var isMimas = false;
var moonlayers = isMimas == true ? m: m2;
//END moonswitcher attempts


// START pinch zoom controle
let pinchzoom = defaultInteractions({pinchZoom: false}).extend([
          new PinchZoom({
            constrainResolution: true // force zooming to a integer zoom
          })
        ])
// END pinch zoom controle

  let map = new Map({
    target: "map",
    projection: 'EPSG:3857',
    interactions: [pinchzoom,moonswitcher],
    layers: moonlayers,
    view: new View({
      center: olProj.fromLonLat([134.364805, -26.710497]),
      zoom: 4,
      minZoom: 2,
    }),
  });
  
  const ol3d = new OLCesium({map: map}); // map is the ol.Map instance
  ol3d.setEnabled(true);
window.ol3d = ol3d; // temporary hack for easy console debugging