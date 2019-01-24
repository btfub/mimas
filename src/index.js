import Cesium from 'cesium/Cesium';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as olProj from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';
// START- MODULES ADDED BY ME
import {ImageCanvas as ImageCanvasSource, Stamen} from 'ol/source.js';
import TileWMS from 'ol/source/TileWMS.js';
import {Image as ImageLayer, Tile as TileLayer} from 'ol/layer.js';
import ImageWMS from 'ol/source/ImageWMS.js';
import VectorSource from 'ol/source/Vector.js'; 
import GeoJSON from 'ol/format/GeoJSON.js'; 
import VectorLayer from 'ol/layer/Vector.js'; 
import Style from 'ol/style/Style.js'; 
import Stroke from 'ol/style/Stroke.js'; 
import LayerSwitcher from 'ol-layerswitcher/dist/ol-layerswitcher.js';
import 'ol-layerswitcher/src/ol-layerswitcher.css'; //when commente out, button disappears although
//import 'src/css/main.css'; //attempt to overwrite default layerswitcher design --> doesn't work
import LayerGroup from 'ol/layer/Group.js'; 
// END - MODULES ADDED BY ME

//ORIGINAL
/*
let tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });
// STAMEN EXAMPLE
let stamen = new TileLayer({
    source: new Stamen({
      layer: 'watercolor'
    })
  });
*/


// MY
let base = new TileLayer({
      //preload: 5,
      //title: "Mimas Basemap (DLR)",
      //type: "base",
      //visible: true,
      source: new TileWMS({
              url: 'http://maps.planet.fu-berlin.de/mimas-bin/wms',
              params: { 'LAYERS': 'BASE', 'VERSION': '1.3.0', 'TILED': true },
              serverType: 'mapserver'//,
              //wrapX: false
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

var cassImages=['N1644784329', 'N1644784749', 'N1644785949', 'N1644786249','N1644782658', 'N1644783429'];
var image;
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

///*
let view = new View({
  projection: 'EPSG:4326',
  center:[0,0],
  zoom: 1,
  maxZoom: 16,
  minZoom: 0
});
//*/
/*
let LayerSwitcher = new ol.control.LayerSwitcher();
let controls = new ol.control.defaults({
    attribution: false
}).extend([
   app.LayerSwitcher
]);
*/
let singlegroup = new LayerGroup({ //my
      'title': 'Individual images',
      //visible': true,
      layers: cassImageLayers
	});
let map = new Map({
  target: "map",
  projection: 'EPSG:3857',
  layers: [
    //tileWorldImagery,
    //stamen//, //my
    base, //my
    ISS_126MI_FP3DAYMAP001,//my
    N1644785949_foot,//my
    singlegroup,
    gridTileWms,//my
    grid,//my
    gridwfs//my

  ],
  /*
  view: new View({
    center: olProj.fromLonLat([134.364805, -26.710497]),
    zoom: 1,
    minZoom: 2,
  }),
  */
  view: view//, //my
  //controls: controls //my
});

var layerSwitcher = new LayerSwitcher({
        tipLabel: 'Légende' // Optional label for button
    });

map.addControl(layerSwitcher);

const ol3d = new OLCesium({
  map: map,
  sceneOptions: { show: true }
  }); // map is the ol.Map instance

//let ol3d.scene_.skyAtmosphere.show=false; //my //issue here


//is3D = true; //my
ol3d.setEnabled(true);
window.ol3d = ol3d; // temporary hack for easy console debugging

