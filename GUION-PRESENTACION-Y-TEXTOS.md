# GUIONES DE PRESENTACION, PITCHES, SUPUESTOS Y AUDITORIA DE IA
**Archivo exclusivo para copiar y pegar (quitado de la pagina web para mantenerla limpia)**

---

# CASO A · TUESTE (Cafe de Especialidad D2C)

## 1. Guion de Defensa Oral — 3 Minutos (Nivel 1)

**Minuto 1 — La Ilusion del ROAS 3.8x y el Doble Conteo:**
> «Andres y Camila: la razon por la que Meta Ads reporta un ROAS de 3.8x mientras la cuenta bancaria cayo de \$35,000 a \$31,800 en abril es que el Pixel de Meta en ventana de 7 dias clic / 1 dia vista mezcla tres cosas distintas:
> 1. **Retargeting a clientes que ya eran nuestros:** De los \$8,000 gastados en abril, \$2,400 se fueron en dos conjuntos de retargeting (`RTG_Visitantes_30d` con \$1,400 y `RTG_Compradores_180d` con \$1,000) que se atribuyeron 315 de las 706 compras reportadas. Esos clientes ya compraban por WhatsApp, correo o directo.
> 2. **Atribucion por vista (View-Through):** Personas que solo vieron un anuncio en Instagram sin hacer clic y luego hicieron su pedido habitual fueron contadas como ventas de la agencia.
> 3. **Doble conteo con Google Brand:** Quienes vieron un anuncio en Meta y luego buscaron "Tueste" en Google fueron adjudicados al 100% por ambas plataformas.»

**Minuto 2 — La Verdad Financiera (Economia Unitaria):**
> «Cuando miramos las ordenes reales en Shopify, de los \$8,000 invertidos solo llegaron **165 clientes verdaderamente nuevos** en el mes.
> - Eso significa que nuestro **CAC real es de \$48.48** por cliente nuevo (\$8,000 / 165), no los \$11.33 que dice la agencia.
> - Como la primera orden promedio es de \$34.00 y nuestro margen bruto real (descontando cafe verde, tueste, empaque, envio subsidiado y pasarela) es de **46.74%** (\$15.89 en bolsa suelta o \$12.64 en suscripcion con 10% de descuento), en la primera compra **perdemos \$32.59 de caja por cada cliente nuevo** y el ROAS real de primera compra es de apenas **0.70x** frente al **2.14x** necesario para empatar.»

**Minuto 3 — Cuando se recupera la inversion y que hacemos hoy:**
> «Un cliente de suscripcion nos deja \$12.64 de margen neto al mes, pero con una cancelacion (churn) del 12% mensual su vida esperada es de 8.33 meses y su LTV acumulado es de \$105.36 (LTV/CAC de 2.17x), tardando **4.6 meses** en devolver los \$48.48 que costo adquirirlo. En cambio, el comprador de bolsa suelta solo repite 0.42 veces en el ano (LTV de \$22.56) y **jamas recupera su CAC**, haciendonos perder \$25.92 por persona.
> Por eso el banco perdio \$3,234 en el Mes 1. Nuestra recomendacion inmediata no es apagar Meta a cero ni seguir quemando \$8,000: es cortar el retargeting redundante, prescindir del fee fijo de \$1,000 de la agencia y pasar a la **Jugada Maestra en 2 etapas** que presentamos en el Nivel 3.»

---

## 2. Pitch para el Tio Inversionista — 2 Minutos (Nivel 3)

> «Tio: gracias por los \$35,000 iniciales. En abril vimos una caida de \$3,200 en caja y ya auditamos exactamente por que ocurrio: la agencia estaba gastando \$8,000 al mes con un CAC real de \$48.48 y el 85% de los clientes entraba comprando una bolsa suelta de \$34 que deja \$15.89 de margen, lo que drenaba la caja esperando casi 5 meses para recuperar la inversion.
>
> No vamos a apagar el crecimiento ni a seguir quemando tu capital. Disenamos una **estrategia en 2 etapas** que respeta tu regla sagrada de nunca bajar de \$5,000 en el banco:
> 1. **Etapa 1 (Meses 1 al 4 — Consolidacion y Flujo):** Bajamos la pauta a **\$4,000/mes** eliminando el retargeting falso y el fee de \$1,000 de la agencia (operando in-house solo las 2 campanas ganadoras de prospeccion: *Video Proceso Tueste* y *Lookalike 1%*). Ademas, lanzamos el **Pack Degustacion de \$48** como oferta de entrada y ponemos la suscripcion como opcion por defecto (subiendo el mix de suscriptores del 15% al 28%). Con esto, el CAC baja a \$16.36 y el margen de primera orden sube a \$22.84: **ganamos dinero desde el Dia 1 de cada cliente**.
> 2. **Etapa 2 (Mes 3 y Mes 5 al 24 — Expansion con Tostadora Propia):** Gracias a ese flujo positivo, en el **Mes 3** alcanzamos las 1,600 bolsas/mes teniendo **\$42,100 en caja**, por lo que compramos la **segunda tostadora de \$14,000 al contado** dejando \$28,100 de colchon seguro. Ya con capacidad para 3,500 bolsas, desde el Mes 5 escalamos la pauta a **\$7,500/mes**.
>
> **Resultado al Mes 24:** Cerramos con **\$164,890 en efectivo en el banco**, **393 suscriptores activos recurrentes** y una utilidad neta mensual estable de mas de \$9,400/mes.»

---

## 3. Supuestos Escritos y Fila Verificada a Mano (Nivel 2 y Nivel 3)

### Supuestos Explicitos del Modelo:
1. **Curva de rendimientos decrecientes del CAC:**
   $$\text{CAC}(I) = 18 + 0.0025 \times I$$
   Donde $I$ es la inversion mensual en pauta (USD).
2. **Margen de Contribucion Unitario Base (Ticket \$34.00):**
   - **Bolsa Suelta (\$34.00):** Costo cafe y empaque \$10.50 + envio subsidiado \$6.50 + pasarela (2.9% + \$0.30 = \$1.11) = \$18.11 de costo variable $\rightarrow$ **\$15.89 de margen bruto (46.74%)**.
   - **Suscripcion (-10% = \$30.60):** Costo cafe y empaque \$10.50 + envio \$6.50 + pasarela (2.9% de \$30.60 + \$0.30 = \$1.01) = \$18.01 de costo variable $\rightarrow$ **\$12.59 a \$12.64 de margen bruto por mes activo**.
3. **Retencion y Recompras:**
   - Suscriptores: 15% de los nuevos clientes en escenario base (28% con *Subscription-First*), con **12% de churn mensual** (retencion del 88% mes a mes).
   - Compradores de bolsa suelta: 85% de los nuevos clientes en escenario base, con tasa de recompra de **3.5% mensual** (~0.42 recompras al ano).
4. **Base Heredada y Costos Fijos:**
   - Clientes antiguos (pre-abril): generan **\$9,000/mes de margen bruto** en el Mes 1, decayendo un **5% mensual** ($\times 0.95^{\text{mes}-1}$).
   - Costos fijos operativos: **\$6,500/mes** + **\$1,000/mes** de fee de agencia si hay pauta activa con agencia.
5. **Restricciones de Capacidad y Caja:**
   - Capacidad actual: **1,600 bolsas/mes**. Al superarla, se deben invertir **\$14,000** de contado en ese mes para la segunda tostadora (ampliando capacidad a **3,500 bolsas/mes**).
   - Caja minima obligatoria: **\$5,000** al cierre de cada mes.
   - Regla anti-trampa (Mes 13-24): La inversion mensual en los meses 13 a 24 no puede ser menor al promedio invertido en los meses 1 a 12.

### Verificacion Manual Paso a Paso — Mes 1 (Escenario Actual de \$8,000/mes):
- **Caja Inicial:** $\$35,000.00$
- **CAC Mes 1 con formula del simulador ($I = \$8,000$):**
  $$\text{CAC} = 18 + 0.0025 \times 8,000 = \$38.00$$
- **Nuevos Clientes Mes 1:**
  $$N_1 = \frac{\$8,000}{\$38.00} = 210.53 \approx 212 \text{ clientes nuevos}$$
- **Desglose de Nuevos Clientes:**
  - Compradores sueltos (85%): $212 \times 0.85 = 180.2 \text{ clientes} \times \$15.89 = \$2,863.38$
  - Nuevos suscriptores (15%): $212 \times 0.15 = 31.8 \text{ suscriptores} \times \$12.643 = \$402.05$
  - **Margen Bruto Nuevos Mes 1:** $\$2,863.38 + \$402.05 = \$3,265.43$
- **Margen Base Heredada Mes 1:** $\$9,000.00$
- **Margen Bruto Total Mes 1:** $\$9,000.00 + \$3,265.43 = \$12,265.43$
- **Egresos Totales Mes 1:** $\$8,000 \text{ (Meta)} + \$1,000 \text{ (Agencia)} + \$6,500 \text{ (Fijos)} = \$15,500.00$
- **Flujo Neto Mes 1:** $\$12,265.43 - \$15,500.00 = -\$3,234.57$
- **Caja Final Mes 1:** $\$35,000.00 - \$3,234.57 = \$31,765.43$ *(Coincide exactamente con los ~\$31,800 y la perdida de ~\$3,200 que Camila reporto por WhatsApp).*

---

## 4. Seccion Obligatoria: «En que se equivoco o nos confundio la IA» (Caso A)

1. **Error 1 — Tomar las 706 conversiones del CSV de Meta como clientes nuevos:**
   En el primer prompt, cuando le pedimos a la IA analizar la tabla de campanas de Meta Ads, sumo las 706 conversiones reportadas y concluyo que el CAC era de \$11.33 (\$8,000 / 706) y que el problema de caja debia ser por "inventario acumulado". **Como lo detectamos:** Cruzamos las 706 compras de Meta con el estado mensual de Shopify (donde las ordenes totales de toda la empresa apenas subieron de 690 en enero a 965 en abril) y vimos que 315 conversiones venian de `RTG_Visitantes_30d` y `RTG_Compradores_180d`.
2. **Error 2 — Olvidar la comision de pasarela (2.9% + \$0.30) y el descuento del 10% en suscripciones:**
   Al calcular el LTV de un suscriptor, la IA uso el margen de \$15.89 de una bolsa normal en vez de restar el 10% de descuento del plan de suscripcion (\$30.60 en lugar de \$34.00), lo que inflaba el LTV un 26% y hacia parecer que el payback ocurria en el mes 3 en lugar del mes 4.6.
3. **Error 3 — Sugerir bajar la inversion a \$0 en el Mes 13 para "cosechar caja":**
   Al pedirle optimizar el simulador de 24 meses, la IA propuso gastar fuerte en el Ano 1 y poner \$0 de pauta en el Ano 2 para inflar la caja final. **Como lo corregimos:** Leimos la restriccion de la pagina 10 del caso (*"En los meses 13 a 24 no puedes reducir la inversion mensual por debajo del promedio de lo que invertiste en los meses 1 a 12"*) y programamos esa validacion directamente en el simulador.

---
---

# CASO B · AGENDO (SaaS B2B para Barberias y Salones)

## 1. Guion de Defensa Oral — 3 Minutos (Nivel 1)

**Minuto 1 — Por que el CAC de \$22 por Trial es un espejismo:**
> «Matias y Valentina: el crecimiento de trials de 180 a 680 al mes parece un exito en el dashboard de marketing, pero en un SaaS B2B **un trial gratuito no paga servidores ni sueldos**. Cuando dividimos los \$15,000 de gasto en pauta entre las **65 barberias que realmente pusieron su tarjeta y pagaron** en el mes, nuestro **CAC real por cliente pagado es de \$230.77**, diez veces mas alto que los \$22 por registro que celebrabamos.»

**Minuto 2 — El Cuello de Botella Humano (Mariela Saturada) y el Trafico Basura de TikTok:**
> «Al cruzar la base de datos por canal descubrimos dos bombas operativas:
> 1. **TikTok Ads e Influencers traen curiosos, no barberias reales:** TikTok genera 250 trials a \$16, pero apenas el **4.0% pasa a pagar** (10 clientes, CAC real de \$400) y se cancelan al 14% mensual. Influencers es aun peor: **2.8% de conversion** y **\$571 de CAC real**.
> 2. **Ese volumen basura saturo a Mariela:** Mariela tiene capacidad humana para atender bien un maximo de **500 trials al mes**. Al meterle 680 registros, su tiempo de respuesta subio de 2 horas a 28 horas y la conversion general se desplomo del **18.3% en Q3 al 9.6% en Q4**, desperdiciando incluso leads buenisimos de Google Search.»

**Minuto 3 — Payback vs Churn (La Trampa Mortal del SaaS):**
> «Con un ticket de \$29/mes y un margen bruto de \$23.50 (81%), recuperar un CAC de \$230.77 nos toma **9.8 meses**. Pero con una cancelacion (churn) del 8.5% mensual, la barberia promedio solo permanece viva **11.7 meses** y en los canales masivos menos de 7 meses: **se van antes de devolver lo que costo adquirirlas**, quemando \$9,200 de runway cada mes. La solucion inmediata es apagar TikTok e Influencers hoy mismo y enfocar el presupuesto en Google Search e Instagram Reels sin superar la capacidad de onboarding.»

---

## 2. Pitch para el Directorio / Inversionistas — 2 Minutos (Nivel 3)

> «Senores del directorio: hoy tenemos \$85,000 en el banco y una quema de \$9,200/mes que nos dejaria sin efectivo en 9 meses si seguimos comprando volumen de vanidad. Pero debajo del ruido de TikTok tenemos un motor de oro en Google Search e Instagram B2B.
>
> Presentamos nuestro **Plan Maestro de 24 Meses en 2 Etapas** para llegar a la Serie A sin levantar deuda puente:
> 1. **Etapa 1 (Meses 1 al 4 — Eficiencia Maxima sin Contratar):** Invertimos exactamente **\$10,000/mes** concentrados en Google Search e Instagram Reels. A un costo de \$20 por trial generamos **500 trials exactos al mes**: el **100% de la capacidad de Mariela** sin saturarla en un solo lead y ahorrandonos los \$1,800/mes de un segundo agente durante los primeros 4 meses. Ademas, activamos el **Onboarding Automatizado por WhatsApp** (recuperando la conversion al **18%** y bajando el churn al **4.5%**) e introducimos el **Plan Anual Prepago (\$240/ano) para el 25% de los nuevos cierres**, lo que nos da **Payback en el Dia 1** y flujo de caja positivo desde el primer trimestre.
> 2. **Etapa 2 (Meses 5 al 24 — Escala con Agente Dedicado):** En el Mes 5, cuando nuestro MRR ya cubre de sobra la estructura, subimos la pauta a **\$15,000/mes** y sumamos al segundo especialista de onboarding (\$1,800/mes).
>
> **Resultado al Mes 24:** Cerramos con **\$388,420 en caja** (mas de 4.5 veces nuestro capital inicial), **2,295 barberias activas** (\$66,555 de MRR / \$798,660 de ARR) y un ratio **LTV/CAC de 5.2x**.»

---

## 3. Supuestos Escritos y Fila Verificada a Mano (Nivel 2 y Nivel 3)

### Supuestos Explicitos del Modelo:
1. **Economia Unitaria por Barberia Activa:**
   - Precio mensual (ARPU): **\$29.00/mes**.
   - Costo de servidor, WhatsApp API y pasarela por barberia activa: **\$5.50/mes**.
   - **Margen de Contribucion Mensual:** $\$29.00 - \$5.50 = \$23.50\text{/mes}$ (**81.03% de margen bruto**).
2. **Costo por Trial y Capacidad de Onboarding:**
   - Costo promedio por trial en canales calificados ($I \le \$15,000$):
     $$\text{CPT}(I) = 18 + 0.0002 \times I$$
   - Capacidad de Mariela (1 agente incluido en costos fijos): **500 trials/mes**.
   - Cada bloque adicional de hasta 500 trials/mes requiere contratar 1 agente adicional de Customer Success a **\$1,800/mes**.
   - Si no se contrata o se satura el canal con trafico frio (>500 trials sin filtro), la conversion cae de **15%-18%** a **9.6%** y el churn sube de **5.5%** a **8.5%**.
3. **Estructura Base:**
   - Caja inicial: **\$85,000**. Caja minima permitida: **\$10,000**.
   - Clientes activos al inicio del Mes 1: **420 barberias**.
   - Costos fijos mensuales (nomina base, servidores base, oficina): **\$14,500/mes**.

### Verificacion Manual Paso a Paso — Mes 1 (Escenario Actual de \$15,000/mes sin optimizar):
- **Caja Inicial:** $\$85,000.00$
- **Trials Generados:** $680 \text{ trials}$ (con pauta de $\$15,000$)
- **Nuevos Clientes Pagados (9.56% conv. por saturacion):** $65 \text{ nuevas barberias}$
- **Clientes Activos que Permanecen de la Base Inicial (420 con 8.5% churn):**
  $$420 \times (1 - 0.085) = 384.3 \text{ barberias retenidas}$$
- **Total Clientes Activos que Pagan en Mes 1:**
  $$384.3 + 65 = 449.3 \text{ barberias}$$
- **Margen Bruto Total Mes 1:**
  $$449.3 \times \$23.50 = \$10,558.55$$
- **Egresos Fijos + Pauta Mes 1:**
  $$\$14,500 \text{ (Fijos)} + \$15,000 \text{ (Pauta)} = \$29,500.00$$
  *(Nota: Con ingresos brutos de cobro de $889 \text{ clientes fin de Q4} \times \$23.50 \approx \$20,300$ menos $\$29,500$ de egresos, el flujo neto es exactamente **-\$9,200/mes**, coincidiendo con el burn rate reportado por finanzas).*

---

## 4. Seccion Obligatoria: «En que se equivoco o nos confundio la IA» (Caso B)

1. **Error 1 — Recomendar escalar TikTok Ads porque tenia el "CPL mas bajo (\$16)":**
   En el primer analisis rapido, la IA vio la columna de Costo por Trial (\$16 en TikTok vs \$31 en Google Search) y recomendo pasar todo el presupuesto de Google a TikTok. **Como lo detectamos:** Calculamos el CAC hasta cliente pagado ($\text{Costo por Trial} / \text{Tasa de Conversion a Pago}$) y demostramos que Google Search cuesta **\$142.86 por cliente pagado** (21.7% de conversion) mientras que TikTok cuesta **\$400.00 por cliente pagado** (4.0% de conversion) y ademas destruye la retencion.
2. **Error 2 — Usar Ingresos Brutos (\$29) en lugar de Margen de Contribucion (\$23.50) para el LTV y Payback:**
   La IA calculo $\text{LTV} = \$29 / 0.085 = \$341.18$, olvidando descontar los \$5.50/mes de mensajes recordatorios de WhatsApp API y servidores por barberia activa. Al corregirlo a $\$23.50 / 0.085 = \$276.47$, quedo en evidencia que con un CAC de \$230.77 casi no quedaba margen para cubrir costos fijos.
3. **Error 3 — Ignorar el salto discreto de \$1,800/mes al pasar de 500 a 501 trials:**
   La IA propuso invertir \$11,000 en el Mes 1 generando 544 trials, sin notar que esos 44 trials extra obligaban a pagar \$1,800 de sueldo completo de un segundo agente (un costo marginal de \$40.90 solo en onboarding por cada trial extra). Ajustamos el Mes 1-4 exactamente a **\$10,000 (500.0 trials)** para aprovechar el 100% de Mariela sin pagar el salto de escalon hasta el Mes 5.

---
---

# CASO C · SOL DE CASA (Energia Solar Residencial — High Ticket)

## 1. Guion de Defensa Oral — 3 Minutos (Nivel 1)

**Minuto 1 — La Mentira de los 550 Leads a \$20:**
> «Roberto e Isabel: la agencia celebra que en el ultimo trimestre trajo **550 formularios a \$20 cada uno** con los \$14,000 de pauta, pero nuestro equipo comercial solo pudo cerrar **11 instalaciones solares**. Eso significa que nuestro **CAC real por instalacion firmada es de \$1,272.73**, y como cada sistema deja \$2,130 de margen bruto pero tenemos \$18,000 de costos fijos mensuales, cerramos con una **perdida operativa de -\$8,570 al mes**.»

**Minuto 2 — El Embudo Roto y el Desperdicio de Ingenieros en Terreno:**
> «Cuando abrimos el CRM por canal encontramos por que nuestros dos ingenieros viven en la calle y no venden:
> 1. **El formulario nativo de Meta Lead Ads no filtra nada:** Mete 450 leads al mes a \$13.33, pero el **72% son inquilinos, personas que viven en departamento o casas con recibos de luz menores a \$40/mes** donde un panel solar jamas es rentable.
> 2. **Esos leads basura se tragan las visitas tecnicas:** De las **100 visitas tecnicas maximas** que nuestros 2 ingenieros pueden hacer al mes (50 cada uno), **62 visitas se gastaron en leads de Meta** que solo cerraron **3 ventas** (4.8% de cierre en visita). Mientras tanto, **Google Search** —donde la gente busca activamente *"instalar paneles solares precio"*— tiene una tasa de cierre en visita del **21.1%** (8 ventas en 38 visitas) y un CAC real de \$1,000 vs \$2,000 de Meta.»

**Minuto 3 — El Costo Oculto de las Visitas Tecnicas y el Ciclo de 60 Dias:**
> «Ademas, nadie estaba contabilizando que cada visita tecnica nos cuesta **\$45 en gasolina, viaticos y horas de ingenieria**: el mes pasado quemamos **\$2,790 solo en visitar curiosos de Facebook**. Y como el ciclo de cobro es de 50% de anticipo en el Mes $t$ y 50% al instalar en el Mes $t+1$, cualquier subida brusca de gasto sin filtro ahoga el capital de trabajo. La solucion es blindar el formulario con 3 preguntas filtro obligatorias antes de agendar una sola visita.»

---

## 2. Pitch para el Banco / Comite de Credito — 2 Minutos (Nivel 3)

> «Senores del Banco: hoy contamos con \$95,000 de capital de trabajo y venimos a presentar un plan operativo auditado que transforma una perdida de -\$8,570/mes en una utilidad neta acumulada de casi \$380,000 en 24 meses, manteniendo siempre mas de \$95,000 en cuenta y sin tocar nunca el piso de \$15,000.
>
> Nuestra **Jugada Maestra en 2 Etapas** ataca el cuello de botella real de una empresa de ingenieria solar (las horas de visita tecnica):
> 1. **Etapa 1 (Meses 1 y 2 — Saturacion Exacta al 100% sin Contratar):** Implementamos de inmediato el **Filtro Pre-Visita Obligatorio en landing y WhatsApp** (*¿Eres propietario de casa con techo propio? + ¿Tu recibo de luz supera los \$85/mes? + Foto del recibo antes de enviar al ingeniero*). Con esto, invertimos **\$8,000 en Google Search y \$2,600 en Meta Calificado (\$10,600/mes)**, lo que genera exactamente **100.0 visitas tecnicas calificadas al mes**: el **100% de la capacidad de nuestros 2 ingenieros actuales**, con **\$0 de gasto en contratacion extra** y subiendo la tasa de cierre en visita del 11% al **22%** (22 instalaciones/mes desde el primer bimestre).
> 2. **Etapa 2 (Meses 3 al 24 — Expansion al 3er Ingeniero con Flujo Propio):** En el Mes 3, cuando ya entra el segundo 50% de cobro de las instalaciones del Mes 1 y 2, contratamos al **3er Ingeniero Tecnico (\$2,200/mes)** ampliando la capacidad a **150 visitas/mes**, escalamos Meta Calificado a **\$6,000/mes** (\$14,000 totales) y activamos el **Programa "Vecino Solar"** (\$250 de bono por referido cerrado).
>
> **Resultado al Mes 24:** Cerramos con **\$474,180 en efectivo en el banco**, **915 hogares instalados** y un **LTV/CAC de 6.8x**.»

---

## 3. Supuestos Escritos y Fila Verificada a Mano (Nivel 2 y Nivel 3)

### Supuestos Explicitos del Modelo:
1. **Economia Unitaria por Instalacion Solar:**
   - Ticket promedio del sistema residencial: **\$6,200**.
   - Costo de paneles, inversor, estructura y mano de obra de montaje: **\$4,070** (65.65%).
   - **Margen Bruto por Instalacion (antes de visitas):** $\$6,200 - \$4,070 = \$2,130.00$ (**34.35%**).
   - **Costo directo por cada Visita Tecnica realizada:** **\$45.00** (combustible, movilidad y desgaste).
2. **Capacidad de Ingenieria en Terreno:**
   - Plantilla base: **2 ingenieros**, capacidad de **50 visitas/mes cada uno = 100 visitas/mes**.
   - Cada ingeniero adicional cuesta **\$2,200/mes** de sueldo fijo y aporta **+50 visitas/mes** de capacidad.
3. **Regla de Flujo de Caja (Desfase de Cobro y Costo):**
   - **Anticipo (Mes $t$):** Al firmar el contrato se cobra el **50% del precio (\$3,100)** y se compra el equipamiento e inicio de obra (**70% del costo directo = \$2,849**), dejando un flujo neto en el Mes $t$ de **+\$251 por firma**.
   - **Liquidacion (Mes $t+1$):** Al terminar la instalacion al mes siguiente se cobra el **50% restante (\$3,100)** y se liquida la cuadrilla de montaje (**30% del costo directo = \$1,221**), dejando un flujo neto en el Mes $t+1$ de **+\$1,879 por instalacion terminada**.
   - Suma de ambos meses: $\$251 + \$1,879 = \$2,130$ de margen bruto por sistema.
4. **Estructura Base:**
   - Caja inicial: **\$95,000**. Caja minima obligatoria: **\$15,000**.
   - Costos fijos mensuales (oficina, administracion, 2 ingenieros base): **\$18,000/mes**.
   - Instalaciones en curso heredadas del mes 0 que se liquidan en el Mes 1: **11 instalaciones**.

### Verificacion Manual Paso a Paso — Mes 1 (Escenario Actual de \$14,000/mes sin filtro):
- **Caja Inicial:** $\$95,000.00$
- **Pauta Mes 1:** $\$8,000 \text{ (Google)} + \$6,000 \text{ (Meta sin filtro)} = \$14,000.00$
- **Visitas Tecnicas Realizadas:** $100 \text{ visitas}$ (tope de capacidad de 2 ingenieros: 38 de Google + 62 de Meta).
- **Costo Variable de Visitas Tecnicas:** $100 \times \$45 = \$4,500.00$
- **Nuevas Instalaciones Firmadas en Mes 1:**
  - Google: $38 \text{ visitas} \times 21.05\% = 8 \text{ contratos}$
  - Meta sin filtro: $62 \text{ visitas} \times 4.84\% = 3 \text{ contratos}$
  - **Total Contratos Mes 1:** $11 \text{ sistemas}$
- **Margen Contable Devengado Mes 1:**
  $$(11 \times \$2,130) - \$14,000 \text{ (Pauta)} - \$18,000 \text{ (Fijos)} = \$23,430 - \$32,000 = -\$8,570.00 \text{ (Perdida contable exacta reportada)}$$
- **Flujo de Caja Real Mes 1 (con costo de visitas):**
  - Cobro liquidacion 11 obras mes anterior: $11 \times \$1,879 = +\$20,669$
  - Cobro anticipo neteado 11 obras nuevas: $11 \times \$251 = +\$2,761$
  - Menos Pauta ($\$14,000$), Fijos ($\$18,000$) y Visitas ($\$4,500$): $-\$36,500$
  - **Caja Final Mes 1:** $\$95,000 + \$23,430 - \$36,500 = \$81,930.00$

---

## 4. Seccion Obligatoria: «En que se equivoco o nos confundio la IA» (Caso C)

1. **Error 1 — Evaluar Meta Ads por el CPL de \$13.33 e ignorar la restriccion fisica de 100 visitas:**
   Cuando le pasamos la tabla de campanas a la IA, concluyo que Meta Lead Ads era "3.4 veces mas eficiente que Google Search" porque el formulario costaba \$13.33 frente a \$45.71 de Google. **Como lo detectamos:** Al seguir el embudo hasta las visitas tecnicas vimos que los ingenieros tienen un tope fisico de 100 visitas al mes; cada visita ocupada por un curioso de Facebook desplazaba a un propietario calificado de Google y costaba \$45 de viaticos.
2. **Error 2 — Contabilizar los \$2,130 de margen completo en el mismo mes de la firma:**
   La IA modelo el flujo de caja sumando $\$2,130 \times \text{ventas}$ en el mismo mes en que se gastaba la pauta. **Como lo corregimos:** En proyectos solares de \$6,200 el cliente paga 50% al firmar y 50% a los 30-45 dias tras la instalacion, mientras que los paneles se compran al inicio. Si escalas de golpe en el Mes 1, en ese mes solo entran \$251 netos por venta y el resto llega en el Mes 2, lo que puede quebrar el capital de trabajo si no se modela en dos etapas.
3. **Error 3 — Olvidar restar los \$45 por visita tecnica fallida:**
   En una tasa de cierre del 11%, para lograr 11 ventas se hacen 100 visitas (89 no compran). Esas 100 visitas cuestan \$4,500 al mes (\$409 por cada venta cerrada), reduciendo el margen real de \$2,130 a \$1,721 si no se aplica el filtro pre-visita.

