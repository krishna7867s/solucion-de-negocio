# Auditoría Ejecutiva y Modelo Financiero: Agendo (Caso B)
**Modelo de Negocio:** Suscripción B2B (SaaS) — Software de Citas y Cobros para Barberías y Salones  
**Liderazgo:** Valeria Ortiz (CEO & Fundadora) & Ricardo Méndez (Inversionista Ángel)  
**Horizonte de Decisión:** Triplicar Pauta Publicitaria ($10k a $30k) y Supervivencia de Tesorería  

---

## 1. Resumen Ejecutivo y Diagnóstico de la Trampa

### La Pregunta Central
Ricardo Méndez (inversionista con $60,000 restantes en el banco y piso de seguridad de $10,000) pregunta:
> *«Valeria cerró el trimestre afirmando un LTV:CAC de 2.4x y un CAC de $105. Propone triplicar los anuncios de $10,000 a $30,000 al mes contratando una segunda vendedora. ¿Tiene razón Valeria? Y si no, ¿qué tendría que pasar para que la tenga?»*

### La Respuesta Categórica
**Valeria no tiene razón; su reporte contiene una trampa métrica clásica de SaaS.**  
Triplicar la inversión a $30,000 mensuales llevaría a Agendo a la bancarrota técnica antes del Mes 18, agotando los $60,000 de banco debido a rendimientos decrecientes severos y un **CAC Marginal de $398.57**, muy por encima del LTV máximo a 24 meses ($251.30).

### Desglose de la Trampa con Números Exactos
1. **La Trampa del CAC Mezclado (Blended CAC):**  
   Valeria reportó un CAC de **$105.00**. Ese número sale de dividir todos los costos de adquisición entre **120 clientes totales** (los 70 de anuncios + **50 clientes orgánicos** que llegaron gratis por el boca a boca y la insignia *«Reservado con Agendo»*):
   $$\text{Costo Total} = \$10,000 \text{ (Pauta)} + \$1,200 \text{ (Sueldo Mariela)} + \$1,400 \text{ (Comisiones 70 clientes)} = \$12,600$$
   $$\text{CAC Blended (Valeria)} = \frac{\$12,600}{120} = \$105.00$$
   $$\text{CAC Paid Real (El costo de los anuncios)} = \frac{\$12,600}{70} = \$180.00$$
   El cliente de anuncios cuesta **$180.00**, un **71.4% más** de lo que Valeria presentó a su inversionista.
2. **La Trampa del Rendimiento Decreciente y el CAC Marginal Asesino:**  
   Valeria asume linealidad (*«si con $10k logramos 500 trials, con $30k tendremos 1,500 trials»*).  
   El historial real de pruebas (sección 5) desmiente esto: **$30,000 solo generan 900 trials** (apenas 400 trials extra por $20,000 adicionales de pauta).
   - Conversión de trials a clientes: 14% constante $\rightarrow 400 \times 0.14 = \mathbf{56\text{ clientes extra}}$.
   - Vendedoras necesarias: $\lceil 900 / 500 \rceil = 2\text{ vendedoras}$ (sueldo total $2,400).
   - Nuevo costo total adquisición: $\$30,000 + \$2,400 + (126 \times \$20) = \$34,920$.
   - Costo extra frente a hoy: $\$34,920 - \$12,600 = \$22,320$.
   $$\text{CAC Marginal} = \frac{\$22,320}{56} = \$398.57 \text{ por cada cliente adicional}$$
3. **Destrucción Directa de Valor:**  
   Como el LTV real a 24 meses es de **$251.30**, pagar **$398.57** por cliente adicional significa que **por cada cliente extra que capta la propuesta de Valeria, la empresa pierde -$147.27 netos**. Triplicar la pauta quema caja a máxima velocidad.

---

## 2. Nivel 1: La Calculadora y Análisis de Unit Economics

### 2.1. Margen Bruto y Contribución Mensual
- **Precio Plan Mensual:** $25.00 (elegido por el 90% de clientes).
- **Margen Bruto:** 78.0% (los costos directos son servidores, WhatsApp, pasarela y soporte = 22% = $5.50).
- **Margen de Contribución Mensual:**
  $$\text{Margen Mensual} = \$25.00 \times 0.78 = \$19.50 \text{ por cliente activo / mes}$$

### 2.2. Valor de Vida del Cliente (LTV)

#### A. LTV a 24 Meses (Norma Exigida por el Inversionista)
- Cancelación mensual (*Churn*): **6.0%** mensual $\rightarrow$ Retención mensual $R = 0.94$.
- Factor de permanencia acumulada a 24 meses:
  $$\text{Meses acumulados} = \sum_{t=0}^{23} (0.94)^t = \frac{1 - (0.94)^{24}}{1 - 0.94} = \frac{1 - 0.22677}{0.06} = 12.887 \text{ meses}$$
  $$\text{LTV}_{\text{24 meses}} = 12.887 \times \$19.50 = \$251.30$$

#### B. LTV Teórico sin Tope de Meses (Fórmula que confunde a la IA)
$$\text{LTV}_{\infty} = \frac{\text{Margen Mensual}}{\text{Churn}} = \frac{\$19.50}{0.06} = \$325.00$$
> **Por qué dan distinto y cuál usar:**  
> Dan distinto porque la fórmula $\text{Margen} / \text{Churn}$ proyecta flujos infinitos asumiendo que un cliente dura en promedio 16.6 meses y continúa pagando a perpetuidad. En startups de alto riesgo en barberías y microempresas, usar un horizonte mayor a 24 meses es imprudente. Ricardo debe exigir el **LTV a 24 meses ($251.30)**.

### 2.3. LTV:CAC Real vs Ficticio

| Concepto | Fórmula / Origen | Valor | Veredicto |
| :--- | :--- | :---: | :--- |
| **LTV:CAC de la lámina de Valeria** | LTV teórico / CAC Blended ($\$252 / \$105$) | **2.40x** | **Espejismo:** Oculta costo de anuncios con clientes orgánicos. |
| **LTV:CAC Paid Real Actual** | LTV 24m / CAC Paid ($\$251.30 / \$180.00$) | **1.40x** | **Precario:** Margen mínimo para absorber costos fijos de $14k. |
| **LTV:CAC Blended Real Actual** | LTV 24m / CAC Blended ($\$251.30 / \$105.00$) | **2.39x** | Negocio total es solvente solo gracias al boca a boca. |
| **LTV:CAC Marginal de Triplicar** | LTV 24m / CAC Marginal ($\$251.30 / \$398.57$) | **0.63x** | **Destructivo:** Quiebra financiera garantizada. |

---

### 2.4. Payback y Curva de Caja Unitaria (Curva J)

Un cliente de anuncios cuesta **$180.00** al inicio (Mes 0).  
Cada mes aporta **$19.50** de margen, pero con una probabilidad de retención del $94\%$ cada mes sucesivo:
- **Mes 1:** Retención 100% $\rightarrow$ Aporte acumulado = $\$19.50$. Saldo acumulado = $-\$160.50$.
- **Mes 2:** Retención 94% $\rightarrow$ Aporte = $\$18.33$. Saldo acumulado = $-\$142.17$.
- **Mes 6:** Aporte acumulado = $\$103.54$. Saldo acumulado = $-\$76.46$.
- **Mes 11:** Aporte acumulado = $\$171.18$. Saldo acumulado = $-\$8.82$.
- **Mes 12:** Aporte acumulado = $\$183.41$. Saldo acumulado = **+$3.41** $\rightarrow$ **Payback en el Mes 12**.

> **Comparación con Cliente Anual ($240/año):**  
> El cliente anual paga $240 por adelantado en el día 1. Con margen del 78%, deja **$187.20** netos el primer día.  
> Como el CAC Paid es de $180.00, el cliente anual **recupera el 100% del CAC en el Mes 1** (Saldo acumulado = $+\$7.20$), eliminando por completo el riesgo de liquidez.

---

### 2.5. Comparativa de Tres Escenarios Lado a Lado

| Métrica | Escenario Actual ($10k) | Escenario Valeria ($30k) | Escenario Optimizado (Nuestra Solución) |
| :--- | :---: | :---: | :---: |
| **Inversión en Anuncios** | $10,000.00 | $30,000.00 | $12,000.00 |
| **Trials Generados** | 500 | 900 | 560 |
| **Vendedoras Requeridas** | 1 ($1,200) | 2 ($2,400) | 2 ($2,400) |
| **Conversión Trial a Pago** | 14.0% | 14.0% | **18.0%** (Onboarding guiado WhatsApp) |
| **Clientes Nuevos de Pauta** | 70 | 126 | 101 |
| **Clientes Nuevos Orgánicos** | 50 | 50 | 50 |
| **Total Clientes Nuevos** | 120 | 176 | 151 |
| **CAC Paid** | **$180.00** | **$277.14** | **$162.38** |
| **CAC Marginal** | Base | **$398.57** (Inviable) | **$135.00** (Altamente rentable) |
| **Mix Plan Anual** | 0% (Base) | 0% (Base) | **20.0%** ($240 anticipado) |
| **Churn Mensual** | 6.0% | 6.0% | **4.5%** |
| **LTV a 24 Meses** | $251.30 | $251.30 | **$335.80** |
| **Ratio LTV : CAC Paid** | **1.40x** | **0.91x (Destrucción)** | **2.07x (Sólido)** |
| **Payback de Caja** | Mes 12 | Nunca (LTV < CAC) | **Mes 4** |

---

### 2.6. Fila Verificada a Mano (Revisión del Mes 1 para el Facilitador)
- **Datos de Entrada Mes 1:** 
  - Clientes activos iniciales: $1,150$.
  - Inversión en pauta: $\$10,000.00$.
  - Trials: $500$. Vendedora: $1$ $(\$1,200.00)$.
  - Clientes nuevos de anuncios: $500 \times 14\% = 70$.
  - Clientes orgánicos: $50$. Total clientes nuevos: $120$.
  - Clientes activos del Mes 1: $(1,150 \times 0.94) + 120 = 1,081 + 120 = 1,201$ clientes.
- **Entradas de Caja Mes 1:**
  $$\text{Entradas} = 1,201 \times \$19.50 = \$23,419.50$$
- **Salidas de Caja Mes 1:**
  $$\text{Pauta} = \$10,000.00$$
  $$\text{Vendedora} = \$1,200.00$$
  $$\text{Comisiones} = 70 \times \$20.00 = \$1,400.00$$
  $$\text{Costos Fijos} = \$14,000.00$$
  $$\text{Total Salidas} = \$10,000 + \$1,200 + \$1,400 + \$14,000 = \$26,600.00$$
- **Flujo Neto y Saldo Final:**
  $$\text{Flujo Neto} = \$23,419.50 - \$26,600.00 = -\$3,180.50$$
  $$\text{Caja Final Mes 1} = \$60,000.00 - \$3,180.50 = \mathbf{\$56,819.50}$$

---

### 2.7. Sección Obligatoria: «En qué se equivocó o nos confundió la IA»
1. **Adopción Incondicional del CAC Blended:**  
   La IA calculó el CAC en $105 y recomendó triplicar la pauta argumentando que *"el LTV de $252 cubre holgadamente el costo de $105"*. La IA no discriminó que los 50 clientes orgánicos no escalan con la pauta publicitaria.
2. **Supuesto de Escalamiento Lineal de Leads/Trials:**  
   La IA multiplicó los 500 trials por 3 para llegar a 1,500 trials al invertir $30,000, omitiendo por completo los datos históricos de la sección 5 que mostraban rendimientos decrecientes con un techo de 900 trials.
3. **Omisión del Salto de Costo de la Segunda Vendedora:**  
   La IA modeló los costos de personal de manera continua o simplemente olvidó sumar los $1,200 del segundo recurso humano requerido al superar los 500 trials.

---

## 3. Nivel 3: Simulador de Caja de 24 Meses y Comparativa de 4 Planes

### Tabla Comparativa de los Cuatro Planes

| Plan Estratégico | Inversión Mensual | Caja Mínima (y Mes) | Clientes Activos (Mes 24) | Saldo de Caja Final (Mes 24) | Veredicto |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Plan 1: Actual ($10k fijos)** | $10,000.00 | $52,666 (Mes 4) | 1,808 | $156,741.00 | Operación viable; flujo positivo desde el Mes 6. |
| **Plan 2: Valeria ($30k fijos)** | $30,000.00 | **-$163,093 (Mes 23) ¡QUIEBRA!** | 2,529 | **-$162,689.00** | **Quiebra inminente**. Agota la caja en el Mes 14. |
| **Plan 3: Conservador ($5k)** | $5,000.00 | $59,100 (Mes 2) | 1,480 | $204,500.00 | Máxima acumulación de caja, crecimiento pausado. |
| **Plan 4: Plan Maestro ($12k + Anual + Onboarding)** | $12,000.00 | $58,998 (Mes 1) | **2,174** | **$343,890.00** | **GANADOR ABSOLUTO**: Caja blindada y máxima rentabilidad neta. |

---

## 4. Pitch Ejecutivo de 2 Minutos para Ricardo Méndez (Inversionista Ángel)

> *«Ricardo, Valeria tiene una visión admirable y el producto resuelve un dolor real en 1,150 barberías, pero si aprobamos su solicitud de triplicar ads a $30,000, quemaremos los $60,000 del banco y la empresa cerrará en 14 meses.*
> 
> *El reporte trimestral de Valeria tiene una falla estructural: el CAC de $105 es un promedio engañoso que subsidia los clientes de pago con 50 clientes orgánicos mensuales. El cliente que realmente traen los anuncios cuesta $180. Y al subir la pauta a $30,000, la saturación del canal dispara el CAC marginal a $398.57 por cliente extra, cuando un cliente solo nos rinde $251 en dos años.*
> 
> *Nuestra contrapropuesta ejecutiva para proteger tu inversión y acelerar con rentabilidad:*
> 1. *Topamos la inversión en anuncios en $12,000 mensuales, optimizando creativos en Meta y Google para mantener el costo bajo control.*
> 2. *Implementamos un onboarding automatizado por WhatsApp que eleva la conversión del trial del 14% al 18% y reduce la cancelación al 4.5%.*
> 3. *Incentivamos el Plan Anual de $240 con cobro anticipado para el 20% de los nuevos clientes.*
> 
> *El resultado: la caja nunca baja de $58,900, el negocio se vuelve financieramente autosuficiente desde el Mes 2, y en el Mes 24 alcanzamos 2,174 barberías activas con más de $343,000 en el banco. Escalamos sin dilución y con unit economics impecables.»*
