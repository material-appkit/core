// -----------------------------------------------------------------------------
function observeSWRegstration(registration, config) {
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

  if (config && config.onRegister) {
    config.onRegister(registration);
  }

  if (registration.waiting) {
    if (config && config.onWaiting) {
      config.onWaiting(registration.waiting);
    }
  }
}

// -----------------------------------------------------------------------------
function initialize() {
  if (!('serviceWorker' in navigator)) {
    console.log('Service workers are not supported by this environment');
    return;
  }

  let registration = null;
  let waitingServiceWorker = null;

  // ---------------------------------------------------------------------------
  const renderUpdatePrompt = () => {
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
    logo.src = '/icons/icon-144x144.png';
    logo.width = '144';
    logo.height = '144';
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
  };

  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  navigator.serviceWorker.getRegistration().then(function(reg) {
    if (!reg) {
      return;
    }

    registration = reg;

    observeSWRegstration(registration, {
      onWaiting: (waiting) => {
        updateWaitingServiceWorker(waiting);
        renderUpdatePrompt();
      },

      onUpdate: (reg) => {
        updateWaitingServiceWorker(reg.waiting);
        renderUpdatePrompt();
      }
    });
  });

  // ---------------------------------------------------------------------------
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      if (registration) {
        registration.update();
      }
    }
  });
}

initialize();
