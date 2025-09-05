// Clase para manejar las reservas
class ReservationManager {
    constructor() {
        this.reservations = this.loadReservations();
        this.form = document.getElementById('reservationForm');
        this.messageContainer = document.getElementById('messageContainer');
        this.reservationsContainer = document.getElementById('reservationsContainer');
        
        this.initializeEventListeners();
        this.displayReservations();
    }

    // Inicializar event listeners
    initializeEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        
        // Establecer fecha mínima como hoy
        const dateInput = document.getElementById('date');
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        
        // Validaciones en tiempo real
        this.setupRealTimeValidation();
    }

    // Configurar validaciones en tiempo real
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    // Validar campo individual
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        switch(field.name) {
            case 'clientName':
                if (!value || value.length < 2) {
                    isValid = false;
                    message = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
            case 'date':
                if (!value) {
                    isValid = false;
                    message = 'La fecha es obligatoria';
                } else {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        isValid = false;
                        message = 'No se pueden seleccionar fechas pasadas';
                    }
                }
                break;
            case 'time':
                if (!value) {
                    isValid = false;
                    message = 'La hora es obligatoria';
                } else {
                    const [hours] = value.split(':').map(Number);
                    if (hours < 8 || hours > 22) {
                        isValid = false;
                        message = 'Horario: 8:00 AM - 10:00 PM';
                    }
                }
                break;
            case 'people':
                if (!value || parseInt(value) <= 0) {
                    isValid = false;
                    message = 'Debe ser mayor que 0';
                }
                break;
            case 'table':
                if (!value) {
                    isValid = false;
                    message = 'Debe seleccionar una mesa';
                }
                break;
        }

        this.showFieldValidation(field, isValid, message);
    }

    // Mostrar validación de campo
    showFieldValidation(field, isValid, message) {
        // Remover mensajes de error previos
        this.clearFieldError(field);
        
        if (!isValid) {
            field.classList.add('error-field');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    }

    // Limpiar error de campo
    clearFieldError(field) {
        field.classList.remove('error-field');
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    // Manejar el envío del formulario
    handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const reservation = {
            id: Date.now(),
            clientName: formData.get('clientName').trim(),
            date: formData.get('date'),
            time: formData.get('time'),
            people: parseInt(formData.get('people')),
            table: formData.get('table'),
            createdAt: new Date().toISOString()
        };

        // Validar la reserva
        const validation = this.validateReservation(reservation);
        
        if (validation.isValid) {
            this.addReservation(reservation);
            this.showMessage('✅ Reserva registrada exitosamente', 'success');
            this.form.reset();
        } else {
            this.showMessage(validation.message, 'error');
        }
    }

    // Validar la reserva
    validateReservation(reservation) {
        // Validar campos obligatorios
        if (!reservation.clientName || reservation.clientName.length < 2) {
            return {
                isValid: false,
                message: '❌ El nombre del cliente es obligatorio y debe tener al menos 2 caracteres'
            };
        }

        if (!reservation.date) {
            return {
                isValid: false,
                message: '❌ La fecha es obligatoria'
            };
        }

        if (!reservation.time) {
            return {
                isValid: false,
                message: '❌ La hora es obligatoria'
            };
        }

        if (!reservation.people || reservation.people <= 0) {
            return {
                isValid: false,
                message: '❌ El número de personas debe ser mayor que 0'
            };
        }

        if (!reservation.table) {
            return {
                isValid: false,
                message: '❌ La selección de mesa es obligatoria'
            };
        }

        // Validar fecha
        const selectedDate = new Date(reservation.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            return {
                isValid: false,
                message: '❌ La fecha ingresada ya pasó'
            };
        }

        // Validar hora
        const selectedTime = reservation.time;
        const [hours, minutes] = selectedTime.split(':').map(Number);
        
        if (hours < 8 || hours > 22) {
            return {
                isValid: false,
                message: '❌ El horario de reservas es de 8:00 AM a 10:00 PM'
            };
        }

        // Verificar si la mesa está disponible (evitar duplicados)
        const conflictingReservation = this.reservations.find(r => 
            r.table === reservation.table && 
            r.date === reservation.date && 
            r.time === reservation.time
        );

        if (conflictingReservation) {
            return {
                isValid: false,
                message: `❌ Esa mesa ya está ocupada en ese horario`
            };
        }

        return { isValid: true };
    }

    // Agregar una nueva reserva
    addReservation(reservation) {
        this.reservations.push(reservation);
        this.saveReservations();
        this.displayReservations();
    }

    // Eliminar una reserva
    deleteReservation(id) {
        this.reservations = this.reservations.filter(r => r.id !== id);
        this.saveReservations();
        this.displayReservations();
        this.showMessage('🗑️ Reserva cancelada exitosamente', 'info');
    }

    // Editar una reserva
    editReservation(id) {
        const reservation = this.reservations.find(r => r.id === id);
        if (!reservation) {
            this.showMessage('❌ No se encontró la reserva', 'error');
            return;
        }

        // Llenar el formulario con los datos de la reserva
        this.fillFormWithReservation(reservation);
        
        // Cambiar el botón a "Actualizar"
        this.changeFormToEditMode(id);
        
        this.showMessage('✏️ Modo edición activado. Modifica los datos y haz clic en "Actualizar"', 'info');
    }

    // Llenar formulario con datos de reserva
    fillFormWithReservation(reservation) {
        document.getElementById('clientName').value = reservation.clientName;
        document.getElementById('date').value = reservation.date;
        document.getElementById('time').value = reservation.time;
        document.getElementById('people').value = reservation.people;
        document.getElementById('table').value = reservation.table;
    }

    // Cambiar formulario a modo edición
    changeFormToEditMode(reservationId) {
        const submitBtn = this.form.querySelector('.btn-reserve');
        submitBtn.textContent = 'Actualizar Reserva';
        submitBtn.classList.add('edit-mode');
        
        // Mostrar botón de cancelar edición
        const cancelBtn = this.form.querySelector('.btn-cancel-edit');
        cancelBtn.style.display = 'inline-block';
        
        // Guardar el ID de la reserva que se está editando
        this.form.dataset.editId = reservationId;
        
        // Cambiar el evento del formulario
        this.form.removeEventListener('submit', this.handleFormSubmit);
        this.form.addEventListener('submit', (e) => this.handleEditSubmit(e));
    }

    // Manejar la actualización de una reserva
    handleEditSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(this.form);
        const reservationId = parseInt(this.form.dataset.editId);
        
        const updatedReservation = {
            id: reservationId,
            clientName: formData.get('clientName').trim(),
            date: formData.get('date'),
            time: formData.get('time'),
            people: parseInt(formData.get('people')),
            table: formData.get('table'),
            createdAt: new Date().toISOString()
        };

        // Validar la reserva actualizada
        const validation = this.validateReservation(updatedReservation);
        
        if (validation.isValid) {
            this.updateReservation(updatedReservation);
            this.resetFormToCreateMode();
            this.showMessage('✅ Reserva actualizada exitosamente', 'success');
        } else {
            this.showMessage(validation.message, 'error');
        }
    }

    // Actualizar una reserva
    updateReservation(updatedReservation) {
        const index = this.reservations.findIndex(r => r.id === updatedReservation.id);
        if (index !== -1) {
            this.reservations[index] = updatedReservation;
            this.saveReservations();
            this.displayReservations();
        }
    }

    // Resetear formulario a modo creación
    resetFormToCreateMode() {
        this.form.reset();
        const submitBtn = this.form.querySelector('.btn-reserve');
        submitBtn.textContent = 'Reservar';
        submitBtn.classList.remove('edit-mode');
        
        // Ocultar botón de cancelar edición
        const cancelBtn = this.form.querySelector('.btn-cancel-edit');
        cancelBtn.style.display = 'none';
        
        delete this.form.dataset.editId;
        
        // Restaurar el evento original del formulario
        this.form.removeEventListener('submit', this.handleEditSubmit);
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }

    // Cancelar edición
    cancelEdit() {
        this.resetFormToCreateMode();
        this.showMessage('❌ Edición cancelada', 'info');
    }

    // Mostrar reservas en la interfaz
    displayReservations() {
        if (this.reservations.length === 0) {
            this.reservationsContainer.innerHTML = `
                <div style="text-align: center; color: #666; padding: 40px;">
                    <p>No hay reservas registradas</p>
                    <p>¡Haz la primera reserva!</p>
                </div>
            `;
            return;
        }

        // Ordenar reservas por fecha y hora
        const sortedReservations = this.reservations.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateA - dateB;
        });

        this.reservationsContainer.innerHTML = `
            <table class="reservations-table">
                <thead>
                    <tr>
                        <th>Cliente</th>
                        <th>Fecha</th>
                        <th>Hora</th>
                        <th>Personas</th>
                        <th>Mesa</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedReservations.map(reservation => {
                        const formattedDate = this.formatDate(reservation.date);
                        const formattedTime = this.formatTime(reservation.time);
                        
                        return `
                            <tr>
                                <td><strong>${reservation.clientName}</strong></td>
                                <td>${formattedDate}</td>
                                <td>${formattedTime}</td>
                                <td>${reservation.people}</td>
                                <td>${reservation.table}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="edit-btn" onclick="reservationManager.editReservation(${reservation.id})" title="Editar esta reserva">
                                            ✏️ Editar
                                        </button>
                                        <button class="delete-btn" onclick="reservationManager.deleteReservation(${reservation.id})" title="Cancelar esta reserva">
                                            🗑️ Cancelar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    }

    // Mostrar mensajes
    showMessage(message, type = 'info') {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${type}`;
        messageElement.textContent = message;
        
        this.messageContainer.appendChild(messageElement);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 5000);
    }

    // Formatear fecha
    formatDate(dateString) {
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    }

    // Formatear hora
    formatTime(timeString) {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        return `${displayHour}:${minutes} ${ampm}`;
    }

    // Guardar reservas en localStorage
    saveReservations() {
        localStorage.setItem('restaurantReservations', JSON.stringify(this.reservations));
    }

    // Cargar reservas desde localStorage
    loadReservations() {
        const saved = localStorage.getItem('restaurantReservations');
        return saved ? JSON.parse(saved) : [];
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.reservationManager = new ReservationManager();
    
    // Mostrar mensaje de bienvenida
    setTimeout(() => {
        window.reservationManager.showMessage('🎉 ¡Bienvenido al sistema de reservas!', 'info');
    }, 500);
});

// Función para limpiar todas las reservas (útil para testing)
function clearAllReservations() {
    if (confirm('¿Estás seguro de que quieres eliminar todas las reservas?')) {
        localStorage.removeItem('restaurantReservations');
        window.reservationManager.reservations = [];
        window.reservationManager.displayReservations();
        window.reservationManager.showMessage('🗑️ Todas las reservas han sido eliminadas', 'info');
    }
}

// Función para mostrar estadísticas de reservas
function showReservationStats() {
    const reservations = window.reservationManager.reservations;
    const totalReservations = reservations.length;
    
    if (totalReservations === 0) {
        window.reservationManager.showMessage('📊 No hay reservas para mostrar estadísticas', 'info');
        return;
    }
    
    // Contar reservas por mesa
    const tableStats = {};
    reservations.forEach(r => {
        tableStats[r.table] = (tableStats[r.table] || 0) + 1;
    });
    
    // Encontrar mesa más popular
    const mostPopularTable = Object.keys(tableStats).reduce((a, b) => 
        tableStats[a] > tableStats[b] ? a : b
    );
    
    // Calcular total de personas
    const totalPeople = reservations.reduce((sum, r) => sum + r.people, 0);
    
    const statsMessage = `
        📊 Estadísticas de Reservas:
        • Total de reservas: ${totalReservations}
        • Total de personas: ${totalPeople}
        • Mesa más popular: ${mostPopularTable} (${tableStats[mostPopularTable]} reservas)
    `;
    
    window.reservationManager.showMessage(statsMessage, 'info');
}
