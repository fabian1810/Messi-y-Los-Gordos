# 🍽️ Sistema de Reservas - Restaurante

Un sistema web completo para gestionar reservas de restaurante con una interfaz moderna y funcional.

## ✨ Características

- **Formulario de Reserva Completo**: Incluye todos los campos necesarios (nombre, fecha, hora, número de personas, selección de mesa)
- **Validaciones Inteligentes**: Verifica fechas pasadas, horarios válidos y disponibilidad de mesas
- **Interfaz Moderna**: Diseño responsivo con gradientes y animaciones suaves
- **Almacenamiento Local**: Las reservas se guardan en el navegador usando localStorage
- **Gestión de Reservas**: Ver, eliminar y organizar reservas por fecha y hora
- **Mensajes de Feedback**: Notificaciones claras para confirmaciones y errores
- **Diseño Responsivo**: Funciona perfectamente en dispositivos móviles y de escritorio

## 🚀 Cómo Usar

1. **Abrir el archivo `index.html`** en tu navegador web
2. **Completar el formulario** con los datos de la reserva:
   - Nombre del cliente
   - Fecha (mínimo hoy)
   - Hora (entre 8:00 AM y 10:00 PM)
   - Número de personas (1-10)
   - Selección de mesa
3. **Hacer clic en "Reservar"** para confirmar la reserva
4. **Ver las reservas** en la sección inferior de la página
5. **Eliminar reservas** usando el botón "Eliminar Reserva" en cada tarjeta

## 📁 Estructura del Proyecto

```
Restaurante/
├── index.html          # Estructura HTML principal
├── styles.css          # Estilos CSS modernos
├── script.js           # Funcionalidad JavaScript
└── README.md           # Documentación del proyecto
```

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y formularios
- **CSS3**: Estilos modernos con Grid, Flexbox y animaciones
- **JavaScript ES6+**: Programación orientada a objetos y manipulación del DOM
- **localStorage**: Persistencia de datos en el navegador

## 🎨 Características del Diseño

- **Gradiente de fondo**: Colores modernos y atractivos
- **Tarjetas con sombras**: Efecto de profundidad y elegancia
- **Animaciones suaves**: Transiciones y efectos hover
- **Tipografía clara**: Fuentes legibles y jerarquía visual
- **Colores consistentes**: Paleta de colores coherente

## ⚡ Funcionalidades JavaScript

### Clase ReservationManager
- **Gestión completa de reservas**: Crear, validar, eliminar y mostrar
- **Validaciones robustas**: Fechas, horarios y disponibilidad de mesas
- **Formateo de datos**: Fechas y horas en formato legible
- **Persistencia de datos**: Guardado automático en localStorage

### Validaciones Implementadas
- ✅ No se permiten fechas pasadas
- ✅ Horario de reservas: 8:00 AM - 10:00 PM
- ✅ Verificación de disponibilidad de mesa
- ✅ Validación de número de personas (1-10)
- ✅ Campos obligatorios completados

## 📱 Responsive Design

El sistema se adapta perfectamente a diferentes tamaños de pantalla:

- **Desktop**: Layout de dos columnas para formulario y mensajes
- **Tablet**: Ajuste automático de espaciado y tamaños
- **Mobile**: Layout de una columna optimizado para touch

## 🔧 Funciones Adicionales

### Para Desarrolladores
```javascript
// Limpiar todas las reservas (útil para testing)
clearAllReservations();

// Acceder al manager de reservas
window.reservationManager;
```

## 🎯 Próximas Mejoras

- [ ] Exportar reservas a PDF
- [ ] Calendario visual de disponibilidad
- [ ] Sistema de notificaciones por email
- [ ] Integración con base de datos
- [ ] Panel de administración
- [ ] Estadísticas de reservas

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

---

**¡Disfruta gestionando las reservas de tu restaurante!** 🍽️✨
