import { allStores } from './src/store/syncStore.js';

try {
  const dataToSync = {};
  Object.keys(allStores).forEach(key => {
    dataToSync[key] = allStores[key].getState();
  });
  const cleanedData = JSON.parse(JSON.stringify(dataToSync));
  console.log("Stringification successful!");
} catch (e) {
  console.error("Stringification failed", e.message);
}
