-- ====================================================================
-- ESQUEMA DE BASE DE DATOS EMPRESARIAL: SOLUCIONES DE NEGOCIO
-- Soporte Multi-Tenant: Tueste (DTC), Agendo (SaaS), Sol de Casa (Lead Gen)
-- Compatible con: PostgreSQL 14+, Supabase, Neon, AWS RDS, MySQL 8.0+
-- ====================================================================

CREATE TABLE IF NOT EXISTS empresas (
    id VARCHAR(32) PRIMARY KEY,
    nombre VARCHAR(128) NOT NULL,
    modelo_negocio VARCHAR(64) NOT NULL, -- DTC_ECOMMERCE, B2B_SAAS, HIGH_TICKET_SERVICES
    moneda VARCHAR(8) DEFAULT 'USD',
    caja_inicial NUMERIC(12, 2) NOT NULL,
    piso_seguridad NUMERIC(12, 2) NOT NULL,
    costos_fijos_mensuales NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserción de empresas base
INSERT INTO empresas (id, nombre, modelo_negocio, caja_inicial, piso_seguridad, costos_fijos_mensuales)
VALUES 
    ('tueste', 'Tueste Café de Especialidad', 'DTC_ECOMMERCE', 35000.00, 5000.00, 6500.00),
    ('agendo', 'Agendo SaaS Barberías', 'B2B_SAAS', 60000.00, 10000.00, 14000.00),
    ('soldecasa', 'Sol de Casa Paneles Solares', 'HIGH_TICKET_SERVICES', 12000.00, 5000.00, 18000.00)
ON CONFLICT (id) DO NOTHING;

-- Registro de Inversión y Métricas de Canales de Adquisición
CREATE TABLE IF NOT EXISTS campanas_marketing (
    id SERIAL PRIMARY KEY,
    empresa_id VARCHAR(32) REFERENCES empresas(id),
    canal VARCHAR(64) NOT NULL, -- META_ADS, GOOGLE_ADS, ORGANIC
    mes_periodo DATE NOT NULL,
    inversion_pauta NUMERIC(12, 2) DEFAULT 0.00,
    fee_agencia NUMERIC(12, 2) DEFAULT 0.00,
    clics INTEGER DEFAULT 0,
    impresiones INTEGER DEFAULT 0,
    leads_o_trials INTEGER DEFAULT 0,
    cpl_promedio NUMERIC(10, 2),
    clientes_adquiridos_reales INTEGER DEFAULT 0,
    cac_real_calculado NUMERIC(10, 2),
    roas_reportado_plataforma NUMERIC(8, 2),
    roas_real_primer_pedido NUMERIC(8, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Directorio Unificado de Clientes y Cohortes
CREATE TABLE IF NOT EXISTS clientes (
    id SERIAL PRIMARY KEY,
    empresa_id VARCHAR(32) REFERENCES empresas(id),
    cliente_uid VARCHAR(64) UNIQUE NOT NULL,
    nombre_contacto VARCHAR(128),
    canal_origen VARCHAR(64) NOT NULL,
    fecha_captacion DATE NOT NULL,
    mes_cohorte VARCHAR(7) NOT NULL, -- YYYY-MM
    tipo_plan VARCHAR(64), -- MENSUAL, ANUAL, SUELTO, SUSCRIPCION_CAFE, INSTALACION_SOLAR
    estado_cliente VARCHAR(32) DEFAULT 'ACTIVO', -- ACTIVO, CANCELADO, EN_MORA
    fecha_cancelacion DATE,
    es_propietario_casa BOOLEAN DEFAULT NULL, -- Sol de Casa
    gasto_luz_mensual NUMERIC(10, 2) DEFAULT NULL, -- Sol de Casa
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Transacciones y Flujos de Facturación
CREATE TABLE IF NOT EXISTS transacciones_ingresos (
    id SERIAL PRIMARY KEY,
    empresa_id VARCHAR(32) REFERENCES empresas(id),
    cliente_id INTEGER REFERENCES clientes(id),
    fecha_transaccion DATE NOT NULL,
    monto_bruto NUMERIC(12, 2) NOT NULL,
    monto_costo_directo NUMERIC(12, 2) NOT NULL,
    monto_margen_contribucion NUMERIC(12, 2) NOT NULL,
    numero_pedido_o_hito INTEGER DEFAULT 1, -- 1=Firma/1er pedido, 2=Instalación/Recompra
    estado_pago VARCHAR(32) DEFAULT 'COBRADO',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Capacidad Operativa (Técnicos y Vendedoras)
CREATE TABLE IF NOT EXISTS capacidad_operativa (
    id SERIAL PRIMARY KEY,
    empresa_id VARCHAR(32) REFERENCES empresas(id),
    mes_periodo DATE NOT NULL,
    personal_operativo_activo INTEGER NOT NULL, -- técnicos o vendedoras
    capacidad_total_eventos INTEGER NOT NULL, -- visitas o trials
    eventos_solicitados INTEGER NOT NULL,
    eventos_ejecutados INTEGER NOT NULL,
    tasa_utilizacion_capacidad NUMERIC(5, 2) NOT NULL,
    cuello_botella_detectado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Libro Mayor de Flujo de Tesorería Mensual (Ledger de Caja)
CREATE TABLE IF NOT EXISTS balance_caja_mensual (
    id SERIAL PRIMARY KEY,
    empresa_id VARCHAR(32) REFERENCES empresas(id),
    mes_numero INTEGER NOT NULL,
    mes_periodo DATE NOT NULL,
    entradas_efectivo NUMERIC(12, 2) NOT NULL,
    salidas_operativas NUMERIC(12, 2) NOT NULL,
    salidas_marketing NUMERIC(12, 2) NOT NULL,
    salidas_costos_fijos NUMERIC(12, 2) NOT NULL,
    flujo_neto_mes NUMERIC(12, 2) NOT NULL,
    saldo_caja_final NUMERIC(12, 2) NOT NULL,
    alerta_piso_seguridad BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(empresa_id, mes_numero)
);

-- VISTA ANALÍTICA EJECUTIVA: Unit Economics Comparados
CREATE OR REPLACE VIEW v_resumen_unit_economics AS
SELECT 
    e.nombre AS empresa,
    e.modelo_negocio,
    COALESCE(SUM(cm.inversion_pauta + cm.fee_agencia), 0) AS gasto_adquisicion_total,
    COALESCE(SUM(cm.clientes_adquiridos_reales), 0) AS clientes_totales,
    CASE 
        WHEN SUM(cm.clientes_adquiridos_reales) > 0 
        THEN ROUND(SUM(cm.inversion_pauta + cm.fee_agencia) / SUM(cm.clientes_adquiridos_reales), 2)
        ELSE 0 
    END AS cac_real_ponderado
FROM empresas e
LEFT JOIN campanas_marketing cm ON e.id = cm.empresa_id
GROUP BY e.id, e.nombre, e.modelo_negocio;
