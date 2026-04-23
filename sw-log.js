const DB_NAME = 'thungplus-log-db';
const STORE_NAME = 'logs';

// ===== เปิด IndexedDB =====
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = function (e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { autoIncrement: true });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ===== เพิ่ม log =====
async function addLog(log) {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).add(log);
}

// ===== ดึง log =====
async function getLogs() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);

    return new Promise((resolve) => {
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result.reverse());
    });
}

// ===== ล้าง log =====
async function clearLogs() {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    tx.objectStore(STORE_NAME).clear();
}

// ===== รับ message จากหน้าเว็บ =====
self.addEventListener('message', async (event) => {
    const { type, payload } = event.data;

    if (type === 'ADD_LOG') {
        await addLog(payload);
    }

    if (type === 'GET_LOGS') {
        const logs = await getLogs();
        event.source.postMessage({ type: 'LOGS_RESULT', payload: logs });
    }

    if (type === 'CLEAR_LOGS') {
        await clearLogs();
        event.source.postMessage({ type: 'CLEARED' });
    }
});