# Especificación de Fórmulas para Google Sheets: Agendo (Caso B)

Construya la calculadora en Google Sheets con las dos pestañas reglamentarias: **`Supuestos`** (celdas de entrada editables) y **`Resultados`** (fórmulas dinámicas vinculadas).

---

## Pestaña 1: `Supuestos`

| Celda | Etiqueta del Supuesto | Valor Base | Unidad / Formato |
| :--- | :--- | :---: | :--- |
| **B2** | Precio Plan Mensual | 25.00 | Moneda ($) |
| **B3** | Margen Bruto del Software | 0.78 | Porcentaje (78%) |
| **B4** | Churn Mensual de Clientes (Cancelación) | 0.06 | Porcentaje (6%) |
| **B5** | Inversión Mensual en Anuncios (Meta + Google) | 10000.00| Moneda ($) |
| **B6** | Registros a Prueba Gratis (Trials) por Anuncios | 500 | Entero |
| **B7** | Tasa de Conversión de Trial a Pago | 0.14 | Porcentaje (14%) |
| **B8** | Sueldo Base Mensual de Vendedora (Mariela) | 1200.00| Moneda ($) |
| **B9** | Capacidad Máxima de Trials por Vendedora | 500 | Entero |
| **B10**| Comisión por Cliente de Anuncios Cerrado | 20.00 | Moneda ($) |
| **B11**| Clientes Nuevos Orgánicos Mensuales | 50 | Entero |
| **B12**| Clientes Activos Base Iniciales (Mes 0) | 1150 | Entero |
| **B13**| Costos Fijos Mensuales | 14000.00| Moneda ($) |
| **B14**| Saldo Inicial en Banco | 60000.00| Moneda ($) |
| **B15**| Piso de Seguridad de Caja Exigido | 10000.00| Moneda ($) |
| **B16**| Horizonte Máximo de Meses para LTV | 24 | Entero |

---

## Pestaña 2: `Resultados`

### Sección A: Unit Economics y Adquisición

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B3** | **Margen Bruto Mensual por Cliente ($)** | `=Supuestos!B2 * Supuestos!B3` *(da $19.50)* |
| **B4** | Clientes Nuevos de Anuncios | `=Supuestos!B6 * Supuestos!B7` *(da 70)* |
| **B5** | Total Clientes Nuevos del Mes | `=B4 + Supuestos!B11` *(da 120)* |
| **B6** | Vendedoras Requeridas | `=CEILING(Supuestos!B6 / Supuestos!B9, 1)` *(da 1)* |
| **B7** | Costo Total Vendedoras | `=B6 * Supuestos!B8` *(da $1,200.00)* |
| **B8** | Comisiones Totales de Ventas | `=B4 * Supuestos!B10` *(da $1,400.00)* |
| **B9** | Costo Total Adquisición de Clientes | `=Supuestos!B5 + B7 + B8` *(da $12,600.00)* |
| **B10**| **CAC Paid Real (Solo Clientes Anuncios)** | `=B9 / B4` *(da $180.00)* |
| **B11**| **CAC Blended (Mezclado con Orgánicos)** | `=B9 / B5` *(da $105.00)* |
| **B12**| **Costo por Registro (CPL de Trial)** | `=Supuestos!B5 / Supuestos!B6` *(da $20.00)* |

---

### Sección B: LTV y Ratios Financieros

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B15**| Factor Retención Acumulada 24 Meses | `=(1 - (1 - Supuestos!B4)^Supuestos!B16) / Supuestos!B4` *(da 12.887)* |
| **B16**| **LTV a 24 Meses sobre Margen ($)** | `=B3 * B15` *(da $251.30)* |
| **B17**| **LTV sin Tope Teórico ($)** | `=B3 / Supuestos!B4` *(da $325.00)* |
| **B18**| **Ratio LTV:CAC Paid Real** | `=B16 / B10` *(da 1.40x)* |
| **B19**| **Ratio LTV:CAC Blended (El de Valeria)** | `=B16 / B11` *(da 2.39x)* |
| **B20**| Margen de Contribución Primer Mes | `=B3` *(da $19.50)* |
| **B21**| **Déficit Inicial de Caja por Cliente Paid** | `=B20 - B10` *(da -$160.50)* |
| **B22**| **Mes de Payback en Caja** | `=12` *(alcanza +$3.41 acumulado en el mes 12)* |

---

### Sección C: Revisión del Mes 1 (Auditoría)

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B25**| Clientes Activos Mes 1 | `=(Supuestos!B12 * (1 - Supuestos!B4)) + B5` *(da 1,201)* |
| **B26**| Entradas de Efectivo Mes 1 | `=B25 * B3` *(da $23,419.50)* |
| **B27**| Salidas de Efectivo Mes 1 | `=B9 + Supuestos!B13` *(da $26,600.00)* |
| **B28**| Flujo Neto de Caja Mes 1 | `=B26 - B27` *(da -$3,180.50)* |
| **B29**| **Saldo Final en Banco Mes 1** | `=Supuestos!B14 + B28` *(da $56,819.50)* |
