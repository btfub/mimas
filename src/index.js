import Cesium from 'cesium/Cesium';
window.Cesium = Cesium; // expose Cesium to the OL-Cesium library
require('cesium/Widgets/widgets.css');
import OLCesium from 'ol-cesium';

import Map from 'ol/Map.js';
import View from 'ol/View.js';
import * as olProj from 'ol/proj.js';
import TileLayer from 'ol/layer/Tile.js';
import XYZ from 'ol/source/XYZ.js';

// import TileWMS from 'ol/source/TileWMS.js'; //mine
import {ImageCanvas as ImageCanvasSource, Stamen} from 'ol/source.js';//mine

/* //ORIGINAL
let tileWorldImagery = new TileLayer({
    source: new XYZ({
      url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      crossOrigin: 'Anonymous',
    })
  });
*/

/* // ONLY GREY --> CANNOT LOAD URL PROPERLY
let tileWorldImagery = new TileLayer({
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
*/

let tileWorldImagery = new TileLayer({
    source: new Stamen({
      layer: 'watercolor'
    })
  });

let map = new Map({
  target: "map",
  projection: 'EPSG:3857',
  layers: [
    tileWorldImagery
  ],
  view: new View({
    center: olProj.fromLonLat([134.364805, -26.710497]),
    zoom: 1,
    minZoom: 2,
  }),
});

const ol3d = new OLCesium({map: map}); // map is the ol.Map instance
ol3d.setEnabled(true);
window.ol3d = ol3d; // temporary hack for easy console debugging

