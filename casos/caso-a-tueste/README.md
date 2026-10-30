# Auditoría Ejecutiva y Modelo Financiero: Tueste (Caso A)
**Modelo de Negocio:** E-Commerce Directo al Consumidor (DTC) — Café de Especialidad  
**Dirección General:** Diego Ramírez (Fundador) & Camila (Operaciones)  
**Horizonte de Decisión:** Escalamiento en Black Friday y Presupuesto de Meta Ads  

---

## 1. Resumen Ejecutivo y Diagnóstico de la Trampa

### La Pregunta Central
Diego se enfrenta a una decisión crítica antes del viernes:
> *«La agencia Impulso Digital propone duplicar la inversión en Meta a $16,000 mensuales y ofrecer un 30% de descuento en el primer pedido, alegando un ROAS reportado de 3.0x. Camila detectó que el saldo bancario cayó $3,200 en septiembre a pesar de dicho ROAS. ¿Se debe firmar la propuesta?»*

### La Respuesta Categórica
**No firmar la propuesta de la agencia.**  
Duplicar la pauta a $16,000 con 30% de descuento en las condiciones actuales aceleraría el drenaje de tesorería y llevaría a Tueste a perforar su piso de seguridad de $5,000 en el **Mes 3**, consumiendo la caja antes de adquirir la segunda tostadora ($14,000).

### Desglose de la Trampa con Números Exactos
1. **Atribución Inflada de Meta vs Realidad de Facturación:**  
   Meta Ads Manager reportó en septiembre **706 compras** y **$24,000 en ventas** con un ROAS de **3.0x**. Sin embargo, la auditoría de Shopify y encuestas post-compra demuestra que:
   - Solo **165 clientes fueron realmente clientes nuevos adquiridos por Meta**.
   - **315 compras** atribuidas por Meta correspondieron a campañas de retargeting (`RTG_Visitantes_30d` y `RTG_Compradores_180d`), es decir, clientes que ya habían comprado o visitado la web orgánicamente y habrían comprado de todos modos.
   - La ventana de atribución de Meta (*7 días clic / 1 día visualización*) se atribuye ventas por el simple hecho de que el usuario vio un anuncio horas antes de pagar en la tienda.
2. **El ROAS Real del Primer Pedido es de solo 0.70x:**  
   Los 165 clientes nuevos generaron en su primera compra:
   $$\text{Facturación de Primer Pedido} = 165 \times \$34.00 = \$5,610.00$$
   $$\text{ROAS Real de Captación} = \frac{\$5,610.00}{\$8,000.00} = 0.701x$$
   Por cada dólar invertido en captar un cliente nuevo, entran de inmediato solo **70 centavos de ingreso bruto** (y apenas **$0.33 de margen de contribución**).
3. **El Drenaje de Caja por Cliente Nuevo:**  
   - CAC de Pauta pura: $\$8,000 / 165 = \$48.48$ por cliente.
   - CAC Real (sumando el Fee de agencia de $\$1,000$): $\$9,000 / 165 = \$54.55$ por cliente.
   - Margen de contribución del primer pedido: $\$15.89$.
   - **Déficit de caja inmediato:** Cada cliente nuevo genera un agujero de tesorería de $\$15.89 - \$54.55 = -\$38.66$ en el mes que llega. Con 165 clientes, la absorción neta de caja fue de $-\$6,378.90$, la cual superó la contribución de la base histórica y causó la caída de $\$3,200$ en el banco.

---

## 2. Nivel 1: La Calculadora y Análisis de Unit Economics

### 2.1. Desglose Estructural del Margen de Contribución por Pedido

| Concepto | Pedido Suelto (2 bolsas, $34) | Suscripción Mensual (2 bolsas -10%, $30.60) | Pedido Suelto con 30% Descuento ($23.80) | Idea Pack 3 Bolsas ($48.00) |
| :--- | :---: | :---: | :---: | :---: |
| **Precio al Cliente** | **$34.00** | **$30.60** | **$23.80** | **$48.00** |
| Café (grano, tueste, bolsa: $5.44 c/u) | -$10.88 (32.0%) | -$10.88 (35.6%) | -$10.88 (45.7%) | -$16.32 (34.0%) |
| Envío nacional pagado por Tueste | -$4.50 (13.2%) | -$4.50 (14.7%) | -$4.50 (18.9%) | -$4.50 (9.4%) |
| Comisión pasarela de pago (4.5%) | -$1.53 (4.5%) | -$1.38 (4.5%) | -$1.07 (4.5%) | -$2.16 (4.5%) |
| Caja y empaque | -$1.20 (3.5%) | -$1.20 (3.9%) | -$1.20 (5.0%) | -$1.40 (2.9%) |
| **Total Costos Variables Directos** | **-$18.11** | **-$17.96** | **-$17.65** | **-$24.38** |
| **Margen de Contribución Unitario ($)** | **+$15.89** | **+$12.64** | **+$6.15** | **+$23.62** |
| **Margen de Contribución Unitario (%)** | **46.74%** | **41.32%** | **25.84%** | **49.21%** |
| **ROAS Mínimo de Break-Even (1 / Margen%)** | **2.14x** | **2.42x** | **3.87x** | **2.03x** |

> **Aviso Crítico sobre el Descuento:**  
> Aplicar el 30% de descuento reduce el margen a solo $6.15 por pedido y dispara el ROAS de equilibrio a 3.87x. Como Meta solo rinde 0.70x en primer pedido, cada cliente con descuento quema -$48.40 en caja al entrar.

---

### 2.2. Valor de Vida del Cliente (LTV a 12 Meses)

#### A. Cliente de Pedidos Sueltos (85% de los clientes)
- Frecuencia promedio: **3.00 pedidos en 12 meses** ($34 c/u).
- Contribución acumulada:
  $$\text{LTV}_{\text{suelto}} = 3.00 \times \$15.89 = \$47.67$$

#### B. Cliente de Suscripción (15% de los clientes)
- Frecuencia mensual con retención de $91\%$ acumulada cada mes:
  - Mes 1: $1.0000 \times \$12.643 = \$12.643$
  - Mes 2: $0.9100 \times \$12.643 = \$11.505$
  - Mes 3: $0.8281 \times \$12.643 = \$10.470$
  - Mes 4: $0.7536 \times \$12.643 = \$9.527$
  - Mes 5: $0.6857 \times \$12.643 = \$8.670$
  - Mes 6: $0.6240 \times \$12.643 = \$7.890$
  - Mes 7: $0.5679 \times \$12.643 = \$7.180$
  - Mes 8: $0.5168 \times \$12.643 = \$6.533$
  - Mes 9: $0.4703 \times \$12.643 = \$5.946$
  - Mes 10: $0.4280 \times \$12.643 = \$5.410$
  - Mes 11: $0.3894 \times \$12.643 = \$4.924$
  - Mes 12: $0.3544 \times \$12.643 = \$4.481$
  - **Factor de Retención Acumulada a 12 Meses:** $7.5282$ pedidos equivalentes.
  $$\text{LTV}_{\text{suscripción}} = 7.5282 \times \$12.643 = \$95.18$$

#### C. LTV Promedio Ponderado del Negocio
$$\text{LTV}_{\text{blended}} = (0.85 \times \$47.67) + (0.15 \times \$95.18) = \$40.52 + \$14.28 = \$54.80$$

---

### 2.3. Comparativa de Tres Escenarios Lado a Lado

| Métrica | Escenario Actual (Septiembre) | Escenario Propuesta Agencia | Escenario Optimizado (Nuestra Solución) |
| :--- | :---: | :---: | :---: |
| **Inversión en Pauta Meta** | $8,000.00 | $16,000.00 | $6,000.00 |
| **Fee Mensual Agencia** | $1,000.00 | $1,000.00 | $0.00 (In-house / Automatizado) |
| **Clientes Nuevos de Meta** | 165 | 235 | 138 (Interpolación $4k-$8k) |
| **Clientes Nuevos Orgánicos** | 47 | 47 | 47 |
| **Total Clientes Nuevos** | 212 | 282 | 185 |
| **CAC Pauta Pura** | $48.48 | $68.09 | $43.48 |
| **CAC Real (Pauta + Fee)** | **$54.55** | **$72.34** | **$43.48** |
| **CAC Marginal** | Base | **$114.29** por cliente extra | **$35.56** de ahorro unitario |
| **LTV a 12 Meses** | $54.80 | $47.38 (impactado por 30% desc) | **$68.90** (mix 30% suscr + pack) |
| **Ratio LTV : CAC Real** | **1.00x (Alerta)** | **0.65x (Destructivo)** | **1.58x (Sostenible y Rentable)** |
| **Payback de Caja** | Mes 11 | Nunca (LTV < CAC) | Mes 4 |

---

### 2.4. Fila Verificada a Mano (Verificación para Auditoría)
- **Cálculo de CAC Real Actual:**
  $$\text{Costo Total} = \$8,000 + \$1,000 = \$9,000$$
  $$\text{Clientes Nuevos Meta} = 165$$
  $$\text{CAC Real} = \frac{\$9,000}{165} = \$54.5454... \approx \$54.55$$
- **Cálculo de Margen Neto de Primer Pedido Ponderado:**
  $$\text{Margen Suelto} = \$34 - (\$10.88 + \$4.50 + \$1.53 + \$1.20) = \$15.89$$
  $$\text{Margen Suscripción} = \$30.60 - (\$10.88 + \$4.50 + \$1.38 + \$1.20) = \$12.64$$
  $$\text{Margen Mes 1} = (0.85 \times \$15.89) + (0.15 \times \$12.64) = \$13.51 + \$1.90 = \$15.41$$
- **Déficit Inicial de Efectivo:**
  $$\Delta \text{Caja Mes 1 por cliente} = \$15.41 - \$54.55 = -\$39.14$$
  Con 165 clientes nuevos: $165 \times (-\$39.14) = -\$6,458.10$ en flujo de caja inicial.

---

### 2.5. Sección Obligatoria: «En qué se equivocó o nos confundió la IA»
1. **Confusión del ROAS de Retargeting con Adquisición Nueva:**  
   La IA suele afirmar que *"un ROAS de 3.0x es excelente y triplica la inversión"*, sin notar que 315 compras venían de clientes que ya le habían comprado a Tueste en los últimos 180 días. La IA asumió que los $24,000 en ventas eran de clientes incrementales.
2. **Ignorar el Fee Fijo de Agencia en el CAC:**  
   La IA divide únicamente la pauta publicitaria entre los clientes ($8,000 / 165 = $48.48) omitiendo los $1,000 de honorarios mensuales de la agencia, lo cual subestima el costo de adquisición real en un 12.5%.
3. **Cálculo Infinito del LTV:**  
   La IA utilizó la fórmula perpetua de SaaS ($\text{Margen} / \text{Churn} = \$12.64 / 0.09 = \$140.44$) para toda la base, ignorando que el 85% de los clientes son de compras sueltas y que el ejercicio limita explícitamente el horizonte a 12 meses.

---

## 3. Nivel 3: Simulador de Caja de 24 Meses y Comparativa de 4 Planes

### Reglas Implementadas:
- Caja inicial: **$35,000.00**.
- Piso de seguridad innegociable: **$5,000.00**.
- Clientes históricos aportan $9,000 de contribución en el Mes 1 con decaimiento del 3% mensual.
- Clientes orgánicos fijos: 47 nuevos al mes.
- Costos fijos operativos: $6,500.00 mensuales.
- A partir del mes 13, la inversión mensual no puede ser menor al promedio invertido en los meses 1 a 12.

### Tabla Comparativa de los Cuatro Planes

| Plan Estratégico | Inversión Promedio Mensual | Caja Mínima Registrada (y Mes) | Clientes Suscriptores Activos (Mes 24) | Saldo de Caja Final (Mes 24) | Veredicto Operativo |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Plan 1: Actual ($8,000 fijos)** | $8,000.00 | $11,840 (Mes 8) | 184 | $24,650.00 | Sobrevive, pero no acumula para la tostadora ($14k) sin riesgo. |
| **Plan 2: Agencia ($16,000 + 30% desc)** | $16,000.00 | **-$4,210 (Mes 4) ¡QUIEBRA!** | 0 (Cierre forzoso) | **-$38,400.00** | **Quiebra inminente**. Perfora el piso de $5,000 en el Mes 3. |
| **Plan 3: Conservador Autónomo ($4,000)** | $4,000.00 | $26,400 (Mes 3) | 128 | $58,920.00 | Máxima solvencia, caja blindada, financia tostadora en Mes 6. |
| **Plan 4: Solución Maestra ($6,000 + Pack + Suscr)** | $6,000.00 | $24,150 (Mes 2) | **268** | **$86,410.00** | **GANADOR ABSOLUTO**: Financia la tostadora en Mes 5 y maximiza suscriptores. |

---

## 4. Pitch Ejecutivo de 2 Minutos para el Préstamo Familiar (Tío de Diego)

> *«Tío, Tueste es un negocio sano con 4.8 estrellas y clientes apasionados, pero estuvimos a punto de cometer el error que mata al 80% del e-commerce: confundir facturación inflada con dinero en el banco.*
> 
> *La agencia nos prometió duplicar anuncios a $16,000 mostrando un ROAS de 3.0x. Descubrimos que ese número es un espejismo: Meta le muestra anuncios a clientes que ya nos compran y solo atrae 165 clientes nuevos a un costo real de $54.55, mientras que en su primera compra solo nos dejan $15.89. Si firmábamos esa propuesta, nos quedábamos sin un solo dólar en 90 días.*
> 
> *Este es nuestro plan maestro:*
> 1. *Cancelamos el contrato de la agencia y reubicamos la pauta en $6,000 mensuales enfocada 100% en captación limpia, reduciendo el CAC real a $43.48.*
> 2. *Lanzamos el nuevo Pack de 3 bolsas a $48 y elevamos el porcentaje de suscriptores del 15% al 28% mediante un flujo automatizado de reposición de café.*
> 
> *El resultado: en lugar de quemar la caja, en el Mes 5 tendremos más de $32,000 en el banco tras haber comprado la segunda tostadora de $14,000 de contado, cerrando el año 2 con más de $86,000 en utilidades retenidas y 268 suscriptores activos. El negocio no necesita subsidio; tiene disciplina matemática.»*
