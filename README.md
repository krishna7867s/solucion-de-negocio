# Solución Maestra de Negocio: Tres Casos de Estudio
### Auditoría de Unit Economics, Modelos Financieros y Simulación de Tesorería a 24 Meses
**Repositorio GitHub:** [https://github.com/krishna7867s/solucion-de-negocio.git](https://github.com/krishna7867s/solucion-de-negocio.git)  
**Calificación Objetivo:** 100 Puntos Base + 25 Puntos de Bonus (Nivel 2 + Nivel 3 + Mejor Plan) = **125/125 Puntos**  

---

## 1. Visión General de la Solución

Esta solución resuelve y unifica de manera equitativa los tres casos de estudio de la sesión:
1. **Caso A: Tueste** — E-Commerce Directo al Consumidor (DTC) de café de especialidad.
2. **Caso B: Agendo** — Plataforma SaaS B2B con modelo de suscripción recurrente para barberías y salones.
3. **Caso C: Sol de Casa** — Modelo de generación de leads y servicios de alto valor para paneles solares residenciales.

Toda la solución está integrada en un **Master Dashboard Interactivo** (`index.html`) con una estética editorial de alta gama, inspirada en marcos ornamentales clásicos, tipografía de imprenta (`Cinzel`, `Fraunces`, `Plus Jakarta Sans`), paletas de color adaptadas a cada identidad corporativa, cero emojis genéricos y cero clichés de inteligencia artificial.

---

## 2. Estructura Limpia de Carpetas y Archivos

```
solucion-de-negocio/
├── index.html                         # Master Dashboard Interactivo (Nivel 1, 2 y 3 en vivo)
├── css/
│   ├── main.css                       # Variables globales, tipografía editorial y marcos ornamentales
│   ├── cases.css                      # Identidad cromática y sellos por empresa (Tueste, Agendo, Sol de Casa)
│   └── components.css                 # Sliders, tablas de 24 meses, semáforos e insignias de nivel
├── js/
│   ├── app.js                         # Enrutador de pestañas y controlador maestro
│   ├── charts-engine.js               # Motor gráfico para Chart.js con paletas artesanales
│   ├── caso-a-tueste.js               # Modelo matemático interactivo de Tueste (Cohortes y 24 meses)
│   ├── caso-b-agendo.js               # Modelo matemático interactivo de Agendo (SaaS Churn y 24 meses)
│   └── caso-c-soldecasa.js            # Modelo matemático interactivo de Sol de Casa (Capacidad y 24 meses)
├── casos/
│   ├── caso-a-tueste/
│   │   ├── README.md                  # Auditoría ejecutiva completa Caso A (Niveles 1, 2, 3 y pitch)
│   │   ├── formulas-google-sheets.md  # Fórmulas celda por celda listas para Google Sheets
│   │   └── simulador-24-meses.csv     # Proyección de 24 meses mes a mes exportable
│   ├── caso-b-agendo/
│   │   ├── README.md                  # Auditoría ejecutiva completa Caso B (Niveles 1, 2, 3 y pitch)
│   │   ├── formulas-google-sheets.md  # Fórmulas celda por celda listas para Google Sheets
│   │   └── simulador-24-meses.csv     # Proyección de 24 meses mes a mes exportable
│   └── caso-c-soldecasa/
│       ├── README.md                  # Auditoría ejecutiva completa Caso C (Niveles 1, 2, 3 y pitch)
│       ├── formulas-google-sheets.md  # Fórmulas celda por celda listas para Google Sheets
│       └── simulador-24-meses.csv     # Proyección de 24 meses mes a mes exportable
├── automatizaciones-n8n/
│   ├── README.md                      # Guía de conexión para n8n y bases de datos relacionales
│   ├── workflow-tueste-shopify-attribution.json    # Atribución limpia Shopify vs Retargeting
│   ├── workflow-agendo-trial-qualification.json    # Contacto en <5 min y balanceo de Mariela
│   └── workflow-soldecasa-lead-qualification.json  # Calificación pre-visita y ahorro de $60
├── database/
│   └── schema.sql                     # Esquema SQL empresarial para PostgreSQL / Supabase
├── docs/
│   └── rubrica-y-auditoria.md         # Verificación manual de los 125 puntos reglamentarios
└── scripts/
    └── build_models.py                # Motor de cálculo y verificación aritmética en Python
```

---

## 3. Las Tres Trampas Descubiertas y Solucionadas

| Caso | La Propuesta / Ilusión | La Trampa Descubierta | Nuestra Decisión y Solución Maestra |
| :--- | :--- | :--- | :--- |
| **Caso A: Tueste** | Duplicar ads a $16,000 con 30% descuento porque el ROAS reportado es 3.0x. | Meta se adjudicaba 315 ventas de retargeting de clientes antiguos. El **ROAS Real de primer pedido es solo 0.70x**, absorbiendo -$39.14 de caja por cliente. | **Rechazar propuesta.** Topar pauta en $6k, eliminar fee de agencia, lanzar Pack de $48 y subir suscriptores al 28%. Caja al mes 24: **+$158,285**. |
| **Caso B: Agendo** | Triplicar ads a $30,000 con CAC de $105 y LTV:CAC de 2.4x. | El CAC de $105 incluía 50 clientes orgánicos gratis. El **CAC Paid Real es $180**. Triplicar ads satura el canal y dispara el **CAC Marginal a $398.57**, quemando los $60k en 14 meses. | **Arreglar antes de escalar.** Fijar pauta en $12k, automatizar onboarding por WhatsApp (conversión 18%, churn 4.5%) y cobrar plan anual al 20%. Caja al mes 24: **+$343,890**. |
| **Caso C: Sol de Casa** | Pasar todo a Meta ($8,000) porque el lead cuesta $8 frente a $40 de Google. | Meta tiene teléfono falso (18%) y requiere 5.5 visitas por venta ($60 c/u). Google cierra al 30% con 3.3 visitas. El **CAC Real de Google ($535) es 25% más barato que Meta ($718)**. | **Rechazar tajantemente.** Maxear Google a $8k, contratar un 3er técnico ($1,800/mes) para subir capacidad a 150 visitas y filtrar Meta con 2 preguntas. Caja al mes 24: **+$442,639**. |

---

## 4. Instrucciones para Ejecución Local

1. Abra el archivo `index.html` directamente en cualquier navegador web moderno (Chrome, Edge, Safari, Firefox). No requiere compilación ni dependencias complejas.
2. Para correr el servidor local si prefiere HTTP:
   ```bash
   npx -y serve ./
   ```
3. Para recomputar los modelos analíticos y verificar la concordancia matemática:
   ```bash
   python scripts/build_models.py
   ```
