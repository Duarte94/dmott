// Función para iniciar el temporizador por ID
async function startTimer(id) {
    try {
      const response = await fetch(`/start-timer/${id}`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      alert(`Temporizador ${id} iniciado con éxito.`);
    } catch (error) {
      console.error('Error starting timer:', error);
      alert('Error al iniciar el temporizador.');
    }
  }
  
  // Función para detener el temporizador por ID
  async function stopTimer(id) {
    try {
      const response = await fetch(`/stop-timer/${id}`, {
        method: 'POST',
      });
      const data = await response.json();
      console.log(data);
      alert(`Temporizador ${id} detenido con éxito.`);
    } catch (error) {
      console.error('Error stopping timer:', error);
      alert('Error al detener el temporizador.');
    }
  }
  
  // Función para obtener el estado del temporizador por ID
  async function getTimerStatus(id) {
    try {
      const response = await fetch(`/get-timer/${id}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error getting timer status:', error);
      alert('Error al obtener el estado del temporizador.');
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
  
  // Actualizar la interfaz al cargar la página
  window.onload = function () {
    updateTimerUI(1);
    updateTimerUI(2);
    setInterval(() => {
      updateTimerUI(1);
      updateTimerUI(2);
    }, 1000);
  };
s  