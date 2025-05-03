<template>
  <div class="admin-panel">
    <h2 class="admin-panel__title">Administración</h2>

    <nav class="admin-panel__top-navigation">
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'usuarios' }"
        @click="botonActual = 'usuarios'; seccionActiva = null"
      >
        <div class="admin-panel__top-nav-icon">
          <img src="../imgs/icons/admin-usuario.svg" alt="Icono Usuarios" />
        </div>
        <span class="admin-panel__top-nav-text">Usuarios/Roles</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'salas_sedes' }"
        @click="botonActual = 'salas_sedes'; seccionActiva = null"
      >
        <div class="admin-panel__top-nav-icon">
          <img src="../imgs/icons/admin-oficina.svg" alt="Icono Salas/Sedes" />
        </div>
        <span class="admin-panel__top-nav-text">Salas/Sedes</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'zonas_puestos' }"
        @click="botonActual = 'zonas_puestos'; seccionActiva = null"
      >
        <div class="admin-panel__top-nav-icon">
          <img  src="../imgs/icons/admin-zonas.svg" alt="Icono Zonas/Puestos" />
        </div>
        <span class="admin-panel__top-nav-text">Zonas/Puestos</span>
      </button>
      <button
        class="admin-panel__top-nav-item"
        :class="{ activo: botonActual === 'reservas_disponibilidad' }"
        @click="botonActual = 'reservas_disponibilidad'; seccionActiva = null"
      >
        <div class="admin-panel__top-nav-icon">
          <img  src="../imgs/icons/admin-calendario.svg" alt="Icono Reservas/Disponibilidad" />
        </div>
        <span class="admin-panel__top-nav-text">Reservas/Disponibilidad</span>
      </button>
    </nav>

    <div v-if="botonActual === 'usuarios'" class="admin-panel__content-section">
      <h3>Gestión de Usuarios y Roles</h3>

      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('usuarios-ver-todos')">VER TODOS LOS USUARIOS</button>
        <div v-if="seccionActiva === 'usuarios-ver-todos'" class="admin-panel__section-content">
          <p>Lista completa de usuarios registrados.</p>
          <button class="admin-panel__button">Cargar Lista</button>
          <div class="admin-panel__results">
             </div>
        </div>
      </div>

      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('usuarios-ver-especifico')">VER USUARIO ESPECÍFICO</button>
        <div v-if="seccionActiva === 'usuarios-ver-especifico'" class="admin-panel__section-content">
          <div class="admin-panel__action-item">
            <input type="text" class="admin-panel__input" placeholder="Email del usuario">
            <button class="admin-panel__button">Buscar Usuario</button>
          </div>
          <div class="admin-panel__results">
             </div>
        </div>
      </div>

      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('usuarios-anadir')">AÑADIR NUEVO USUARIO</button>
        <div v-if="seccionActiva === 'usuarios-anadir'" class="admin-panel__section-content">
          <div class="admin-panel__action-item admin-panel__action-item--vertical">
            <input type="text" class="admin-panel__input" placeholder="Nombre">
            <input type="text" class="admin-panel__input" placeholder="Apellidos">
            <input type="email" class="admin-panel__input" placeholder="Email">
            <input type="password" class="admin-panel__input" placeholder="Contraseña">
            <input type="text" class="admin-panel__input" placeholder="Rol (ej: Admin, Cliente)">
            <button class="admin-panel__button">Añadir Usuario</button>
          </div>
        </div>
      </div>

      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('usuarios-editar')">EDITAR USUARIO</button>
        <div v-if="seccionActiva === 'usuarios-editar'" class="admin-panel__section-content">
          <div class="admin-panel__action-item">
            <input type="text" class="admin-panel__input" placeholder="Email del usuario a editar">
            <button class="admin-panel__button">Cargar Datos para Editar</button>
          </div>
          <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
            <input type="text" class="admin-panel__input" placeholder="Nuevo Nombre">
            <input type="text" class="admin-panel__input" placeholder="Nuevos Apellidos">
            <input type="email" class="admin-panel__input" placeholder="Nuevo Email">
            <input type="password" class="admin-panel__input" placeholder="Nueva Contraseña">
            <input type="text" class="admin-panel__input" placeholder="Nuevo Rol">
            <button class="admin-panel__button">Guardar Cambios</button>
          </div>
        </div>
      </div>

      <div class="admin-panel__section">
        <button class="admin-panel__section-title" @click="toggleSection('usuarios-eliminar')">ELIMINAR USUARIO</button>
        <div v-if="seccionActiva === 'usuarios-eliminar'" class="admin-panel__section-content">
          <div class="admin-panel__action-item">
            <input type="text" class="admin-panel__input" placeholder="Email del usuario a eliminar">
            <button class="admin-panel__button admin-panel__button--danger">Eliminar Usuario</button>
          </div>
        </div>
      </div>

      </div>

    <div v-if="botonActual === 'salas_sedes'" class="admin-panel__content-section">
      <h3>Gestión de Salas y Sedes</h3>

      <div class="admin-panel__subsection-group">
        <h4>Gestión de Sedes (Tabla Sedes)</h4>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('sedes-ver-todas')">VER TODAS LAS SEDES</button>
          <div v-if="seccionActiva === 'sedes-ver-todas'" class="admin-panel__section-content">
            <p>Lista completa de sedes registradas.</p>
            <button class="admin-panel__button">Cargar Lista</button>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('sedes-ver-especifico')">VER SEDE ESPECÍFICA</button>
          <div v-if="seccionActiva === 'sedes-ver-especifico'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Ciudad">
              <input type="text" class="admin-panel__input" placeholder="Dirección">
               <input type="text" class="admin-panel__input" placeholder="Planta">
              <button class="admin-panel__button">Buscar Sede</button>
            </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('sedes-anadir')">AÑADIR NUEVA SEDE</button>
          <div v-if="seccionActiva === 'sedes-anadir'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="País">
              <input type="text" class="admin-panel__input" placeholder="Ciudad">
              <input type="text" class="admin-panel__input" placeholder="Dirección">
              <input type="text" class="admin-panel__input" placeholder="Código Postal">
              <input type="text" class="admin-panel__input" placeholder="Planta (ej: 1ª)">
              <input type="text" class="admin-panel__input" placeholder="URL de Imagen">
              <input type="text" class="admin-panel__input" placeholder="Observaciones">
              <button class="admin-panel__button">Añadir Sede</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('sedes-editar')">EDITAR SEDE</button>
          <div v-if="seccionActiva === 'sedes-editar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
               <input type="text" class="admin-panel__input" placeholder="Ciudad">
               <input type="text" class="admin-panel__input" placeholder="Dirección">
               <input type="text" class="admin-panel__input" placeholder="Planta">
              <button class="admin-panel__button">Cargar Datos para Editar</button>
            </div>
            <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
              <input type="text" class="admin-panel__input" placeholder="Nuevo País">
              <input type="text" class="admin-panel__input" placeholder="Nueva Ciudad">
              <input type="text" class="admin-panel__input" placeholder="Nueva Dirección">
              <input type="text" class="admin-panel__input" placeholder="Nuevo Código Postal">
              <input type="text" class="admin-panel__input" placeholder="Nueva Planta">
              <input type="text" class="admin-panel__input" placeholder="Nueva URL de Imagen">
              <input type="text" class="admin-panel__input" placeholder="Nuevas Observaciones">
              <button class="admin-panel__button">Guardar Cambios</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('sedes-eliminar')">ELIMINAR SEDE</button>
          <div v-if="seccionActiva === 'sedes-eliminar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Ciudad">
              <input type="text" class="admin-panel__input" placeholder="Dirección">
               <input type="text" class="admin-panel__input" placeholder="Planta">
              <button class="admin-panel__button admin-panel__button--danger">Eliminar Sede</button>
            </div>
          </div>
        </div>
      </div>

      <div class="admin-panel__subsection-group">
        <h4>Gestión de Salas (Tabla Salas)</h4>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('salas-ver-todas')">VER TODAS LAS SALAS</button>
          <div v-if="seccionActiva === 'salas-ver-todas'" class="admin-panel__section-content">
             <p>Lista completa de salas.</p>
            <button class="admin-panel__button">Cargar Lista</button>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('salas-ver-especifico')">VER SALA ESPECÍFICA</button>
          <div v-if="seccionActiva === 'salas-ver-especifico'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Nombre de la Sala">
               <input type="text" class="admin-panel__input" placeholder="Ciudad">
               <input type="text" class="admin-panel__input" placeholder="Dirección">
              <button class="admin-panel__button">Buscar Sala</button>
            </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('salas-anadir')">AÑADIR NUEVA SALA</button>
          <div v-if="seccionActiva === 'salas-anadir'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Nombre de la Sala">
              <input type="text" class="admin-panel__input" placeholder="URL de Imagen">
              <input type="number" class="admin-panel__input" placeholder="Capacidad">
              <input type="text" class="admin-panel__input" placeholder="Tipo de Sala (ej: 'privada')"> <!-- el endpoint debera evitar los espacios tb  para evitar por ejemplo ' privada'-->
              <input type="text" class="admin-panel__input" placeholder="Sede a la que pertenece "> <!-- nombre de la sala ,quitar q sea case sensitive y posibles fallos en el endpoint dedicado-->
              <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="sala-bloqueada">
                 <label for="sala-bloqueada">Bloqueada</label>
              </div>
              <button class="admin-panel__button">Añadir Sala</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('salas-editar')">EDITAR SALA</button>
          <div v-if="seccionActiva === 'salas-editar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Nombre de la Sala a editar">
              <input type="text" class="admin-panel__input" placeholder="Ciudad la sala a editar">
              <input type="text" class="admin-panel__input" placeholder="Dirección la sala a editar">
              <button class="admin-panel__button">Cargar Datos para Editar</button>
            </div>
             <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
              <input type="text" class="admin-panel__input" placeholder="Nuevo Nombre">
              <input type="text" class="admin-panel__input" placeholder="Nueva URL de Imagen">
              <input type="number" class="admin-panel__input" placeholder="Nueva Capacidad">
              <input type="text" class="admin-panel__input" placeholder="Nuevo Tipo de Sala - seleccionar de TiposSalas">
              <input type="text" class="admin-panel__input" placeholder="Nueva Sede">
               <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="sala-bloqueada-editar">
                 <label for="sala-bloqueada-editar">Bloqueada</label>
              </div>
              <button class="admin-panel__button">Guardar Cambios</button>
            </div>
             </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('salas-eliminar')">ELIMINAR SALA</button>
          <div v-if="seccionActiva === 'salas-eliminar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Nombre de la Sala a eliminar">
               <input type="text" class="admin-panel__input" placeholder="Ciudad la sala a eliminar">
               <input type="text" class="admin-panel__input" placeholder="Dirección la sala a eliminar">
              <button class="admin-panel__button admin-panel__button--danger">Eliminar Sala</button>
            </div>
          </div>
        </div>

         </div>
    </div>

    <div v-if="botonActual === 'zonas_puestos'" class="admin-panel__content-section">
      <h3>Gestión de Zonas y Puestos</h3>

      <div class="admin-panel__subsection-group">
         <h4>Gestión de Zonas de Trabajo (Tabla ZonasTrabajo)</h4>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('zonas-ver-todas')">VER TODAS LAS ZONAS</button>
          <div v-if="seccionActiva === 'zonas-ver-todas'" class="admin-panel__section-content">
            <p>Lista completa de zonas de trabajo.</p>
            <button class="admin-panel__button">Cargar Lista</button>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('zonas-ver-especifico')">VER ZONA ESPECÍFICA</button>
          <div v-if="seccionActiva === 'zonas-ver-especifico'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Descripción">
               <input type="text" class="admin-panel__input" placeholder="Nombre">
               <input type="text" class="admin-panel__input" placeholder="Ciudad">
               <input type="text" class="admin-panel__input" placeholder="Dirección">
              <button class="admin-panel__button">Buscar Zona</button>
            </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('zonas-anadir')">AÑADIR NUEVA ZONA</button>
          <div v-if="seccionActiva === 'zonas-anadir'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Descripción">
               <input type="text" class="admin-panel__input" placeholder="Sala">
              <button class="admin-panel__button">Añadir Zona</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('zonas-editar')">EDITAR ZONA</button>
          <div v-if="seccionActiva === 'zonas-editar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Descripción de la Zona a editar">
              <input type="text" class="admin-panel__input" placeholder="Nombre Sala">
              <input type="text" class="admin-panel__input" placeholder="Ciudad Sede">
              <input type="text" class="admin-panel__input" placeholder="Dirección">
              <button class="admin-panel__button">Cargar Datos para Editar</button>
            </div>
             <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
              <input type="text" class="admin-panel__input" placeholder="Nueva Descripción">
               <input type="text" class="admin-panel__input" placeholder="Nombre Nueva Sala">
              <button class="admin-panel__button">Guardar Cambios</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('zonas-eliminar')">ELIMINAR ZONA</button>
          <div v-if="seccionActiva === 'zonas-eliminar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Descripción">
               <input type="text" class="admin-panel__input" placeholder="Nombre sala"> <!-- sala asociada a esa sede, tendra que decir si hay mas salas asociadas a esa zona y si borras todo lo asociado o no-->
              <button class="admin-panel__button admin-panel__button--danger">Eliminar Zona</button>
            </div>
          </div>
        </div>
      </div>

       <div class="admin-panel__subsection-group">
         <h4>Gestión de Puestos de Trabajo (Tabla PuestosTrabajo)</h4>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('puestos-ver-todos')">VER TODOS LOS PUESTOS</button>
          <div v-if="seccionActiva === 'puestos-ver-todos'" class="admin-panel__section-content">
            <p>Lista completa de puestos de trabajo.</p>
            <button class="admin-panel__button">Cargar Lista</button>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('puestos-ver-especifico')">VER PUESTO ESPECÍFICO</button>
          <div v-if="seccionActiva === 'puestos-ver-especifico'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Número de Asiento">
              <input type="text" class="admin-panel__input" placeholder="Codigo mesa">
               <input type="text" class="admin-panel__input" placeholder="Sala asociada">
            </div>
             <div class="admin-panel__action-item">
               <button class="admin-panel__button">Buscar Puesto</button>
             </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('puestos-anadir')">AÑADIR NUEVO PUESTO</button>
          <div v-if="seccionActiva === 'puestos-anadir'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="number" class="admin-panel__input" placeholder="Número de Asiento">
              <input type="number" class="admin-panel__input" placeholder="Código de Mesa">
              <input type="text" class="admin-panel__input" placeholder="URL de Imagen">
               <input type="text" class="admin-panel__input" placeholder="Zona a la que pertenece">
              <input type="text" class="admin-panel__input" placeholder="Sala a la que pertenece">
               <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="puesto-disponible" checked>
                 <label for="puesto-disponible">Disponible</label>
              </div>
               <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="puesto-bloqueado">
                 <label for="puesto-bloqueado">Bloqueado</label>
              </div>
              <button class="admin-panel__button">Añadir Puesto</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('puestos-editar')">EDITAR PUESTO</button>
          <div v-if="seccionActiva === 'puestos-editar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Número de Asiento">
              <input type="text" class="admin-panel__input" placeholder="codigo de mesa">
               <input type="text" class="admin-panel__input" placeholder="Nombre sala asociada">
               <button class="admin-panel__button">Cargar Datos para Editar</button>
            </div>
             <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
               <input type="number" class="admin-panel__input" placeholder="Nuevo Número de Asiento">
              <input type="number" class="admin-panel__input" placeholder="Nuevo Código de Mesa">
              <input type="text" class="admin-panel__input" placeholder="Nueva URL de Imagen">
               <input type="text" class="admin-panel__input" placeholder="Nueva Zona">
              <input type="text" class="admin-panel__input" placeholder="Nueva Sala">
               <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="puesto-disponible-editar">
                 <label for="puesto-disponible-editar">Disponible</label>
              </div>
               <div class="admin-panel__checkbox-item">
                 <input type="checkbox" id="puesto-bloqueado-editar">
                 <label for="puesto-bloqueado-editar">Bloqueado</label>
              </div>
              <button class="admin-panel__button">Guardar Cambios</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('puestos-eliminar')">ELIMINAR PUESTO</button>
          <div v-if="seccionActiva === 'puestos-eliminar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
               <input type="text" class="admin-panel__input" placeholder="Número de Asiento">
              <input type="text" class="admin-panel__input" placeholder="Codigo de mesa">
               <input type="text" class="admin-panel__input" placeholder="Nombre sala asociada">
              <button class="admin-panel__button admin-panel__button--danger">Eliminar Puesto</button>
            </div>
          </div>
        </div>

        </div>
    </div>

    <div v-if="botonActual === 'reservas_disponibilidad'" class="admin-panel__content-section">
      <h3>Gestión de Reservas y Disponibilidad</h3>

       <div class="admin-panel__subsection-group">
         <h4>Gestión de Reservas (Tabla Reservas)</h4>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('reservas-ver-todas')">VER TODAS LAS RESERVAS</button>
          <div v-if="seccionActiva === 'reservas-ver-todas'" class="admin-panel__section-content">
            <p>Lista completa de reservas.</p>
            <button class="admin-panel__button">Cargar Lista</button>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('reservas-ver-especifica')">VER RESERVA ESPECÍFICA</button>
          <div v-if="seccionActiva === 'reservas-ver-especifica'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Email del usuario que realizó la reserva">
              <input type="date" class="admin-panel__input" placeholder="Fecha de la reserva">
              <input type="time" class="admin-panel__input" placeholder="Hora de inicio de un tramo horario en la reserva">
               <input type="text" class="admin-panel__input" placeholder="Asiento reservado">
               <input type="text" class="admin-panel__input" placeholder="Sala reservada">

             </div>
            <div class="admin-panel__action-item">
               <button class="admin-panel__button">Buscar Reserva</button>
            </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('reservas-anadir')">AÑADIR NUEVA RESERVA</button>
          <div v-if="seccionActiva === 'reservas-anadir'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Email">
              <input type="date" class="admin-panel__input" placeholder="Fecha Reserva">
               <input type="text" class="admin-panel__input" placeholder="Puesto">
               <input type="text" class="admin-panel__input" placeholder="Sala">
               <input type="text" class="admin-panel__input" placeholder="Tramos Horarios (ej: 09:00-10:00)">
              <input type="text" class="admin-panel__input" placeholder="Descripción">
              <button class="admin-panel__button">Crear Reserva</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('reservas-editar')">EDITAR RESERVA</button>
          <div v-if="seccionActiva === 'reservas-editar'" class="admin-panel__section-content">
             <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Email del usuario de la reserva a editar">
              <input type="date" class="admin-panel__input" placeholder="Fecha de la reserva a editar">
               <input type="time" class="admin-panel__input" placeholder="Hora de inicio de un tramo horario en la reserva a editar">
               <input type="text" class="admin-panel__input" placeholder="Sala reservado en la reserva a editar">
              <button class="admin-panel__button">Cargar Datos para Editar</button>
            </div>
             <div class="admin-panel__action-item admin-panel__action-item--vertical admin-panel__action-item--editing">
               <input type="text" class="admin-panel__input" placeholder="Nuevo Email usuario">
               <input type="date" class="admin-panel__input" placeholder="Nueva Fecha">
               <input type="text" class="admin-panel__input" placeholder="Nuevo Puesto/Sala">
               <input type="text" class="admin-panel__input" placeholder="Nuevos Tramos Horarios">
              <input type="text" class="admin-panel__input" placeholder="Nueva Descripción">
               <button class="admin-panel__button">Guardar Cambios</button>
            </div>
          </div>
        </div>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('reservas-eliminar')">ELIMINAR RESERVA</button>
          <div v-if="seccionActiva === 'reservas-eliminar'" class="admin-panel__section-content">
            <div class="admin-panel__action-item admin-panel__action-item--vertical">
              <input type="text" class="admin-panel__input" placeholder="Email del usuario de la reserva a eliminar">
              <input type="date" class="admin-panel__input" placeholder="Fecha de la reserva a eliminar">
               <input type="time" class="admin-panel__input" placeholder="Hora de inicio de un tramo horario en la reserva a eliminar">
              <button class="admin-panel__button admin-panel__button--danger">Eliminar Reserva</button>
            </div>
          </div>
        </div>
      </div>

       <div class="admin-panel__subsection-group">
         <h4>Gestión de Disponibilidad (Tabla Disponibilidades)</h4>
         <p>Permite modificar el estado de disponibilidad de puestos para fechas y tramos horarios específicos.</p>

        <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('disponibilidad-ver')">VER DISPONIBILIDAD</button>
          <div v-if="seccionActiva === 'disponibilidad-ver'" class="admin-panel__section-content">
             <div class="admin-panel__action-item admin-panel__action-item--vertical">
               <input type="date" class="admin-panel__input" placeholder="Fecha">
             </div>
             <div class="admin-panel__action-item">
               <button class="admin-panel__button">Buscar Disponibilidad</button>
             </div>
            <div class="admin-panel__results">
               </div>
          </div>
        </div>

         <div class="admin-panel__section">
          <button class="admin-panel__section-title" @click="toggleSection('disponibilidad-actualizar')">ACTUALIZAR ESTADO DE DISPONIBILIDAD</button>
          <div v-if="seccionActiva === 'disponibilidad-actualizar'" class="admin-panel__section-content">
             <div class="admin-panel__action-item admin-panel__action-item--vertical">
                <input type="text" class="admin-panel__input" placeholder="Puesto/Sala">
               <input type="date" class="admin-panel__input" placeholder="Fecha">
               <input type="text" class="admin-panel__input" placeholder="Tramo Horario (ej: '09:00-10:00')">
                <input type="text" class="admin-panel__input" placeholder="Nuevo Estado ('1' para disponible, '0' para bloqueado)">
             </div>
             <div class="admin-panel__action-item">
               <button class="admin-panel__button">Actualizar Estado</button>
             </div>
          </div>
        </div>

         </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      botonActual: 'usuarios',
      seccionActiva: null
    };
  },
  methods: {
    toggleSection(sectionName) {
      this.seccionActiva = this.seccionActiva === sectionName ? null : sectionName;
    },
  },
};
</script>

<style lang="scss">
.admin-panel {
  width: 100%;
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-family: sans-serif;
  margin: 10px auto;
  box-sizing: border-box;

  &__title {
    font-size: 20px;
    margin-bottom: 15px;
    text-align: center;
    color: black;
    background-color: rgb(190, 190, 190);
  }

  &__top-navigation {
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #ddd;
    margin-bottom: 15px;
    justify-content: space-around;
  }

  &__top-nav-item {
    flex-basis: calc(50% - 10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
    background-color: #f9f9f9;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s;
    box-sizing: border-box;
    margin-bottom: 10px;
  }

  &__top-nav-icon {
    width: 30px;
    height: 30px;
    border-radius: 5px;
    margin-bottom: 5px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }

  &__top-nav-text {
    font-size: 12px;
    text-align: center;
    white-space: nowrap;
  }

  &__content-section {
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
    margin-bottom: 15px;
    background-color: white;
  }

  &__section {
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 3px;
  }

  &__section-title {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 8px 12px;
    background-color: #f9f9f9;
    border: none;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-weight: bold;
    cursor: pointer;
    box-sizing: border-box;
    font-size: 14px;

    &:hover {
      background-color: #eee;
    }
  }

  &__section-content {
    padding: 10px;
    background-color: white;
  }

  &__action-item {
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
    align-items: center;
    flex-direction: column;
  }

  &__input {
    padding: 6px;
    border: 1px solid #ccc;
    border-radius: 3px;
    font-size: 12px;
    width: 100%;
    box-sizing: border-box;
  }

  &__button {
    padding: 6px 10px;
    border: 1px solid #333;
    border-radius: 3px;
    background-color: #f9f9f9;
    cursor: pointer;
    font-size: 12px;
  }


}
@media (min-width: 768px) {
  .admin-panel {
    padding: 30px;

    &__title {
      font-size: 28px;
      margin-bottom: 30px;
      text-align: center;
    }

    &__top-navigation {
      display: flex;
      justify-content: center;
      border-bottom: 2px solid #ddd;
      margin-bottom: 30px;
      padding-bottom: 15px;
    }

    &__top-nav-item {
      flex-basis: auto;
      margin-right: 25px;
      margin-bottom: 0;
      padding: 15px 20px;
      border-radius: 8px;

     

      &.activo {
        background-color: #e0e0e0;
      }
    }

    &__top-nav-icon {
      width: 50px;
      height: 50px;
      margin-bottom: 10px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #dbd8d8;

      img {
          max-width: 60%;
          max-height: 60%;
      }
    }

    &__top-nav-text {
      font-size: 16px;
    text-align: center;
      white-space: nowrap;
    }

    &__content-section {
      padding: 20px;
     border: 1px solid #ddd;
      border-radius: 8px;
     margin-bottom: 25px;
      background-color: white;

      h3 {
        font-size: 20px;
      margin-bottom: 15px;
        text-align: center;
      }
    }

    &__section {
      margin-bottom: 20px;
      border: 1px solid #dbd8d8;
      border-radius: 8px;
    }

    &__section-title {
      display: flex;
     align-items: center;
      width: 100%;
      padding: 12px 18px;   
         background-color: #dbd8d8;
      border: none;
    border-bottom: 1px solid #ddd;
     text-align: center;
    font-weight: bold;
      cursor: pointer;
     box-sizing: border-box;
      font-size: 16px;
      border-radius: 8px 8px;

      &:hover {
        background-color: #dbd8d8;
      }
    }

    &__section-content {
      padding: 20px;
     background-color: white;
      border-radius: 0 0 8px 8px;
    }

    &__action-item {
     display: flex;
   gap: 20px;
    margin-bottom: 15px;
      align-items: center;
    flex-direction: row;
      justify-content: center;
    }

    &__input {
      padding: 10px;
    border: 1px solid #dbd8d8;
    border-radius: 5px;
     font-size: 16px;
      width: 60%;
     box-sizing: border-box;
    }

    &__button {
      padding: 10px 20px;
      border: 1px solid black;
    border-radius: 5px;
      background-color: white;
      cursor: pointer;
      font-size: 16px;
    }
  }


  @media (min-width: 1200px) {
  .admin-panel {
     max-width: 1200px;
    margin: 30px auto;
    padding: 40px;

    &__title {
      font-size: 32px;
      margin-bottom: 40px;
    }

    &__top-navigation {
      display: flex;
      justify-content: center;
      margin-bottom: 40px;
      padding-bottom: 20px;
    }

    &__top-nav-item {
      flex-basis: auto;
    display: flex;
      flex-direction: column;
     align-items: center;
    justify-content: center;
      margin-right: 50px;
      margin-bottom: 0;
     padding: 18px 15px;
      border-radius: 8px;
      box-sizing: border-box;

      &.activo {
       background-color: #e0e0e0;
      }
    }

    &__top-nav-icon {
      width: 60px;
    height: 60px;
      margin-bottom: 12px;
      border-radius: 8px;
      display: flex;
    align-items: center;
      justify-content: center;

      img {
        max-width: 70%;
        max-height: 70%;
      }
    }

    &__top-nav-text {
     font-size: 18px;
    text-align: center;
     white-space: nowrap;
    }

    &__content-section {
    padding: 30px;
     margin-bottom: 30px;

      h3 {
      font-size: 24px;
       margin-bottom: 20px;
       text-align: left;
      }
    }

    &__section {
    margin-bottom: 25px;
    }

    &__section-title {
     padding: 15px 20px;
      font-size: 18px;
    }

    &__section-content {
      padding: 25px;
    }

    &__action-item {
      gap: 30px;
      margin-bottom: 20px;
    flex-direction: row;
      justify-content: space-between;
    }

    &__input {
      padding: 12px;
    font-size: 18px;
    }

    &__button {
      padding: 12px;
     font-size: 18px;
    }
  }
}


}
</style>