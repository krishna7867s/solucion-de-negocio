# Arquitectura de Automatización con n8n y Base de Datos

Este directorio contiene los flujos de trabajo (*workflows*) listos para importar en **n8n** (Cloud o Self-Hosted) para orquestar la ingesta en tiempo real, calificación de leads y auditoría de unit economics hacia la base de datos PostgreSQL.

---

## 1. Conexión de la Base de Datos Relacional

El esquema relacional completo se encuentra en [`database/schema.sql`](file:///c:/Users/DELL9/Desktop/solucion%20de%20nego/database/schema.sql).

### Opciones de Conexión Recomendadas:
1. **Supabase (Recomendado - Free Tier):**
   - Cree un nuevo proyecto en [supabase.com](https://supabase.com).
   - Ingrese al *SQL Editor* y copie el contenido de `database/schema.sql`.
   - Copie las credenciales de conexión (Host, Port 5432, Database `postgres`, User `postgres`, Password) en n8n como credencial *Postgres*.
2. **Neon.tech / PostgreSQL Local:**
   - Si utiliza Docker local:
     ```bash
     docker run --name pg-soluciones -e POSTGRES_PASSWORD=secret -p 5432:5432 -d postgres:15
     psql -h localhost -U postgres -f database/schema.sql
     ```

---

## 2. Workflows de n8n Incluidos

| Archivo de Flujo | Caso | Función Operativa Clave |
| :--- | :---: | :--- |
| [`workflow-tueste-shopify-attribution.json`](file:///c:/Users/DELL9/Desktop/solucion%20de%20nego/automatizaciones-n8n/workflow-tueste-shopify-attribution.json) | **Caso A (Tueste)** | Discrimina compras de clientes nuevos vs compras de retargeting en Shopify para evitar la trampa de ROAS reportado falso de Meta. Registra ingresos netos de margen en BD. |
| [`workflow-agendo-trial-qualification.json`](file:///c:/Users/DELL9/Desktop/solucion%20de%20nego/automatizaciones-n8n/workflow-agendo-trial-qualification.json) | **Caso B (Agendo)** | Dispara mensaje de bienvenida por WhatsApp en menos de 5 minutos al registrarse un trial y monitorea el umbral de 500 trials/mes de Mariela, enviando alerta a Slack cuando se debe contratar la vendedora 2. |
| [`workflow-soldecasa-lead-qualification.json`](file:///c:/Users/DELL9/Desktop/solucion%20de%20nego/automatizaciones-n8n/workflow-soldecasa-lead-qualification.json) | **Caso C (Sol de Casa)** | Aplica el filtro del Supuesto 7 (*«¿Es dueño de la casa?»* y *«¿Su recibo de luz supera los $80?»*). Evita agendar visitas no calificadas que cuestan $60 c/u y alerta cuando la capacidad técnica mensual se acerca a 100. |

---

## 3. Instrucciones de Importación en n8n
1. Abra su instancia de n8n.
2. Vaya a **Workflows** $\rightarrow$ **Add Workflow**.
3. Haga clic en los tres puntos del menú superior derecho $\rightarrow$ **Import from File**.
4. Seleccione cualquiera de los archivos `.json` de esta carpeta.
5. Configure su credencial de PostgreSQL en el nodo correspondiente.
6. Haga clic en **Activate**.
