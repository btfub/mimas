import Cesium from 'cesium/Cesium';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as olProj from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';

import {ImageCanvas as ImageCanvasSource, Stamen} from 'ol/source.js';//my
import TileWMS from 'ol/source/Tile.js'; //my
import ImageLayer from 'ol/layer/Image.js'; //my
import ImageWMS from 'ol/source/Image.js'; //my
import VectorSource from 'ol/source/Vector.js'; //my
import GeoJSON from 'ol/format/GeoJSON.js'; //my
import VectorLayer from 'ol/layer/Vector.js'; //my
import Style from 'ol/style/Style.js'; //my
import Stroke from 'ol/style/Stroke.js'; //my
//import LayerSwitcher from 'ol/control/LayerSwitcher.js'; //my //? working ?
//import DimensionSwitcher from 'ol/control/DimensionSwitcher.js'; //my //? working ?
import LayerGroup from 'ol/layer/Group.js'; //my 

// START DIMENSION SWITCHER
//export function ol.control.DimensionSwitcher(opt_options){ // IDEA 1
var DimensionSwitcher ={function(Control){
  function DimensionSwitcher(opt_options) {
//ol.control.DimensionSwitcher = function(opt_options) {

  var options = opt_options ? opt_options : {};

  var className = options.className !== undefined ? options.className : 'ol-rotate';

  var label = options.label !== undefined ? options.label : '2D';
  this.labelNode_ = typeof label === 'string' ? document.createTextNode(label) : label;
      
  var label3D = options.label3D !== undefined ? options.label3D : '3D';
  this.label3DNode_ = typeof label3D === 'string' ? document.createTextNode(label3D) : label3D;

  /**
   * @type {Element}
   * @private
   */
  /*this.label_ = null;
  this.label_ = document.createElement('span');
  this.label_.className = 'ol-dimension';
  this.label_.textContent = label;*/

  var tipLabel = options.tipLabel ? options.tipLabel : 'Toggle Dimension';
    
  var button = document.createElement('button');
  button.className = className + '-reset';
  //assign the title 'Toggle Dimension' to the button
  button.title = tipLabel;
  button.setAttribute('type', 'button');
  //button.title = tipLabel;
  button.appendChild(this.labelNode_);

  ol.events.listen(button, ol.events.EventType.CLICK,
      ol.control.DimensionSwitcher.prototype.handleClick_, this);

  var cssClasses = className + ' ' + ol.css.CLASS_UNSELECTABLE + ' ' +
      ol.css.CLASS_CONTROL;
  var element = document.createElement('div');
  element.className = cssClasses;
  element.appendChild(button);

  ol.control.Control.call(this, {
    element: element,
    target: options.target
  });


};
//} // IDEA 2
ol.inherits(ol.control.DimensionSwitcher, ol.control.Control);

/**
 * @param {Event} event The event to handle
 * @private
 */
ol.control.DimensionSwitcher.prototype.handleClick_ = function(event) {
  event.preventDefault();
  this.toggle3D();
  this.changeLabel_();
};

/**
 * @private
 */
//definition of the handleDimensionChange_ function
ol.control.DimensionSwitcher.prototype.changeLabel_ = function() {     //change "handleFullScreenChange_" to "handleDimensionChange_"
  var map = this.getMap();
  var button = this.element.firstElementChild;
  if (!app.is3D) {
    ol.dom.replaceNode(this.label3DNode_, this.labelNode_);
    } else {
    ol.dom.replaceNode(this.labelNode_, this.label3DNode_);
  }
  if (map) {
    map.updateSize();
  }
};

/**
 * @private
 */
ol.control.DimensionSwitcher.prototype.toggle3D = function() {
  var map = this.getMap();
  var view = map.getView();
  if (app.is3D==true) {
  //console.dir("switch to 2D");
  app.ol3d.setEnabled(false);
  app.is3D=false;
  } else {
    //console.dir("switch to 3D");
    app.ol3d.setEnabled(true);
    app.is3D=true;
  }
};

// END DIMENSION SWITCHER
//ORIGINAL
let tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });

/* // STAMEN EXAMPLE
let stamen = new TileLayer({
    source: new Stamen({
      layer: 'watercolor'
    })
  });
*/

/* 
// MY
let base = new TileLayer({
      preload: 5,
      title: "Mimas Basemap (DLR)",
      //type: "base",
      visible: true,
      source: new TileWMS({
              url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
              params: {
                      LAYERS: 'BASE',
                      VERSION: '1.3.0',
                      TILED: true
              },
              wrapX: false
      })
});
let geo1001 = new TileLayer({
	preload: 5,
	title: "GEOL001",
	visible: true,
	source: new TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'GEOLOG001',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
let ISS_126MI_FP3DAYMAP001 = new TileLayer({
	preload: 5,
	title: "126MI_FP3DAYMAP001 Mosaic",
	visible: true,
	source: new TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'ISS_126MI_FP3DAYMAP001',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
let N1644785949_foot = new TileLayer({
	preload: 5,
	title: "Footprints",
	visible: true,
	source: new TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'N1644785949_foot',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
 // HAS TROUBLE WITH "image"

var cassImages=['N1644784329', 'N1644784749', 'N1644785949', 'N1644786249','N1644782658', 'N1644783429'];
let cassImageLayers = [];
var tmpSource, tmpTile;
for (image of cassImages) { // issue here
	tmpSource = new TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: image,
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	});
	tmpTile = new TileLayer({
		title: image,
		visible: true,
		source: tmpSource,
    });
    cassImageLayers.push(tmpTile);
}

let gridTileWms = new TileLayer({
	preload: 5,
	title: "Graticule",
	visible: true,
	source: new TileWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		params: {
			LAYERS: 'grid',
			VERSION: '1.3.0',
			TILED: true
		},
		wrapX: false
	})
});
let gridsource = new ImageWMS({
		url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
		serverType: 'mapserver',
		crossOrigin: 'anonymous',
		params: {
			LAYERS: 'grid',
			VERSION: '1.3.0',
			TILED: false
		},
		wrapX: false
});
let grid = new ImageLayer({
	title: "Graticule",
	visible: true,
	source: gridsource
});
console.dir(gridsource);
var url = 'http://maps.planet.fu-berlin.de/mimas-bin/wms?' +
        'service=WFS&version=1.1.0&request=GetFeature&typename=grid&' +
        'outputFormat=geojson&srsname=EPSG:4326&' +
        'bbox=-180,-90,180,90,EPSG:4326';
var vectorSource = new VectorSource({
	format: new GeoJSON(),
	url: url,
	//strategy: loadingstrategy.bbox, // issue here
	wrapX: false
  });
  console.dir(vectorSource);
let gridwfs = new VectorLayer({
	title: 'Graticule',
	visible: true,
	source: vectorSource,
	style: new Style({
	  stroke: new Stroke({
		color: 'rgba(255, 255, 255, .4)',
		width: 1
	  })
	})
});
*/

let view = new View({
  projection: 'EPSG:4326',
  center:[0,0],
  zoom: 1,
  maxZoom: 16,
  minZoom: 0
});

//let LayerSwitcher = new LayerSwitcher(); //my

/*let controls = new defaults({//my //issues here
    attribution: false
}).extend([     //my //issues here
   new DimensionSwitcher(), //added by me
   LayerSwitcher
   //app.DimensionSwitcher
]);
*/

let map = new Map({
  target: "map",
  projection: 'EPSG:3857',
  layers: [
    tileWorldImagery,
    //stamen//, //my
    //base, //my
    //ISS_126MI_FP3DAYMAP001,//my
    //N1644785949_foot,//my
    /*new LayerGroup({ //my
      'title': 'Individual images',
      visible': true,
      layers: cassImageLayers
      }),*/
    //gridTileWms,//my
    //grid,//my
    //gridwfs//my

  ],
  /*view: new View({
    center: olProj.fromLonLat([134.364805, -26.710497]),
    zoom: 1,
    minZoom: 2,
  }),
  */
  view: view, //my
  //controls: controls //my
});

const ol3d = new OLCesium({
  map: map,
  sceneOptions: { show: true }
  }); // map is the ol.Map instance

//let ol3d.scene_.skyAtmosphere.show=false; //my //issue here

//is3D = true; //my
ol3d.setEnabled(true);
window.ol3d = ol3d; // temporary hack for easy console debugging

