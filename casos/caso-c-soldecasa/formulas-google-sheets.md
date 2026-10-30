# Especificación de Fórmulas para Google Sheets: Sol de Casa (Caso C)

Construya la calculadora en Google Sheets estructurada en dos pestañas: **`Supuestos`** (celdas de entrada editables identificadas) y **`Resultados`** (fórmulas dinámicas vinculadas).

---

## Pestaña 1: `Supuestos`

| Celda | Etiqueta del Supuesto | Valor Base | Unidad / Formato |
| :--- | :--- | :---: | :--- |
| **B2** | Precio Promedio Instalación Solar | 6500.00 | Moneda ($) |
| **B3** | Porcentaje de Pago al Firmar | 0.50 | Porcentaje (50%) |
| **B4** | Porcentaje Costo Equipos (Paneles, inversor) | 0.55 | Porcentaje (55%) |
| **B5** | Porcentaje Costo Instalación (Cuadrilla) | 0.17 | Porcentaje (17%) |
| **B6** | Comisión de Venta Asesora | 0.03 | Porcentaje (3%) |
| **B7** | Costo Directo por Visita Técnica Realizada | 60.00 | Moneda ($) |
| **B8** | Capacidad Máxima Mensual de Visitas Técnicas | 100 | Entero |
| **B9** | Costo Mensual Técnico Extra | 1800.00 | Moneda ($) |
| **B10**| Capacidad Adicional por Técnico Extra | 50 | Entero |
| **B11**| Inversión Actual en Meta Ads | 4000.00 | Moneda ($) |
| **B12**| Inversión Actual en Google Ads | 4000.00 | Moneda ($) |
| **B13**| Costo por Lead (CPL) Meta Actual | 8.00 | Moneda ($) |
| **B14**| Costo por Lead (CPL) Google Actual | 40.00 | Moneda ($) |
| **B15**| Tasa Contacto Meta | 0.55 | Porcentaje (55%) |
| **B16**| Tasa Agenda Meta | 0.30 | Porcentaje (30%) |
| **B17**| Tasa Visita Hecha Meta | 0.70 | Porcentaje (70%) |
| **B18**| Tasa Cierre Meta | 0.18 | Porcentaje (18%) |
| **B19**| Tasa Contacto Google | 0.85 | Porcentaje (85%) |
| **B20**| Tasa Agenda Google | 0.55 | Porcentaje (55%) |
| **B21**| Tasa Visita Hecha Google | 0.85 | Porcentaje (85%) |
| **B22**| Tasa Cierre Google | 0.30 | Porcentaje (30%) |
| **B23**| Costos Fijos Operativos Mensuales | 18000.00| Moneda ($) |
| **B24**| Saldo Inicial en Banco | 12000.00| Moneda ($) |
| **B25**| Piso de Seguridad de Caja Exigido | 5000.00 | Moneda ($) |
| **B26**| Ventas Mes 0 (Septiembre) | 22 | Entero |

---

## Pestaña 2: `Resultados`

### Sección A: Margen de Contribución Unitaria

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B3** | Ingreso Total por Venta | `=Supuestos!B2` *(da $6,500.00)* |
| **B4** | Costo Equipos (Paneles) | `=B3 * Supuestos!B4` *(da $3,575.00)* |
| **B5** | Costo Cuadrilla Instalación | `=B3 * Supuestos!B5` *(da $1,105.00)* |
| **B6** | Margen Bruto por Venta | `=B3 - B4 - B5` *(da $1,820.00)* |
| **B7** | Margen Bruto (%) | `=B6 / B3` *(da 28.00%)* |
| **B8** | Comisión Asesora | `=B3 * Supuestos!B6` *(da $195.00)* |
| **B9** | **Contribución Unitaria Neta (LTV)** | `=B6 - B8` *(da $1,625.00)* |
| **B10**| **Déficit Inicial de Caja Mes de Firma** | `=(B3 * Supuestos!B3) - B4 - B8` *(da -$520.00)* |

---

### Sección B: Embudos y Visitas por Canal

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B13**| Leads Meta | `=Supuestos!B11 / Supuestos!B13` *(da 500.0)* |
| **B14**| Leads Google | `=Supuestos!B12 / Supuestos!B14` *(da 100.0)* |
| **B15**| Visitas Solicitadas Meta | `=B13 * Supuestos!B15 * Supuestos!B16 * Supuestos!B17` *(da 57.75)* |
| **B16**| Visitas Solicitadas Google | `=B14 * Supuestos!B19 * Supuestos!B20 * Supuestos!B21` *(da 39.74)* |
| **B17**| Total Visitas Demandadas | `=B15 + B16` *(da 97.49)* |
| **B18**| Visitas Realizadas Google (Prioridad 1) | `=MIN(B16, Supuestos!B8)` *(da 39.74)* |
| **B19**| Visitas Realizadas Meta (Prioridad 2) | `=MIN(B15, MAX(0, Supuestos!B8 - B18))` *(da 57.75)* |
| **B20**| Total Visitas Realizadas | `=B18 + B19` *(da 97.49)* |
| **B21**| Porcentaje Uso de Capacidad | `=B20 / Supuestos!B8` *(da 97.49%)* |

---

### Sección C: Ventas, CAC y Valor de Visita

| Celda | Concepto | Fórmula Exacta para Google Sheets |
| :--- | :--- | :--- |
| **B24**| Ventas Google | `=B18 * Supuestos!B22` *(da 11.92)* |
| **B25**| Ventas Meta | `=B19 * Supuestos!B18` *(da 10.40)* |
| **B26**| Total Ventas del Mes | `=B24 + B25` *(da 22.32)* |
| **B27**| Costo Visitas Google | `=B18 * Supuestos!B7` *(da $2,384.25)* |
| **B28**| Costo Visitas Meta | `=B19 * Supuestos!B7` *(da $3,465.00)* |
| **B29**| **CAC Anuncios Google** | `=Supuestos!B12 / B24` *(da $335.53)* |
| **B30**| **CAC Real Google (Pauta + Visitas)** | `=(Supuestos!B12 + B27) / B24` *(da $535.53)* |
| **B31**| **CAC Anuncios Meta** | `=Supuestos!B11 / B25` *(da $384.80)* |
| **B32**| **CAC Real Meta (Pauta + Visitas)** | `=(Supuestos!B11 + B28) / B25` *(da $718.13)* |
| **B33**| **Ratio LTV:CAC Real Google** | `=B9 / B30` *(da 3.03x)* |
| **B34**| **Ratio LTV:CAC Real Meta** | `=B9 / B32` *(da 2.26x)* |
| **B35**| **Valor Neto de una Visita Google** | `=(Supuestos!B22 * B9) - Supuestos!B7` *(da $427.50)* |
| **B36**| **Valor Neto de una Visita Meta** | `=(Supuestos!B18 * B9) - Supuestos!B7` *(da $232.50)* |
