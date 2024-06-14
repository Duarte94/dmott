// Función para obtener el estado del temporizador por ID
async function getTimerStatus(id) {
  try {
    const response = await fetch(`/get-timer/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error getting timer status for ID ${id}:`, error);
    alert(`Error al obtener el estado del temporizador ${id}.`);
  }
}

// Función para iniciar el temporizador por ID
async function startTimer(id) {
  try {
    const response = await fetch(`/start-timer/${id}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error starting timer for ID ${id}:`, error);
    alert(`Error al iniciar el temporizador ${id}.`);
  }
}

// Función para detener el temporizador por ID
async function stopTimer(id) {
  try {
    const response = await fetch(`/stop-timer/${id}`, {
      method: 'POST'
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(`Error stopping timer for ID ${id}:`, error);
    alert(`Error al detener el temporizador ${id}.`);
  }
}

// Función para actualizar la interfaz del temporizador
async function updateTimerUI(id) {
  const timerStatus = await getTimerStatus(id);
  const timerElement = document.getElementById(`timer${id}`);
  if (timerStatus.endTime) {
    const remainingTime = new Date(timerStatus.endTime - Date.now()).toISOString().substr(11, 8);
    timerElement.textContent = `Tiempo restante: ${remainingTime}`;
  } else {
    timerElement.textContent = 'Temporizador detenido.';
  }
}

// Iniciar la interfaz al cargar la página
window.onload = function () {
  updateTimerUI(1);
  updateTimerUI(2);
  setInterval(() => {
    updateTimerUI(1);
    updateTimerUI(2);
  }, 1000);
};

// Event listeners para los botones de inicio y parada de temporizadores
document.getElementById('startTimer1').addEventListener('click', () => {
  startTimer(1).then(() => updateTimerUI(1));
});

document.getElementById('startTimer2').addEventListener('click', () => {
  startTimer(2).then(() => updateTimerUI(2));
});

document.getElementById('stopTimer1').addEventListener('click', () => {
  stopTimer(1).then(() => updateTimerUI(1));
});

document.getElementById('stopTimer2').addEventListener('click', () => {
  stopTimer(2).then(() => updateTimerUI(2));
});
