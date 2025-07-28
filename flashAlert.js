export const flashAlert = (() => {
  const styles = {};

  const createAlertBox = (message, styleClass, callback, icon, noButton = false) => {
    const backdrop = document.createElement('div');
    backdrop.className = 'flash-backdrop';

    const alert = document.createElement('div');
    alert.className = `flash-alert ${styleClass}`;

    const msgBox = document.createElement('div');
    msgBox.className = 'flash-message';

    if (icon) {
      msgBox.innerHTML = `<span class="flash-icon">${icon}</span> ${message}`;
    } else {
      msgBox.innerHTML = message;
    }

    alert.appendChild(msgBox);

    if (!noButton) {
      const buttonRow = document.createElement('div');
      buttonRow.className = 'flash-buttons';

      const button = document.createElement('button');
      button.className = 'flash-ok-button';
      button.innerText = 'OK';
      button.onclick = () => {
        alert.classList.remove('show');
        backdrop.classList.remove('show');
        setTimeout(() => {
          document.body.removeChild(alert);
          document.body.removeChild(backdrop);
          if (typeof callback === 'function') callback();
        }, 300);
      };

      buttonRow.appendChild(button);
      alert.appendChild(buttonRow);
    }

    document.body.appendChild(backdrop);
    document.body.appendChild(alert);

    setTimeout(() => {
      alert.classList.add('show');
      backdrop.classList.add('show');
    }, 10);

    if (noButton) {
  setTimeout(() => {
    alert.classList.remove('show');
    backdrop.classList.remove('show');
    setTimeout(() => {
      if (document.body.contains(alert)) document.body.removeChild(alert);
      if (document.body.contains(backdrop)) document.body.removeChild(backdrop);
      if (typeof callback === 'function') callback();
    }, 300);
  }, 3000);
}

  };

  const createConfirmBox = (message, styleClass, callback, icon) => {
  const backdrop = document.createElement('div');
  backdrop.className = 'flash-backdrop';

  const alert = document.createElement('div');
  alert.className = `flash-alert ${styleClass}`;

  const msgBox = document.createElement('div');
  msgBox.className = 'flash-message';

  msgBox.innerHTML = icon ? `<span class="flash-icon">${icon}</span> ${message}` : message;
  alert.appendChild(msgBox);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'flash-buttons';

  const okBtn = document.createElement('button');
  okBtn.className = 'flash-ok-button';
  okBtn.innerText = 'OK';

  const cancelBtn = document.createElement('button');
  cancelBtn.className = 'flash-ok-button';
  cancelBtn.innerText = 'Anuluj';
  cancelBtn.style.background = '#777';

  okBtn.onclick = () => {
    close(true);
  };
  cancelBtn.onclick = () => {
    close(false);
  };

  buttonRow.appendChild(cancelBtn);
  buttonRow.appendChild(okBtn);
  alert.appendChild(buttonRow);

  document.body.appendChild(backdrop);
  document.body.appendChild(alert);

  setTimeout(() => {
    alert.classList.add('show');
    backdrop.classList.add('show');
  }, 10);

  function close(confirmed) {
    alert.classList.remove('show');
    backdrop.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(alert);
      document.body.removeChild(backdrop);
      if (typeof callback === 'function') callback(confirmed);
    }, 300);
  }
};


  const defineStyle = (name, cssClass) => {
    styles[name] = {
      confirm: (msg, cb) => createConfirmBox(msg, cssClass, cb, '❓'),
      
      alert: (msg, cb) => createAlertBox(msg, cssClass, cb),
      alertNoButton: (msg) => createAlertBox(msg, cssClass, null, null, true),
      alertSuccess: (msg, cb) => createAlertBox(msg, `${cssClass} flash-success`, cb, '✔️'),
      alertError: (msg, cb) => createAlertBox(msg, `${cssClass} flash-error`, cb, '❌'),
      alertWarning: (msg, cb) => createAlertBox(msg, `${cssClass} flash-warning`, cb, '⚠️'),
      alertInfo: (msg, cb) => createAlertBox(msg, `${cssClass} flash-info`, cb, 'ℹ️'),
      alertLoading: (msg, callback) => createAlertBox(
  `<div class="flash-loading-icon"></div> ${msg}`,
  `${cssClass} flash-loading`,
  callback,
  null,
  true
),

      alertCustom: (msg, icon, color, cb) => {
        const customClass = `${cssClass} flash-custom`;
        createAlertBox(
          `<span style="color:${color}; font-size:1.2em; margin-right:6px;">${icon}</span>${msg}`,
          customClass,
          cb,
          null,
          false
        );
      }
    };
  };

  // Register styles
  defineStyle('light', 'flash-light');
  defineStyle('dark', 'flash-dark');
  defineStyle('terminal', 'flash-terminal');
  defineStyle('retro', 'flash-retro');
  defineStyle('neon', 'flash-neon');
  defineStyle('plasma', 'flash-plasma');
  defineStyle('geo', 'flash-geo');
  defineStyle('aqua', 'flash-aqua');
  defineStyle('cyber', 'flash-cyber');
  defineStyle('deepin', 'flash-deepin');
  defineStyle('materialDesign', 'flash-materialDesign');

  return styles;
})();

export default flashAlert;
