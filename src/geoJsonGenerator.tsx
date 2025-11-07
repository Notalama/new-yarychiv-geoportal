import { Feature, FeatureCollection, Polygon } from 'geojson';

// Приблизний центр Нового Яричева
const CENTER_LAT = 49.95;
const CENTER_LNG = 24.30;
// Радіус зони генерації (у градусах)
const RADIUS = 0.02; 
// Кількість зон для генерації
const NUM_ZONES = 250; 

/**
 * Генерує випадковий номер ділянки.
 */
const generateCadastralNumber = (index: number): string => {
  const zone = Math.floor(index / 100) + 1;
  const plot = (index % 100) + 1;
  // Формат: 4621355200:ZZ:PPP (де ZZ - зона, PPP - ділянка)
  return `4621355200:${String(zone).padStart(2, '0')}:${String(plot).padStart(3, '0')}`;
};

/**
 * Генерує випадковий тип використання землі.
 */
const getRandomLandUse = (): string => {
  const types = ["Agricultural", "Residential", "Commercial", "Public", "Forest"];
  return types[Math.floor(Math.random() * types.length)];
};

/**
 * Генерує випадкову полігональну ділянку поблизу центру.
 * Використовує прості прямокутні форми для імітації сітки.
 */
const generateRandomPolygon = (latOffset: number, lngOffset: number): number[][][] => {
  // Розміри ділянки (від 0.0005 до 0.002 градуса)
  const sizeLat = 0.0005 + Math.random() * 0.0015;
  const sizeLng = 0.0005 + Math.random() * 0.0015;

  const lat1 = CENTER_LAT + latOffset;
  const lng1 = CENTER_LNG + lngOffset;
  const lat2 = lat1 + sizeLat;
  const lng2 = lng1 + sizeLng;

  // Випадковий зсув вершин для створення "трапеції"
  const offset = 0.0001 * (Math.random() - 0.5);

  return [
    [
      [lng1, lat1],               // Нижній лівий
      [lng2, lat1 + offset],      // Нижній правий (зсув)
      [lng2 + offset, lat2],      // Верхній правий (зсув)
      [lng1, lat2],               // Верхній лівий
      [lng1, lat1]                // Повернення до початку
    ]
  ];
};


/**
 * Основна функція для генерації GeoJSON FeatureCollection.
 */
export const generateCadastralZones = (): FeatureCollection<Polygon> => {
  const features: Feature<Polygon>[] = [];
  
  // Використовуємо сітку з випадковим зміщенням для створення щільного кластера
  const gridDensity = Math.sqrt(NUM_ZONES);
  
  for (let i = 0; i < gridDensity; i++) {
    for (let j = 0; j < gridDensity; j++) {
        const index = i * gridDensity + j;
        if (index >= NUM_ZONES) break;

        // Зміщення від центру для цієї ділянки
        const latOffset = (i / gridDensity - 0.5) * RADIUS * 2 + (Math.random() - 0.5) * 0.001;
        const lngOffset = (j / gridDensity - 0.5) * RADIUS * 2 + (Math.random() - 0.5) * 0.001;

        const polygonCoordinates = generateRandomPolygon(latOffset, lngOffset);
        
        features.push({
            type: "Feature",
            properties: {
                name: `Plot ${index + 1}`,
                cadastral_number: generateCadastralNumber(index),
                area_hectares: Math.round((Math.random() * 5 + 0.5) * 10) / 10, // 0.5 - 5.5 га
                land_use: getRandomLandUse()
            },
            geometry: {
                type: "Polygon",
                coordinates: polygonCoordinates
            }
        });
    }
  }

  return {
    type: "FeatureCollection",
    features: features
  };
};
