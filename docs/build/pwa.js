// -----------------------------------------------------------------------------
const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.0/8 are considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

const PUBLIC_URL = '';

// -----------------------------------------------------------------------------
function register(config) {
  // if (isLocalhost) {
  //   console.log('Service worker has been explicitly disabled in localhost environment');
  //   return;
  // }

  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported by this environment');
    return;
  }

  // The URL constructor is available in all browsers that support SW.
  const publicUrl = new URL(PUBLIC_URL, window.location.href);

  if (publicUrl.origin !== window.location.origin) {
    // Our service worker won't work if PUBLIC_URL is on a different origin
    // from what our page is served on. This might happen if a CDN is used to
    // serve assets; see https://github.com/facebook/create-react-app/issues/2374
    return;
  }

  window.addEventListener('load', () => {
    const swUrl = `${PUBLIC_URL}/service-worker.js`;

    if (isLocalhost) {
      // This is running on localhost. Let's check if a service worker still exists or not.
      checkValidServiceWorker(swUrl, config);

      // Add some additional logging to localhost, pointing developers to the
      // service worker/PWA documentation.
      navigator.serviceWorker.ready.then(() => {
        console.log(
          'This web app is being served cache-first by a service ' +
          'worker. To learn more, visit https://bit.ly/CRA-PWA'
        );
      });
    } else {
      // Is not localhost. Just register service worker
      registerValidSW(swUrl, config);
    }
  });
}


// -----------------------------------------------------------------------------
function registerValidSW(swUrl, config) {
  navigator.serviceWorker.register(swUrl)
    .then((registration) => {
      if (config && config.onRegister) {
        config.onRegister(registration);
      }

      if (registration.waiting) {
        if (config && config.onWaiting) {
          config.onWaiting(registration.waiting);
        }
      }

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker === null) {
          return;
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}


// -----------------------------------------------------------------------------
function checkValidServiceWorker(swUrl, config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType !== null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}


// -----------------------------------------------------------------------------
function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error(error.message);
      });
  }
}

// -----------------------------------------------------------------------------
function initialize() {
  let registration = null;
  let waitingServiceWorker = null;

  function updateWaitingServiceWorker(sw) {
    if (waitingServiceWorker) {
      waitingServiceWorker.removeEventListener('statechange');
    }
    if (sw) {
      waitingServiceWorker = sw;

      waitingServiceWorker.addEventListener('statechange', event => {
        if (event.target.state === 'activated') {
          window.location.reload();
        }
      });
    }
  }

  function displayUpdatePrompt() {
    const body = document.querySelector('body');

    const modalContainer = document.createElement('div');
    Object.assign(modalContainer.style, {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      zIndex: 1200,
    });
    body.appendChild(modalContainer);

    const promptContainer = document.createElement('div');
    Object.assign(promptContainer.style, {
      backgroundColor: '#fff',
      borderRadius: '4px',
      width: '90%',
      maxWidth: '400px',
      margin: '50px auto',
      padding: '32px',
      textAlign: 'center',
    });
    modalContainer.appendChild(promptContainer);

    const logo = document.createElement('img');
    logo.src = '/apple-touch-icon.png';
    logo.width = '150';
    logo.height = '150';
    promptContainer.appendChild(logo);

    const heading = document.createElement('h2');
    Object.assign(heading.style, {
      margin: '8px 0 16px 0',
    });
    heading.innerHTML = 'Update Available';
    promptContainer.appendChild(heading);

    const description = document.createElement('p');
    Object.assign(description.style, {
      fontSize: '1rem',
      marginBottom: '24px',
      textAlign: 'left',
    });
    description.innerHTML = 'Press the "Update Now" button, then wait a few moments for the update to be installed. When the installation completes the new version will be automatically loaded.';
    promptContainer.appendChild(description);

    const updateButton = document.createElement('button');
    Object.assign(updateButton.style, {
      backgroundColor: '#3C3B6E',
      borderRadius: '4px',
      borderWidth: 0,
      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
      color: '#fff',
      fontSize: '1.25rem',
      width: '100%',
      padding: '16px',
    });

    updateButton.innerHTML = 'Update Now';
    updateButton.addEventListener('click', () => {
      updateButton.disabled = true;
      updateButton.innerHTML = 'Installing...';
      waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    });

    promptContainer.appendChild(updateButton);
  }

  register({
    onRegister: (reg) => {
      registration = reg;
    },

    onWaiting: (waiting) => {
      updateWaitingServiceWorker(waiting);
      displayUpdatePrompt();
    },

    onUpdate: (reg) => {
      updateWaitingServiceWorker(reg.waiting);
      displayUpdatePrompt();
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (registration) {
        registration.update();
      }
    }
  });
}

// -----------------------------------------------------------------------------
// This catch-all error handler serves as a safety net to ensure
// that we don't wind up installing a build that is so broken that it
// is unable to update itself.
//
// See this article for an in-depth discussion about the topic of
// service workers and effective handling of udpates.
// https://medium.com/@FezVrasta/service-worker-updates-and-error-handling-with-react-1a3730800e6a
window.addEventListener('error', async(err) => {
  // Since we are handling the error here, we must make
  // sure we log it into the console nonetheless, otherwise
  // it will be very difficult to understand why your app
  // is crashing.
  console.error('APOCALYPSE NOW!!!!', err);

  // If no service worker is available, our work ends here
  // because we don't need to unregister the service worker
  // to make sure the user is able to get a newer version of
  // our application.
  if (!navigator.serviceWorker) {
    return;
  }

  // We want to run this code only if we detect a new service worker
  // is getting installed or is installed but waiting to be activated.
  // This will make sure we don't run this code on a sane environment
  // that is crashing for an error not related to stale app cache.
  const registration = await navigator.serviceWorker.ready;
  if (registration.installing || registration.waiting) {
    navigator.serviceWorker.ready.then(async registration => {
      console.error('Unregistering serviceworker', err);
      await registration.unregister();
      // Once the service worker is unregistered, we can reload
      // the page to let the browser download a fresh copy of our app
      window.location.reload();
    });
  }
});

initialize();
