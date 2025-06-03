const form = document.getElementById('registroForm');
const categoria = document.getElementById('categoria');
const actividad = document.getElementById('actividad');
const calorias = document.getElementById('calorias');
const guardarBtn = document.getElementById('guardarBtn');
const limpiarBtn = document.getElementById('limpiarBtn');
const resetBtn = document.getElementById('resetBtn');
const resumen = document.getElementById('resumen');
const consumidas = document.getElementById('consumidas');
const quemadas = document.getElementById('quemadas');
const diferencia = document.getElementById('diferencia');
const diferenciaCard = document.getElementById('diferenciaCard');

const registrosContenedor = document.getElementById('registros');

let registros = JSON.parse(localStorage.getItem('registros')) || [];
let editandoId = null;

actualizarUI();


form.addEventListener('input', () => {
  const valido = categoria.value && actividad.value.trim() && calorias.value;
  guardarBtn.disabled = !valido;
});


form.addEventListener('submit', (e) => {
  e.preventDefault();

    const nuevoRegistro = {
      id: editandoId ?? Date.now(),
      tipo: categoria.value,
      descripcion: actividad.value.trim(),
      calorias: Number(calorias.value),
    };

      if (editandoId) {
        registros = registros.map(r => r.id === editandoId ? nuevoRegistro : r);
        editandoId = null;
        } else {
          registros.push(nuevoRegistro);
  }

  localStorage.setItem('registros', JSON.stringify(registros));
    limpiarFormulario();
    actualizarUI();
});


limpiarBtn.addEventListener('click', limpiarFormulario);

function limpiarFormulario() {
  categoria.value = '';
  actividad.value = '';
  calorias.value = '';
  guardarBtn.disabled = true;
}


function actualizarUI() {
  registrosContenedor.innerHTML = '';
  resumen.style.display = registros.length ? 'block' : 'none';
  resetBtn.disabled = !registros.length;

  let totalConsumidas = 0;
  let totalQuemadas = 0;

  registros.forEach(registro => {
    const card = document.createElement('div');
    card.classList.add('col-md-4');

    card.innerHTML = `
      <div class="card ${registro.tipo === 'Comida' ? 'border-success' : 'border-warning'}">
        <div class="card-body">
          <h5 class="card-title text-${registro.tipo === 'Comida' ? 'success' : 'warning'}">${registro.tipo}</h5>
          <p class="card-text">${registro.descripcion}</p>
          <p class="card-text"><strong>${registro.calorias} cal</strong></p>
          <div class="d-flex justify-content-between">
            <button class="btn btn-sm btn-primary" onclick="editarRegistro(${registro.id})">Editar</button>
            <button class="btn btn-sm btn-danger" onclick="eliminarRegistro(${registro.id})">Eliminar</button>
          </div>
        </div>
      </div>
    `;

    registrosContenedor.appendChild(card);

    if (registro.tipo === 'Comida') {
      totalConsumidas += registro.calorias;
    } else {
      totalQuemadas += registro.calorias;
    }
  });

  consumidas.textContent = totalConsumidas;
  quemadas.textContent = totalQuemadas;

  const dif = totalQuemadas - totalConsumidas;
    diferencia.textContent = dif;

    if (dif >= 0) {
      diferenciaCard.classList.remove('border-danger');
      diferenciaCard.classList.add('border-success');
      diferencia.classList.add('text-success');
      diferencia.classList.remove('text-danger');
    } else {
      diferenciaCard.classList.remove('border-success');
      diferenciaCard.classList.add('border-danger');
      diferencia.classList.add('text-danger');
      diferencia.classList.remove('text-success');
    }
}


function editarRegistro(id) {
  const registro = registros.find(r => r.id === id);
  categoria.value = registro.tipo;
  actividad.value = registro.descripcion;
  calorias.value = registro.calorias;
  editandoId = id;
  guardarBtn.disabled = false;
}


function eliminarRegistro(id) {
  registros = registros.filter(r => r.id !== id);
  localStorage.setItem('registros', JSON.stringify(registros));
  actualizarUI();
}


resetBtn.addEventListener('click', () => {
  if (confirm('¿Estás seguro de que quieres reiniciar todos los datos?')) {
    registros = [];
    localStorage.removeItem('registros');
    actualizarUI();
  }
});
