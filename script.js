// Clase para manejar las reservas
class ReservationManager {
    constructor() {
        this.reservations = this.loadReservations();
        this.form = document.getElementById('reservationForm');
        this.messageContainer = document.getElementById('messageContainer');
        this.reservationsContainer = document.getElementById('reservationsContainer');
        this.messageCount = document.getElementById('messageCount');
        this.reservationCount = document.getElementById('reservationCount');
        this.loadingOverlay = document.getElementById('loadingOverlay');
        
        this.initializeEventListeners();
        this.displayReservations();
        this.updateCounters();
        this.initializeAnimations();
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
        
        // Efectos de hover en inputs
        this.setupInputEffects();
    }

    // Inicializar animaciones
    initializeAnimations() {
        // Animar elementos al cargar
        this.animateOnLoad();
        
        // Efectos de parallax suave
        this.setupParallaxEffect();
    }

    // Animar elementos al cargar
    animateOnLoad() {
        const cards = document.querySelectorAll('.glass-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }

    // Efecto parallax suave
    setupParallaxEffect() {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const shapes = document.querySelectorAll('.shape');
            
            shapes.forEach((shape, index) => {
                const speed = 0.5 + (index * 0.1);
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    // Efectos en inputs
    setupInputEffects() {
        const inputs = this.form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });
        });
    }

    // Actualizar contadores
    updateCounters() {
        if (this.messageCount) {
            const messageElements = this.messageContainer.children;
            this.messageCount.textContent = messageElements.length;
        }
        
        if (this.reservationCount) {
            const count = this.reservations.length;
            this.reservationCount.textContent = `${count} reserva${count !== 1 ? 's' : ''}`;
        }
    }

    // Mostrar loading
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'flex';
        }
    }

    // Ocultar loading
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.style.display = 'none';
        }
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
                                    if (hours < 7 || hours > 22) {
                    isValid = false;
                    message = 'Horario: 7:00 AM - 10:00 PM';
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
        
        this.showLoading();
        
        // Simular procesamiento
        setTimeout(() => {
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
            this.showMessage('🌿 ¡Reserva confirmada! Te esperamos en GreenFit Bistro', 'success');
            this.form.reset();
            this.animateSuccess();
        } else {
            this.showMessage(validation.message, 'error');
        }
            
            this.hideLoading();
        }, 1500);
    }

    // Animación de éxito
    animateSuccess() {
        const submitBtn = this.form.querySelector('.btn-reserve');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-leaf"></i><span>¡Confirmado!</span>';
        submitBtn.style.background = 'var(--success-gradient)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 2000);
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
        
        if (hours < 7 || hours > 22) {
            return {
                isValid: false,
                message: '❌ El horario de reservas es de 7:00 AM a 10:00 PM'
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
        this.updateCounters();
        this.animateNewReservation();
    }

    // Animar nueva reserva
    animateNewReservation() {
        const rows = this.reservationsContainer.querySelectorAll('tbody tr');
        if (rows.length > 0) {
            const newRow = rows[rows.length - 1];
            newRow.style.opacity = '0';
            newRow.style.transform = 'translateX(-50px)';
            
            setTimeout(() => {
                newRow.style.transition = 'all 0.5s ease';
                newRow.style.opacity = '1';
                newRow.style.transform = 'translateX(0)';
            }, 100);
        }
    }

    // Eliminar una reserva
    deleteReservation(id) {
        // Animar eliminación
        const row = document.querySelector(`[data-reservation-id="${id}"]`);
        if (row) {
            row.style.transition = 'all 0.3s ease';
            row.style.opacity = '0';
            row.style.transform = 'translateX(50px)';
            
            setTimeout(() => {
                this.reservations = this.reservations.filter(r => r.id !== id);
                this.saveReservations();
                this.displayReservations();
                this.updateCounters();
                this.showMessage('🗑️ Reserva cancelada exitosamente', 'info');
            }, 300);
        }
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
                            <tr data-reservation-id="${reservation.id}">
                                <td><strong>${reservation.clientName}</strong></td>
                                <td>${formattedDate}</td>
                                <td>${formattedTime}</td>
                                <td>${reservation.people}</td>
                                <td>${reservation.table}</td>
                                <td>
                                    <div class="action-buttons">
                                        <button class="edit-btn" onclick="reservationManager.editReservation(${reservation.id})" title="Editar esta reserva">
                                            <i class="fas fa-edit"></i> Editar
                                        </button>
                                        <button class="delete-btn" onclick="reservationManager.deleteReservation(${reservation.id})" title="Cancelar esta reserva">
                                            <i class="fas fa-trash"></i> Cancelar
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
        messageElement.innerHTML = `
            <div class="message-content">
                <i class="fas fa-${this.getMessageIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Animar entrada
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(-20px)';
        
        this.messageContainer.appendChild(messageElement);
        this.updateCounters();
        
        // Animar aparición
        setTimeout(() => {
            messageElement.style.transition = 'all 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 100);
        
        // Eliminar el mensaje después de 5 segundos
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.style.transition = 'all 0.3s ease';
                messageElement.style.opacity = '0';
                messageElement.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    if (messageElement.parentNode) {
                        messageElement.parentNode.removeChild(messageElement);
                        this.updateCounters();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Obtener icono del mensaje
    getMessageIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
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
        window.reservationManager.showMessage('🌿 ¡Bienvenido a GreenFit Bistro! Disfruta de nuestra comida saludable', 'info');
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
    
    // Calcular promedio de personas por reserva
    const avgPeople = (totalPeople / totalReservations).toFixed(1);
    
    // Reservas por día de la semana
    const dayStats = {};
    reservations.forEach(r => {
        const day = new Date(r.date).toLocaleDateString('es-ES', { weekday: 'long' });
        dayStats[day] = (dayStats[day] || 0) + 1;
    });
    
    const busiestDay = Object.keys(dayStats).reduce((a, b) => 
        dayStats[a] > dayStats[b] ? a : b
    );
    
    const statsMessage = `
        📊 Estadísticas Detalladas:
        • Total de reservas: ${totalReservations}
        • Total de personas: ${totalPeople}
        • Promedio por reserva: ${avgPeople} personas
        • Mesa más popular: ${mostPopularTable} (${tableStats[mostPopularTable]} reservas)
        • Día más ocupado: ${busiestDay} (${dayStats[busiestDay]} reservas)
    `;
    
    window.reservationManager.showMessage(statsMessage, 'info');
}

// Función para exportar reservas
function exportReservations() {
    const reservations = window.reservationManager.reservations;
    
    if (reservations.length === 0) {
        window.reservationManager.showMessage('📄 No hay reservas para exportar', 'info');
        return;
    }
    
    // Crear CSV
    const headers = ['Cliente', 'Fecha', 'Hora', 'Personas', 'Mesa', 'Fecha de Creación'];
    const csvContent = [
        headers.join(','),
        ...reservations.map(r => [
            `"${r.clientName}"`,
            r.date,
            r.time,
            r.people,
            `"${r.table}"`,
            new Date(r.createdAt).toLocaleString('es-ES')
        ].join(','))
    ].join('\n');
    
    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reservas_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.reservationManager.showMessage('📄 Reservas exportadas exitosamente', 'success');
}

// Función para mostrar notificaciones del sistema
function showSystemNotification(message, type = 'info') {
    // Crear notificación toast
    const notification = document.createElement('div');
    notification.className = `toast-notification ${type}`;
    notification.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${window.reservationManager.getMessageIcon(type)}"></i>
            <span>${message}</span>
            <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Posicionar en la esquina superior derecha
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        background: var(--glass-bg);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        box-shadow: var(--shadow-xl);
        color: white;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Función para mostrar información del restaurante
function showRestaurantInfo() {
    const infoMessage = `
        🌿 GreenFit Bistro - Información:
        • Comida 100% orgánica y saludable
        • Ingredientes frescos y locales
        • Opciones veganas y vegetarianas
        • Sin conservantes artificiales
        • Menú bajo en calorías
        • Ambiente relajado y moderno
        • WiFi gratuito
        • Estacionamiento disponible
    `;
    
    window.reservationManager.showMessage(infoMessage, 'info');
}

// Función para mostrar beneficios de la comida fit
function showHealthBenefits() {
    const benefitsMessage = `
        💪 Beneficios de Nuestra Comida:
        • Aumenta tu energía naturalmente
        • Mejora tu digestión
        • Fortalece tu sistema inmunológico
        • Ayuda a mantener un peso saludable
        • Reduce el riesgo de enfermedades
        • Mejora tu concentración
        • Te hace sentir más liviano y activo
    `;
    
    window.reservationManager.showMessage(benefitsMessage, 'info');
}

// Añadir estilos CSS para las notificaciones toast
const toastStyles = document.createElement('style');
toastStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
    
    .toast-close {
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: background 0.3s ease;
    }
    
    .toast-close:hover {
        background: rgba(255, 255, 255, 0.1);
    }
    
    .message-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }
`;
document.head.appendChild(toastStyles);
