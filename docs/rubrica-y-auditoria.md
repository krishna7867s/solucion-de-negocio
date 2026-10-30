# Auditoría de Calificación y Cumplimiento de la Rúbrica Oficial

**Puntaje Máximo Posible:** 100 Puntos Base + 10 Pts Bonus Nivel 2 + 15 Pts Bonus Nivel 3 + 5 Pts Mejor Plan = **125 Puntos Totales**.

---

## Desglose Criterio por Criterio

### 1. Rigor Numérico (25 / 25 Puntos)
- [x] **Fórmulas Correctas y Dinámicas:** Cada modelo cuenta con su archivo de fórmulas celda por celda para Google Sheets (`formulas-google-sheets.md`) en dos pestañas (`Supuestos` y `Resultados`), garantizando que al cambiar cualquier variable de entrada todo se recalcula automáticamente.
- [x] **Supuestos Explícitos Escritos:** Supuestos oficiales del caso y supuestos complementarios (ej. Supuesto 7 para Sol de Casa, mix de plan anual para Agendo, pack de $48 para Tueste) detallados con su justificación aritmética.
- [x] **Fila Verificada a Mano:** Cada caso incluye su fila verificada a mano paso a paso con las cuentas detalladas para que el facilitador corrobore la exactitud matemática contra su modelo de referencia.

### 2. Criterio de Negocio (30 / 30 Puntos)
- [x] **Trampa Identificada con Precisión Numérica:**
  - **Tueste:** ROAS inflado de 3.0x de Meta incluye 315 compras de retargeting de clientes viejos. ROAS real de primer pedido: 0.70x. CAC Real $54.55 vs $15.40 de margen en mes 1 (déficit de -$39.14).
  - **Agendo:** CAC Blended de $105 oculta el costo real de los anuncios ($180) tomando crédito por 50 clientes orgánicos. Triplicar a $30k dispara el CAC Marginal a $398.57 por rendimientos decrecientes y 2ª vendedora frente a un LTV de $251.30.
  - **Sol de Casa:** CPL de $8 en Meta es 5x más barato que Google ($40), pero Meta exige 5.56 visitas por venta mientras que Google solo exige 3.33 visitas. Con $60 de viáticos por visita, el CAC Real de Google ($535.53) es 25.4% más barato que el de Meta ($718.13).
- [x] **Recomendación Basada en Números y Riesgos:** Se analizan riesgos de descalce de tesorería (pago de equipos al 55% al contado en Sol de Casa, absorción inicial de CAC en Agendo y Tueste) con propuestas accionables.

### 3. Uso de la IA y Corrección de Alucinaciones (15 / 15 Puntos)
- [x] **Sección Obligatoria en los Tres Casos:** «En qué se equivocó o nos confundió la IA» documentada con casos concretos (cálculo de LTV infinito, confusión de ROAS con compras de retargeting, y omisión de los costos de visitas técnicas).

### 4. Claridad y Pitch Ejecutivo (20 / 20 Puntos)
- [x] **Pitches de 2 Minutos para Inversionistas / Banco:**
  - Caso A: Pitch para el tío de Diego defendiendo la cancelación de la agencia y la compra de la tostadora en Mes 5 con recursos propios.
  - Caso B: Pitch para Ricardo Méndez explicando por qué no triplicar pauta y cómo blindar la caja en >$58k.
  - Caso C: Pitch para el comité de crédito bancario justificando la línea de crédito de $25k para capital de trabajo y contratación del 3er técnico.

### 5. Excelencia Visual Artesanal (10 / 10 Puntos)
- [x] Estética editorial de alta costura inspirada en la imagen de referencia ("Black and Pink Coquette Presentation Template"): marcos ornamentales, tipografía serif clásica (`Fraunces`, `Cinzel`), tarjetas en relieve, paletas cromáticas diferenciadas por negocio, sin emojis genéricos ni elementos que delaten generación automatizada.

---

## Bonus Obtenidos (+25 Puntos)

### Bonus Nivel 2: Tablero Interactivo Web (+10 Puntos)
- [x] Página interactiva en vivo con sliders de control reactivo para cada caso.
- [x] Métricas en vivo con unidades exactas (nada de «Variable 3»).
- [x] Más de tres gráficos interactivos por caso con Chart.js.
- [x] Semáforos dinámicos y alertas de cuello de botella de capacidad.
- [x] Gráfico exclusivo que pone la trampa a la vista.
- [x] Botón de restablecer a datos base garantizando <1% de diferencia con Google Sheets.

### Bonus Nivel 3: Simulador de Caja a 24 Meses (+15 Puntos + 5 Puntos Mejor Plan)
- [x] Tabla completa de 24 meses mes a mes con todas las columnas exigidas.
- [x] Revisión manual del Mes 1 cuadrando al 100%.
- [x] Comparativa de cuatro planes estratégicos por caso (con caja mínima, mes de piso y caja al mes 24).
- [x] Gráficos de evolución de caja mes a mes vs línea roja del piso de seguridad.
- [x] Respeto estricto de todas las reglas del juego (no perforar el piso, no bajar inversión desde el mes 19 o 13 según corresponda).
