# 🌿 Yuma — Plataforma Digital del Parque

Aplicación web Full-Stack desarrollada para digitalizar y centralizar diferentes servicios y experiencias ofrecidos dentro del parque Yuma.

El proyecto busca crear una experiencia digital sencilla para los visitantes y, progresivamente, proporcionar herramientas de administración y operación para el personal del parque.

---

## 📌 Estado del proyecto

> 🚧 Proyecto actualmente en desarrollo.

La aplicación se encuentra en una fase funcional de construcción y validación de los principales ciclos de negocio.

Actualmente ya se han desarrollado módulos relacionados con:

- Autenticación de usuarios
- Gestión de mesas
- Menú del restaurante
- Carrito de productos
- Pedidos
- Consumo por usuario
- Pagos simulados
- Facturación
- Compra de tickets
- Sistema de puntos
- Dashboard de contenido

El proyecto continúa evolucionando hacia una plataforma completa de gestión del parque.

---

# 🎯 Objetivo

Yuma busca reunir diferentes servicios del parque dentro de una única aplicación.

La plataforma está diseñada para permitir que un visitante pueda gestionar gran parte de su experiencia desde su dispositivo móvil.

Entre los objetivos del sistema se encuentran:

- Reducir procesos manuales.
- Mejorar la experiencia del visitante.
- Facilitar pedidos dentro del restaurante.
- Digitalizar la compra de entradas.
- Gestionar mesas y consumos.
- Permitir pagos individuales o grupales.
- Generar historial de operaciones.
- Implementar fidelización mediante puntos.
- Centralizar información, promociones y servicios.
- Proporcionar herramientas administrativas al parque.

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura separada entre frontend y backend.

## Frontend

Construido con:

- Next.js
- React
- TypeScript
- App Router
- CSS Modules
- Context API
- Custom Hooks

Responsable de:

- Interfaz de usuario
- Navegación
- Estado de la aplicación
- Carrito
- Autenticación del lado cliente
- Consumo de API
- Experiencia responsive

---

## Backend

Construido con:

- Node.js
- Express
- JavaScript ES Modules
- JWT
- bcrypt

Responsable de:

- Autenticación
- Autorización
- Reglas de negocio
- Validaciones
- Gestión de mesas
- Gestión de pedidos
- Tickets
- Facturación
- Puntos
- Contenido
- Persistencia temporal

---

# 🔐 Autenticación

La aplicación utiliza autenticación basada en JWT.

Flujo general:

Usuario
→ Registro / Login
→ Backend valida credenciales
→ JWT
→ Sesión autenticada
→ Acceso a rutas protegidas

Las contraseñas se almacenan utilizando hashing mediante bcrypt.

Las operaciones protegidas identifican al usuario desde el token de autenticación.

---

# 🍽️ Sistema de restaurante

Uno de los módulos principales de la plataforma es el sistema digital del restaurante.

El flujo desarrollado contempla:

Cliente
→ Selecciona mesa
→ Entra a la mesa
→ Consulta menú
→ Selecciona productos
→ Configura cantidades
→ Agrega observaciones
→ Carrito
→ Confirma pedido
→ Pedido asociado al usuario
→ Consumo de la mesa
→ Pago
→ Factura

---

## 👥 Mesas multiusuario

Una mesa puede contener varios usuarios simultáneamente.

Cada pedido registra quién realizó el consumo.

Esto permite distinguir entre:

- Consumo individual
- Consumo total de la mesa

La arquitectura permite que diferentes personas compartan una mesa manteniendo sus pedidos identificados individualmente.

---

# 🛒 Carrito

La aplicación cuenta con un sistema de carrito mediante React Context.

Actualmente permite:

- Agregar productos
- Seleccionar cantidades
- Agregar observaciones
- Aumentar cantidades
- Disminuir cantidades
- Eliminar productos
- Vaciar carrito
- Calcular número de productos
- Calcular total

Antes de convertirse en un pedido, el carrito es validado nuevamente por el backend.

---

# 🍔 Menú

El restaurante cuenta con un sistema de productos organizado por categorías.

Cada producto puede contener:

- ID
- Categoría
- Nombre
- Descripción
- Precio
- Imagen
- Disponibilidad

El frontend utiliza el identificador del producto para realizar operaciones.

El precio final es validado por el backend antes de registrar pedidos.

---

# 📦 Pedidos

Los pedidos se almacenan asociados a:

- Mesa
- Usuario
- Producto
- Cantidad
- Precio
- Total
- Observaciones
- Fecha

Esto permite separar los consumos de diferentes personas dentro de una misma mesa.

---

# 💳 Sistema de pagos

Actualmente el proyecto utiliza pagos simulados durante la etapa de desarrollo.

Existen dos modalidades:

### 👤 Pago individual

El usuario paga únicamente los pedidos asociados a su cuenta.

### 👥 Pago de mesa

Un usuario puede pagar todos los pedidos pendientes de la mesa.

El cálculo final se realiza en el backend.

Después de completar el pago, únicamente se eliminan de la mesa los pedidos incluidos en la operación.

La arquitectura está preparada para integrar posteriormente una pasarela de pagos real.

---

# 🧾 Facturación

Cada pago genera una factura.

Las facturas pueden contener:

- ID
- Usuario
- Mesa
- Tipo de pago
- Pedidos
- Total
- Estado
- Fecha

Cada usuario puede consultar únicamente sus propias facturas desde las rutas destinadas al cliente.

---

# 🎟️ Tickets

La aplicación incluye un módulo de compra y gestión de entradas.

Actualmente contempla diferentes tipos de entrada y generación de tickets asociados al usuario.

La compra de entradas también está conectada con el sistema de fidelización.

---

# ⭐ Sistema de puntos

Yuma incorpora un sistema de puntos pensado para fidelizar visitantes.

Los usuarios pueden acumular puntos mediante determinadas operaciones dentro de la plataforma.

El sistema contempla niveles progresivos como:

- Bronce
- Plata
- Oro
- Diamante

En futuras fases estos puntos podrán utilizarse para beneficios, promociones o recompensas.

---

# 📰 Contenido del parque

La aplicación dispone de una arquitectura de contenido para mostrar información dinámica relacionada con el parque.

Entre los contenidos contemplados se encuentran:

- Banners
- Servicios
- Promociones
- Noticias
- Eventos
- Recorridos
- Restaurante

Esto permitirá que la aplicación funcione también como plataforma informativa para visitantes.

---

# 📱 Diseño responsive

La aplicación está siendo desarrollada bajo un enfoque orientado principalmente a dispositivos móviles.

El objetivo es proporcionar una experiencia cómoda desde:

- Smartphones
- Tablets
- Computadores

La interfaz continuará evolucionando durante la fase final de UX/UI.

---

# 🗂️ Estructura general

```text
parque-app/

├── app/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── mesas/
│   ├── tickets/
│   ├── puntos/
│   ├── dashboard/
│   └── auth/
│
├── services/
│
├── types/
│
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── data/
│   ├── content/
│   └── index.js
│
└── README.md