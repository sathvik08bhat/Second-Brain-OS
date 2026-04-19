import { allStores } from './store/syncStore.js';

export function test() {
  const dataToSync = {};
  Object.keys(allStores).forEach(key => {
    dataToSync[key] = allStores[key].getState();
  });

  try {
    const str = JSON.stringify(dataToSync);
    console.log("Success! Length:", str.length);
  } catch(e) {
    console.error("Stringify failed: ", e.message);
  }
}
test();
