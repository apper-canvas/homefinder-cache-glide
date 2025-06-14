import Browse from '@/components/pages/Browse';
import PropertyDetail from '@/components/pages/PropertyDetail';
import MapView from '@/components/pages/MapView';
import Favorites from '@/components/pages/Favorites';
import Compare from '@/components/pages/Compare';

export const routes = {
  browse: {
    id: 'browse',
    label: 'Browse',
    path: '/browse',
    icon: 'Home',
    component: Browse
  },
  mapView: {
    id: 'mapView',
    label: 'Map View',
    path: '/map',
    icon: 'MapPin',
    component: MapView
  },
  favorites: {
    id: 'favorites',
    label: 'Favorites',
    path: '/favorites',
    icon: 'Heart',
    component: Favorites
  },
  compare: {
    id: 'compare',
    label: 'Compare',
    path: '/compare',
    icon: 'GitCompare',
    component: Compare
  },
  propertyDetail: {
    id: 'propertyDetail',
    label: 'Property Detail',
    path: '/property/:id',
    icon: 'Building',
    component: PropertyDetail,
    hidden: true
  }
};

export const routeArray = Object.values(routes);
export default routes;