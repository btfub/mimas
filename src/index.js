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
    interactions: pinchzoom,
    layers: [
      tileWorldImagery,
      stamen
    ],
    view: new View({
      center: olProj.fromLonLat([134.364805, -26.710497]),
      zoom: 4,
      minZoom: 2,
    }),
  });
  
  const ol3d = new OLCesium({map: map}); // map is the ol.Map instance
  ol3d.setEnabled(true);
window.ol3d = ol3d; // temporary hack for easy console debugging