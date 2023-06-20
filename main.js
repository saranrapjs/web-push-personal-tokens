navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
        console.log(`ServiceWorker registration successful with scope: ${registration.scope}`);
        return registration.update();
    })
    .then((registration) => console.log(`ServiceWorker updated`))
    .catch((err) => console.log('ServiceWorker registration failed: ', err));
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
}

/**
 * @param {ServiceWorkerRegistration} registration
 **/
async function subscribe(registration) {
    try {
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(window.VAPID_PUBLIC_KEY)
        });
        const response = await fetch('/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(subscription)
        });
    } catch (error) {
        console.error('Error subscribing:', error);
    }
    window.close();
}

function createButton(txt, action) {
    const btn = document.createElement('button');
    btn.textContent = txt;
    btn.onclick = () => {
        btn.disabled = true;
        const txt = action();
        if (txt) {
            btn.textContent = txt;
        }
    };
    document.body.appendChild(btn);
}

(async function main() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
        createButton("You already have a Web Push subscription at this URL. Click me to unsubscribe and refresh.", () => {
            subscription.unsubscribe();
            window.location.reload();
            return "Reloading..."
        });
    } else {
        createButton("Click me to generate Web Push subscription tokens", () => {
            subscribe(registration);
            return "Subscribing..."
        });        
    }
})();
