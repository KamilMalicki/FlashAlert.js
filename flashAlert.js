/*!
 * FlashAlert.js v1.0
 * Copyright (c) 2025 Kamil Malicki
 * All Rights Reserved
 *
 * License: Proprietary EULA
 * - Use allowed only under the End User License Agreement
 * - No modification, redistribution, or rebranding is permitted
 *
 * Full license: https://github.com/KamilMalicki/FlashAlert.js/blob/main/LICENSE.txt
 */
import Chart from 'chart.js/auto';
console.log("test");

export const flashAlert = (() => {
    const styles_flash = {};

    // --- FUNKCJA createPlotBox ---
    const createPlotBox = (data, options = {}) => {

        return new Promise((resolve) => {
            const defaultOptions = {
                type: 'bar',
                labels: [],
                title: 'Wykres',
                styleClass: '',
            };
            const finalOptions = { ...defaultOptions, ...options };

            const backdrop = document.createElement('div');
            backdrop.className = 'flash-backdrop show';

            const plotBox = document.createElement('div');
            plotBox.className = `flash-alert flash-plot ${finalOptions.styleClass}`;

            const canvas = document.createElement('canvas');
            canvas.width = 400; // Domyślna szerokość
            canvas.height = 300; // Domyślna wysokość
            plotBox.appendChild(canvas);

            const closeButton = document.createElement('button');
            closeButton.className = 'flash-ok-button flash-close-button';
            closeButton.innerText = 'Zamknij';
            closeButton.onclick = () => {
                plotBox.classList.remove('show');
                backdrop.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(plotBox);
                    document.body.removeChild(backdrop);
                    resolve();
                }, 300);
            };
            plotBox.appendChild(closeButton);

            const blockEnter = (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                }
            };
            document.addEventListener('keydown', blockEnter);

            const closeDialog = () => {
                plotBox.classList.remove('show');
                backdrop.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(plotBox);
                    document.body.removeChild(backdrop);
                    document.removeEventListener('keydown', blockEnter);
                    resolve();
                }, 300);
            };

            closeButton.onclick = closeDialog;


            document.body.appendChild(backdrop);
            document.body.appendChild(plotBox);

            setTimeout(() => {
                plotBox.classList.add('show');
                new Chart(canvas.getContext('2d'), {
                    type: finalOptions.type,
                    data: {
                        labels: finalOptions.labels,
                        datasets: [{
                            label: finalOptions.title,
                            data: data,
                            backgroundColor: finalOptions.backgroundColor || 'rgba(54, 162, 235, 0.5)',
                            borderColor: finalOptions.borderColor || 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }, 10);
        });
    };
    // --- KONIEC createPlotBox ---


    // --- FUNKCJA createAlertBox ---
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
            const blockEnter = (event) => { if (event.key === 'Enter') { event.preventDefault(); } };
            document.addEventListener('keydown', blockEnter);

            alert.appendChild(buttonRow);
        }

        document.body.appendChild(backdrop);
        document.body.appendChild(alert)

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
    // --- KONIEC createAlertBox ---

    // --- FUNKCJA createConfirmBox  ---
    const createConfirmBox = (message, styleClass, resolve, reject, confirmText = 'Tak', cancelText = 'Nie') => {
        const backdrop = document.createElement('div');
        backdrop.className = 'flash-backdrop';

        const confirmBox = document.createElement('div');
        confirmBox.className = `flash-alert flash-confirm ${styleClass}`;

        const msgBox = document.createElement('div');
        msgBox.className = 'flash-message';
        msgBox.innerHTML = message;

        confirmBox.appendChild(msgBox);

        const buttonRow = document.createElement('div');
        buttonRow.className = 'flash-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'flash-button flash-cancel-button';
        cancelButton.innerText = cancelText;
        cancelButton.onclick = () => {
            confirmBox.classList.remove('show');
            backdrop.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(confirmBox);
                document.body.removeChild(backdrop);
                resolve(false);
            }, 300);
        };
        buttonRow.appendChild(cancelButton);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'flash-button flash-confirm-button';
        confirmButton.innerText = confirmText;
        confirmButton.onclick = () => {
            confirmBox.classList.remove('show');
            backdrop.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(confirmBox);
                document.body.removeChild(backdrop);
                resolve(true);
            }, 300);
        };
        buttonRow.appendChild(confirmButton);

        confirmBox.appendChild(buttonRow);

        document.body.appendChild(backdrop);
        document.body.appendChild(confirmBox);

        setTimeout(() => {
            confirmBox.classList.add('show');
            backdrop.classList.add('show');
        }, 10);
    };
    // --- KONIEC createConfirmBox ---

    // --- FUNKCJA createPromptBox (TERAZ Z PROMISE I OBIKTEM OPCJI) ---
    const createPromptBox = (message, styleClass, resolve, reject, options = {}) => {
        const defaultOptions = {
            placeholder: '',
            defaultValue: '',
            confirmText: 'OK',
            cancelText: 'Anuluj'
        };
        const finalOptions = { ...defaultOptions, ...options };

        const backdrop = document.createElement('div');
        backdrop.className = 'flash-backdrop';

        const promptBox = document.createElement('div');
        promptBox.className = `flash-alert flash-prompt ${styleClass}`;

        const msgBox = document.createElement('div');
        msgBox.className = 'flash-message';
        msgBox.innerHTML = message;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.className = 'flash-prompt-input';
        inputField.placeholder = finalOptions.placeholder;
        inputField.value = finalOptions.defaultValue;
        inputField.focus();

        promptBox.appendChild(msgBox);
        promptBox.appendChild(inputField);

        const buttonRow = document.createElement('div');
        buttonRow.className = 'flash-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.className = 'flash-button flash-cancel-button';
        cancelButton.innerText = finalOptions.cancelText;
        cancelButton.onclick = () => {
            promptBox.classList.remove('show');
            backdrop.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(promptBox);
                document.body.removeChild(backdrop);
                reject(null);
            }, 300);
        };
        buttonRow.appendChild(cancelButton);

        const confirmButton = document.createElement('button');
        confirmButton.className = 'flash-button flash-confirm-button';
        confirmButton.innerText = finalOptions.confirmText;
        confirmButton.onclick = () => {
            const inputValue = inputField.value;
            promptBox.classList.remove('show');
            backdrop.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(promptBox);
                document.body.removeChild(backdrop);
                resolve(inputValue);
            }, 300);
        };
        buttonRow.appendChild(confirmButton);

        promptBox.appendChild(buttonRow);

        document.body.appendChild(backdrop);
        document.body.appendChild(promptBox);

        setTimeout(() => {
            promptBox.classList.add('show');
            backdrop.classList.add('show');
        }, 10);

        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                confirmButton.click();
            }
        });
    };
    // --- KONIEC createPromptBox ---

    // --- FUNKCJA createToastBox ---
    const createToastBox = (message, styleClass, typeIcon = '', duration = 3000) => {
        const toastContainer = document.getElementById('flash-toast-container') || (() => {
            const div = document.createElement('div');
            div.id = 'flash-toast-container';
            document.body.appendChild(div);
            return div;
        })();

        const toast = document.createElement('div');
        toast.className = `flash-toast ${styleClass}`;

        if (typeIcon) {
            toast.innerHTML = `<span class="flash-toast-icon">${typeIcon}</span> ${message}`;
        } else {
            toast.innerHTML = message;
        }

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            toast.addEventListener('transitionend', () => {
                if (!toast.classList.contains('show')) {
                    if (toastContainer.contains(toast)) {
                        toastContainer.removeChild(toast);
                        if (toastContainer.children.length === 0) {
                            document.body.removeChild(toastContainer);
                        }
                    }
                }
            }, { once: true });
        }, duration);
    };
    // --- KONIEC createToastBox ---

    // --- NOWY GLOBALNY WSKAŹNIK ŁADOWANIA ---
    const createLoadingSpinner = () => {
        let spinnerDiv = document.getElementById('flash-global-loading-spinner');
        if (!spinnerDiv) {
            spinnerDiv = document.createElement('div');
            spinnerDiv.id = 'flash-global-loading-spinner';
            spinnerDiv.className = 'flash-global-loading-spinner';
            spinnerDiv.innerHTML = `
                <div class="flash-spinner"></div>
                <p class="flash-loading-text">Ładowanie...</p>
            `;
            document.body.appendChild(spinnerDiv);
        }
        return spinnerDiv;
    };

    const loadingManager = {
        show: (message = 'Ładowanie...') => {
            const spinner = createLoadingSpinner();
            const loadingText = spinner.querySelector('.flash-loading-text');
            if (loadingText) {
                loadingText.textContent = message;
            }
            spinner.classList.add('show');
        },
        hide: () => {
            const spinner = document.getElementById('flash-global-loading-spinner');
            if (spinner) {
                spinner.classList.remove('show');
                spinner.addEventListener('transitionend', () => {
                    if (!spinner.classList.contains('show') && spinner.parentNode) {
                        spinner.parentNode.removeChild(spinner);
                    }
                }, { once: true });
            }
        }
    };
    // --- KONIEC GLOBALNEGO WSKAŹNIKA ŁADOWANIA ---

    // --- FUNKCJA createInputListBox ---
    const createInputListBox = (message, suggestions, styleClass, options) => {
        return new Promise((resolve) => {
            const defaultOptions = {
                placeholder: '',
                defaultValue: '',
                confirmText: 'OK',
                cancelText: 'Anuluj',
                filterable: true,
            };
            const finalOptions = { ...defaultOptions, ...options };

            const backdrop = document.createElement('div');
            backdrop.className = 'flash-backdrop';
            document.body.appendChild(backdrop);

            const alert = document.createElement('div');
            alert.className = `flash-alert ${styleClass}`;

            if (message) {
                const msgElem = document.createElement('div');
                msgElem.className = 'flash-message';
                msgElem.innerHTML = message;
                alert.appendChild(msgElem);
            }

            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'flash-prompt-input';
            input.placeholder = finalOptions.placeholder;
            input.value = finalOptions.defaultValue;
            alert.appendChild(input);

            const suggestionContainer = document.createElement('div');
            suggestionContainer.className = 'flash-suggestion-list-container';
            const suggestionList = document.createElement('ul');
            suggestionList.className = 'flash-suggestion-list';
            suggestionContainer.appendChild(suggestionList);
            alert.appendChild(suggestionContainer);

            const renderSuggestions = (filterText = '') => {
                suggestionList.innerHTML = '';
                const lowerFilterText = filterText.toLowerCase();
                let hasVisibleSuggestions = false;

                suggestions.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.className = 'flash-suggestion-item';
                    listItem.textContent = item;

                    if (finalOptions.filterable && lowerFilterText && !item.toLowerCase().includes(lowerFilterText)) {
                        listItem.classList.add('hidden');
                    } else {
                        hasVisibleSuggestions = true;
                    }

                    listItem.onclick = () => {
                        input.value = item;
                        input.focus();
                    };
                    suggestionList.appendChild(listItem);
                });

                if (!suggestions || suggestions.length === 0 || !hasVisibleSuggestions) {
                    suggestionContainer.style.display = 'none';
                } else {
                    suggestionContainer.style.display = 'block';
                }
            };

            renderSuggestions(input.value);

            if (finalOptions.filterable) {
                input.addEventListener('input', () => renderSuggestions(input.value));
            }

            const buttonRow = document.createElement('div');
            buttonRow.className = 'flash-buttons';
            alert.appendChild(buttonRow);

            const cancelButton = document.createElement('button');
            cancelButton.className = 'flash-button flash-cancel-button';
            cancelButton.textContent = finalOptions.cancelText;
            buttonRow.appendChild(cancelButton);

            const confirmButton = document.createElement('button');
            confirmButton.className = 'flash-button flash-confirm-button';
            confirmButton.textContent = finalOptions.confirmText;
            buttonRow.appendChild(confirmButton);

            const closeDialog = (value = null) => {
                alert.classList.remove('show');
                backdrop.classList.remove('show');
                backdrop.removeEventListener('click', closeOnBackdropClick);
                document.removeEventListener('keydown', handleEscapeKey);

                setTimeout(() => {
                    if (document.body.contains(alert)) document.body.removeChild(alert);
                    if (document.body.contains(backdrop)) document.body.removeChild(backdrop);
                    resolve(value);
                }, 300);
            };

            confirmButton.onclick = () => closeDialog(input.value);
            cancelButton.onclick = () => closeDialog(null);
            const closeOnBackdropClick = () => closeDialog(null);
            backdrop.addEventListener('click', closeOnBackdropClick);

            const handleEscapeKey = (e) => {
                if (e.key === 'Escape') {
                    closeDialog(null);
                }
            };
            document.addEventListener('keydown', handleEscapeKey);

            document.body.appendChild(alert);
            setTimeout(() => {
                backdrop.classList.add('show');
                alert.classList.add('show');
                input.focus();
            }, 10);
        });

        
    };
    // --- KONIEC createInputListBox ---


    const defineStyle = (name, cssClass) => {
        styles_flash[name] = {
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

            toast: (msg, duration) => createToastBox(msg, cssClass, '', duration),
            toastSuccess: (msg, duration) => createToastBox(msg, `${cssClass} flash-toast-success`, '✔️', duration),
            toastError: (msg, duration) => createToastBox(msg, `${cssClass} flash-toast-error`, '❌', duration),
            toastWarning: (msg, duration) => createToastBox(msg, `${cssClass} flash-toast-warning`, '⚠️', duration),
            toastInfo: (msg, duration) => createToastBox(msg, `${cssClass} flash-toast-info`, 'ℹ️', duration),

            prompt: (msg, options = {}) => {
                return new Promise((resolve, reject) => {
                    createPromptBox(msg, cssClass, resolve, reject, options);
                });
            },

            confirm: (msg, confirmText = 'Tak', cancelText = 'Nie') => {
                return new Promise((resolve, reject) => {
                    createConfirmBox(msg, cssClass, resolve, reject, confirmText, cancelText);
                });
            },

            alertCustom: (msg, icon, color, cb) => {
                const customClass = `${cssClass} flash-custom`;
                createAlertBox(
                    `<span style="color:${color}; font-size:1.2em; margin-right:6px;">${icon}</span>${msg}`,
                    customClass,
                    cb,
                    null,
                    false
                );
            },

            inputList: (message, suggestions, options = {}) => {
                return createInputListBox(message, suggestions, `${cssClass} flash-prompt`, options);
            },

            plot: (data, options = {}) => {
                return createPlotBox(data, { ...options, styleClass: `${cssClass} flash-plot` });
            },
        };
    };


    // Rejestracja wszystkich dostępnych stylów
    defineStyle('light', 'flash-light'); // light
    defineStyle('dark', 'flash-dark'); // dark
    defineStyle('terminal', 'flash-terminal'); // terminal
    defineStyle('retro', 'flash-retro'); // retro
    defineStyle('neon', 'flash-neon'); // neon
    defineStyle('plasma', 'flash-plasma'); // plasma
    defineStyle('geo', 'flash-geo'); // geo 
    defineStyle('aqua', 'flash-aqua'); // aqua
    defineStyle('cyber', 'flash-cyber'); // cyber
    defineStyle('deepin', 'flash-deepin'); // deepin
    defineStyle('materialDesign', 'flash-materialDesign'); // materialDesign

    return {
        ...styles_flash,
        loading: loadingManager,
        initPlot
    };
})();

export default flashAlert;
