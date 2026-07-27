# 💬 Nexus Store - Ayesha Chat Frontend

Interfaz de usuario moderna y responsiva para el **agente de IA de Nexus Store (Ayesha)**. Está diseñada con un estilo corporativo oscuro utilizando **Tailwind CSS** y **Vanilla JavaScript**, conectándose de forma fluida a una API REST basada en **FastAPI** en Python.

---

## 🚀 Características Principales

* **Interfaz Fluida y Responsiva:** Diseño adaptado para dispositivos móviles y de escritorio utilizando Tailwind CSS y modo oscuro nativo.
* **Indicador de Estado de la API:** Monitoreo visual en tiempo real de la conexión con el servidor backend.
* **Historial de Conversación:** Persistencia temporal en la sesión del navegador (`sessionStorage`) para no perder el hilo de las consultas.
* **Accesos Rápidos:** Tarjetas interactivas en la vista de bienvenida para consultas frecuentes (métodos de pago, rastreo de envíos, devoluciones y ofertas).
* **Configuración Dinámica:** Modal integrado para cambiar el endpoint de la API REST de forma flexible si el servidor cambia de puerto o IP.
* **Funcionalidad de Copiado:** Botón rápido para copiar las respuestas generadas por el agente directamente al portapapeles.

---

## 🛠️ Tecnologías Utilizadas

* **HTML5 & Vanilla JavaScript (ES6+):** Lógica del cliente, manejo de eventos y comunicación asíncrona (`fetch`).
* **Tailwind CSS:** Framework de estilos utilitarios aplicado mediante CDN.
* **FastAPI (Backend Conectado):** API REST en Python encargada de orquestar el agente de IA y el sistema RAG.

---

## ⚙️ Instrucciones de Ejecución Local

Para poner en marcha esta interfaz frontend en tu entorno local, sigue estos pasos:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/Miguel-Dark/nexus-store-chat.git
cd nexus-store-chat
```

2. Abrir el Proyecto
Dado que es una aplicación frontend basada en archivos estáticos (index.html, style.css, script.js), puedes abrirla de dos formas:

- Directamente: Haz doble clic en el archivo index.html para abrirlo en tu navegador web.
- Con un Servidor Local (Recomendado): Si usas Visual Studio Code, puedes abrir la carpeta y utilizar la extensión Live Server para levantar el entorno.

3. Conectar con el Backend
Asegúrate de tener corriendo tu servidor FastAPI del agente (por defecto en http://localhost:8000/chat). La interfaz se conectará automáticamente a este endpoint. Si tu backend corre en otra dirección, puedes configurarlo haciendo clic en el ícono de configuración (⚙️) en la parte superior derecha de la interfaz.

Desarrollado por Miguel Ángel de la Cruz Lázaro