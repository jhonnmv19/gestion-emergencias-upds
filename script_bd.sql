-- =====================================================
-- 1. BASE DE DATOS (en Supabase no se crea con SQL)
-- Se selecciona automáticamente en el proyecto
-- =====================================================

-- =====================================================
-- 2. TIPOS ENUM (PostgreSQL)
-- =====================================================

CREATE TYPE tipo_espacio_enum AS ENUM (
    'Aula',
    'Laboratorio',
    'Oficina',
    'Área Común',
    'Otro'
);

CREATE TYPE tipo_emergencia_enum AS ENUM (
    'Incendio',
    'Corte de Energía',
    'Accidente',
    'Inundación',
    'Seguridad',
    'Otro'
);

CREATE TYPE estado_incidente_enum AS ENUM (
    'Pendiente',
    'En proceso',
    'Resuelto'
);

-- =====================================================
-- 3. ROLES
-- =====================================================
CREATE TABLE roles_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 4. USUARIOS
-- =====================================================
CREATE TABLE usuarios_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_rol
        FOREIGN KEY (rol_id)
        REFERENCES roles_upds(id)
        ON DELETE RESTRICT
);

-- =====================================================
-- 5. SECTORES
-- =====================================================
CREATE TABLE sectores_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

-- =====================================================
-- 6. PISOS
-- =====================================================
CREATE TABLE pisos_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    sector_id BIGINT NOT NULL,
    nombre VARCHAR(50) NOT NULL,

    CONSTRAINT fk_sector
        FOREIGN KEY (sector_id)
        REFERENCES sectores_upds(id)
        ON DELETE CASCADE
);

-- =====================================================
-- 7. ESPACIOS
-- =====================================================
CREATE TABLE espacios_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    piso_id BIGINT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo_espacio tipo_espacio_enum DEFAULT 'Aula',

    CONSTRAINT fk_piso
        FOREIGN KEY (piso_id)
        REFERENCES pisos_upds(id)
        ON DELETE CASCADE
);

-- =====================================================
-- 8. INCIDENTES
-- =====================================================
CREATE TABLE incidentes_upds (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,

    tipo_emergencia tipo_emergencia_enum NOT NULL,

    espacio_id BIGINT NOT NULL,

    estado estado_incidente_enum DEFAULT 'Pendiente',

    fecha_hora TIMESTAMP DEFAULT NOW(),

    usuario_id BIGINT NOT NULL,

    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT fk_espacio
        FOREIGN KEY (espacio_id)
        REFERENCES espacios_upds(id),

    CONSTRAINT fk_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios_upds(id)
);