let currentEndpoint = localStorage.getItem('ayesha_endpoint') || 'http://127.0.0.1:8000/chat';
let chatHistory = JSON.parse(sessionStorage.getItem('ayesha_chat_history')) || [];

const chatContainer = document.getElementById('chatContainer');
const messagesList = document.getElementById('messagesList');
const chatForm = document.getElementById('chatForm');
const userPrompt = document.getElementById('userPrompt');
const btnSend = document.getElementById('btnSend');
const typingIndicator = document.getElementById('typingIndicator');
const welcomeCard = document.getElementById('welcomeCard');
const endpointStatus = document.getElementById('endpointStatus');
const btnClear = document.getElementById('btnClear');

const btnSettings = document.getElementById('btnSettings');
const settingsModal = document.getElementById('settingsModal');
const apiEndpointInput = document.getElementById('apiEndpointInput');
const btnCancelSettings = document.getElementById('btnCancelSettings');
const btnSaveSettings = document.getElementById('btnSaveSettings');

// Escuchar cuando el usuario presiona la flecha de "atrás" o "adelante" en el navegador
window.addEventListener('popstate', (event) => {
    // Si el estado guardado indica que estábamos en la vista inicial o vacía
    if (welcomeCard.classList.contains('hidden')) {
        welcomeCard.classList.remove('hidden');
        messagesList.innerHTML = ''; // Opcional: limpiar mensajes si deseas resetear la vista
        chatHistory = [];
        sessionStorage.removeItem('ayesha_chat_history');

        document.getElementById('btnClear').classList.add('hidden');
    }
});

endpointStatus.textContent = `Endpoint: ${currentEndpoint}`;
apiEndpointInput.value = currentEndpoint;

// Cargar historial previo si existe
if (chatHistory.length > 0) {
    welcomeCard.classList.add('hidden');

    document.getElementById('btnClear').classList.remove('hidden');

    chatHistory.forEach(msg => {
        if (msg.sender === 'user') {
            renderUserMessage(msg.text, msg.time, false);
        } else {
            renderAyeshaMessage(msg.text, msg.citations, msg.action, msg.time, false);
        }
    });
    scrollToBottom();
}

btnSettings.addEventListener('click', () => settingsModal.classList.remove('hidden'));
btnCancelSettings.addEventListener('click', () => settingsModal.classList.add('hidden'));
btnSaveSettings.addEventListener('click', () => {
    const val = apiEndpointInput.value.trim();
    if (val) {
        currentEndpoint = val;
        localStorage.setItem('ayesha_endpoint', val);
        endpointStatus.textContent = `Endpoint: ${val}`;
        settingsModal.classList.add('hidden');
    }
});

btnClear.addEventListener('click', () => {
    if (confirm("¿Estás seguro de que deseas limpiar toda la conversación?")) {
        messagesList.innerHTML = '';
        chatHistory = [];
        sessionStorage.removeItem('ayesha_chat_history');
        welcomeCard.classList.remove('hidden');

        document.getElementById('btnClear').classList.add('hidden');
    }
});

function sendQuickPrompt(text) {
    userPrompt.value = text;
    handleFormSubmit(new Event('submit'));
}

async function handleFormSubmit(e) {
    if (e) e.preventDefault();

    const text = userPrompt.value.trim();
    if (!text) return;

    if (!welcomeCard.classList.contains('hidden')) {
        welcomeCard.classList.add('hidden');

        document.getElementById('btnClear').classList.remove('hidden');

        // Aquí agregamos el estado al historial justo al ocultar la bienvenida
        history.pushState({ view: 'chat' }, '', window.location.href);
    }

    renderUserMessage(text);
    userPrompt.value = '';
    setLoadingState(true);
    scrollToBottom();

    try {
        const endpointFinal = currentEndpoint.endsWith('/chat') ? currentEndpoint : `${currentEndpoint.replace(/\/$/, '')}/chat`;
        const response = await fetch(endpointFinal, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ pregunta: text })
        });

        if (!response.ok) {
            throw new Error(`Error en el servidor: HTTP Status ${response.status}`);
        }

        const data = await response.json();
        const aiResponseText = data.respuesta || "No se obtuvo una respuesta válida de Ayesha.";
        const citationCount = data.citaciones_count || 0;
        const finalAction = data.accion_final || null;
        const aiTimeStr = getFormattedTime();

        renderAyeshaMessage(aiResponseText, citationCount, finalAction, aiTimeStr);

    } catch (error) {
        console.error("Backend Error:", error);
        renderErrorMessage("No se pudo conectar con el servidor de Ayesha en (" + currentEndpoint + "). Asegúrate de que tu servicio FastAPI esté corriendo.");
    } finally {
        setLoadingState(false);
        scrollToBottom();
        userPrompt.focus();
    }
}

function renderUserMessage(text, customTime = null, saveToStorage = true) {
    const timeStr = customTime || getFormattedTime();
    const messageHTML = `
        <div class="flex flex-col items-end gap-1 chat-bubble-enter">
            <div class="max-w-[85%] sm:max-w-[75%] bg-brand-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm shadow-md text-sm leading-relaxed break-words">
                ${escapeHTML(text)}
            </div>
            <span class="text-xs text-slate-500 mr-1 font-mono">${timeStr}</span>
        </div>
    `;
    messagesList.insertAdjacentHTML('beforeend', messageHTML);

    if (saveToStorage) {
        chatHistory.push({ sender: 'user', text, time: timeStr });
        sessionStorage.setItem('ayesha_chat_history', JSON.stringify(chatHistory));
    }
}

function renderAyeshaMessage(text, citationCount = 0, finalAction = null, timeStr, saveToStorage = true) {
    //const timeStr = getFormattedTime();
    const formattedText = formatText(text);

    //let badgesHTML = '';
    //if (citationCount > 0) {
    //    badgesHTML += `<span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700"> ${citationCount} citas</span>`;
    //}
    //if (finalAction) {
    //    badgesHTML += `<span class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-brand-900/40 text-brand-300 border border-brand-700/50"> Status: ${escapeHTML(finalAction)}</span>`;
    //}

    const messageHTML = `
        <div class="flex items-start gap-3 chat-bubble-enter">
            <!-- Avatar profesional de Ayesha estilo corporativo -->
            <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-brand-900/30 mt-0.5 border border-brand-500/30">
                <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div class="flex flex-col items-start gap-1 max-w-[85%] sm:max-w-[75%]">
                <div class="bg-darkbg-surface border border-slate-800 text-slate-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md text-sm leading-relaxed space-y-2 relative group w-full">
                    <div>${formattedText}</div>
                    <button onclick="copyToClipboard(this)" data-text="${escapeHTML(text)}" class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-white bg-slate-800 rounded transition" title="Copiar texto">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                    </button>
                </div>
                <span class="text-xs text-slate-500 ml-1 font-mono">${timeStr}</span>
            </div>
        </div>
    `;
    messagesList.insertAdjacentHTML('beforeend', messageHTML);

    if (saveToStorage) {
        chatHistory.push({ sender: 'ai', text, citations: citationCount, action: finalAction, time: timeStr });
        sessionStorage.setItem('ayesha_chat_history', JSON.stringify(chatHistory));
    }
}

function renderErrorMessage(msg) {
    const messageHTML = `
        <div class="flex items-start gap-3 chat-bubble-enter">
            <div class="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center shrink-0 text-rose-400">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div class="bg-rose-950/30 border border-rose-900/60 text-rose-200 px-4 py-3 rounded-2xl rounded-tl-sm shadow-md text-sm leading-relaxed max-w-[85%] sm:max-w-[75%]">
                <p class="font-semibold mb-1 text-rose-400">Error de Comunicación</p>
                <p class="text-xs text-rose-300/90 leading-normal">${escapeHTML(msg)}</p>
            </div>
        </div>
    `;
    messagesList.insertAdjacentHTML('beforeend', messageHTML);
}

function setLoadingState(isLoading) {
    if (isLoading) {
        userPrompt.disabled = true;
        btnSend.disabled = true;
        typingIndicator.classList.remove('hidden');
    } else {
        userPrompt.disabled = false;
        btnSend.disabled = false;
        typingIndicator.classList.add('hidden');
    }
}

function scrollToBottom() {
    setTimeout(() => {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 50);
}

function getFormattedTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function formatText(text) {
    let clean = escapeHTML(text);
    clean = clean.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>');
    clean = clean.replace(/\n/g, '<br/>');
    return clean;
}

function copyToClipboard(btn) {
    const text = btn.getAttribute('data-text');
    if (!text) return;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    const originalHTML = btn.innerHTML;
    btn.innerHTML = `<span class="text-[10px] text-emerald-400">¡Copiado!</span>`;
    setTimeout(() => { btn.innerHTML = originalHTML; }, 1500);
}