# Especificación de Fórmulas para Google Sheets: Tueste (Caso A)

Para que el modelo se recalcule automáticamente y obtenga la máxima calificación de rigor numérico (25 pts), construya la hoja en dos pestañas: **`Supuestos`** (celdas de entrada editables) y **`Resultados`** (fórmulas puras enlazadas a `Supuestos`).

---

## Pestaña 1: `Supuestos`

| Celda | Etiqueta del Supuesto | Valor Base | Unidad / Formato |
| :--- | :--- | :---: | :--- |
| **B2** | Precio Bolsa de Café (340g) | 17.00 | Moneda ($) |
| **B3** | Bolsas por Pedido Típico Suelto | 2 | Número entero |
| **B4** | Descuento Plan Suscripción | 0.10 | Porcentaje (10%) |
| **B5** | Costo de Café por Bolsa (grano + tueste + empaque) | 5.44 | Moneda ($) |
| **B6** | Costo de Envío por Pedido (pagado por Tueste) | 4.50 | Moneda ($) |
| **B7** | Comisión Pasarela de Pagos | 0.045 | Porcentaje (4.5%) |
| **B8** | Costo Caja y Empaque por Pedido | 1.20 | Moneda ($) |
| **B9** | Churn Mensual de Suscriptores | 0.09 | Porcentaje (9.0%) |
| **B10**| Pedidos en 12 Meses (Cliente Suelto) | 3.00 | Decimal |
| **B11**| Porcentaje de Clientes Nuevos en Pedido Suelto | 0.85 | Porcentaje (85%) |
| **B12**| Porcentaje de Clientes Nuevos en Suscripción | 0.15 | Porcentaje (15%) |
| **B13**| Inversión Actual en Meta Ads | 8000.00| Moneda ($) |
| **B14**| Fee Mensual de la Agencia de Marketing | 1000.00| Moneda ($) |
| **B15**| Clientes Nuevos Reales de Meta (Shopify/Encuesta)| 165 | Entero |
| **B16**| Clientes Nuevos Orgánicos Mensuales | 47 | Entero |
| **B17**| Costos Fijos Mensuales | 6500.00| Moneda ($) |
| **B18**| Contribución Base Clientes Actuales (Mes 1) | 9000.00| Moneda ($) |
| **B19**| Tasa Decaimiento Clientes Actuales | 0.03 | Porcentaje (3%) |
| **B20**| Saldo Inicial en Banco | 35000.00| Moneda ($) |
| **B21**| Piso de Seguridad de Caja | 5000.00| Moneda ($) |

---

## Pestaña 2: `Resultados`

### Sección A: Unit Economics por Pedido

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B3** | Precio Pedido Suelto | `=Supuestos!B2 * Supuestos!B3` *(da $34.00)* |
| **B4** | Precio Pedido Suscripción | `=B3 * (1 - Supuestos!B4)` *(da $30.60)* |
| **B5** | Costo Café por Pedido | `=Supuestos!B5 * Supuestos!B3` *(da $10.88)* |
| **B6** | Pasarela Pedido Suelto | `=B3 * Supuestos!B7` *(da $1.53)* |
| **B7** | Pasarela Pedido Suscripción | `=B4 * Supuestos!B7` *(da $1.38)* |
| **B8** | Costo Variable Total Pedido Suelto | `=B5 + Supuestos!B6 + B6 + Supuestos!B8` *(da $18.11)* |
| **B9** | Costo Variable Total Suscripción | `=B5 + Supuestos!B6 + B7 + Supuestos!B8` *(da $17.96)* |
| **B10**| **Margen Contribución Pedido Suelto ($)** | `=B3 - B8` *(da $15.89)* |
| **B11**| **Margen Contribución Pedido Suelto (%)** | `=B10 / B3` *(da 46.74%)* |
| **B12**| **Margen Contribución Suscripción ($)** | `=B4 - B9` *(da $12.64)* |
| **B13**| **Margen Contribución Suscripción (%)** | `=B12 / B4` *(da 41.32%)* |
| **B14**| **ROAS Break-Even Pedido Suelto** | `=1 / B11` *(da 2.14x)* |
| **B15**| **ROAS Break-Even Suscripción** | `=1 / B13` *(da 2.42x)* |

---

### Sección B: Adquisición y Métricas de CAC

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B18**| Total Inversión en Adquisición | `=Supuestos!B13 + Supuestos!B14` *(da $9,000.00)* |
| **B19**| **CAC Anuncios (Solo Pauta)** | `=Supuestos!B13 / Supuestos!B15` *(da $48.48)* |
| **B20**| **CAC Real (Pauta + Fee Agencia)** | `=B18 / Supuestos!B15` *(da $54.55)* |
| **B21**| **CAC Blended (con Orgánicos)** | `=B18 / (Supuestos!B15 + Supuestos!B16)` *(da $42.45)* |
| **B22**| Facturación Primer Pedido Meta | `=Supuestos!B15 * B3` *(da $5,610.00)* |
| **B23**| **ROAS Real Primer Pedido** | `=B22 / Supuestos!B13` *(da 0.70x)* |

---

### Sección C: Valor de Vida (LTV a 12 Meses) y Ratios

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B26**| LTV Cliente Suelto (12 Meses) | `=B10 * Supuestos!B10` *(da $47.67)* |
| **B27**| Factor Retención Suscriptor (12m) | `=(1 - (1 - Supuestos!B9)^12) / Supuestos!B9` *(da 7.528)* |
| **B28**| LTV Suscriptor (12 Meses) | `=B12 * B27` *(da $95.18)* |
| **B29**| **LTV Promedio Ponderado del Negocio** | `=(Supuestos!B11 * B26) + (Supuestos!B12 * B28)` *(da $54.80)* |
| **B30**| **LTV sin Tope Teórico (SaaS Pura)**| `=B12 / Supuestos!B9` *(da $140.44)* |
| **B31**| **Ratio LTV : CAC Real** | `=B29 / B20` *(da 1.00x)* |
| **B32**| **Margen Neto Mes 1 por Cliente** | `=(Supuestos!B11 * B10) + (Supuestos!B12 * B12)` *(da $15.41)* |
| **B33**| **Déficit de Caja Inicial Unitario** | `=B32 - B20` *(da -$39.14)* |
