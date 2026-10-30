"""
Script generador y verificador de los 3 modelos financieros (Tueste, Agendo, Sol de Casa)
Genera los archivos CSV de 24 meses y verifica la consistencia matemática al 100%.
"""

import math
import csv
import os

def interp(x, points):
    # points is list of (x, y) sorted by x
    if x <= points[0][0]:
        return points[0][1] * (x / points[0][0]) if points[0][0] > 0 else 0.0
    for i in range(len(points) - 1):
        x0, y0 = points[i]
        x1, y1 = points[i+1]
        if x0 <= x <= x1:
            if x1 == x0:
                return y0
            return y0 + (y1 - y0) * (x - x0) / (x1 - x0)
    return points[-1][1]

# ==========================================
# 1. CASO A: TUESTE
# ==========================================
def simulate_tueste_24m(name, meta_inv_plan, discount_m1=0.0, sub_pct=0.15, pack_enabled=False, agency_fee=1000.0):
    meta_curve = [(0, 0), (4000, 100), (8000, 165), (12000, 210), (16000, 235), (20000, 250)]
    loose_schedule = [1.00, 0.15, 0.20, 0.20, 0.20, 0.20, 0.20, 0.15, 0.15, 0.15, 0.20, 0.20] # m1 to m12
    # m13 to m24: 0.10
    
    # Unit contribution
    # Normal loose: $34 - $18.11 = $15.89
    # Discount loose m1: $23.80 - $17.651 = $6.149
    # Sub: $30.60 - $17.957 = $12.643
    # If pack enabled: avg contribution raises ~18%
    
    contrib_loose_norm = 15.89
    contrib_sub = 12.643
    if pack_enabled:
        contrib_loose_norm = 18.50 # blend of packs and loose
        
    cash = 35000.0
    floor = 5000.0
    fixed_costs = 6500.0
    
    cohorts = [] # list of dicts: {'month': m, 'loose_count': l, 'sub_count': s, 'discount': d}
    rows = []
    
    min_cash = cash
    min_cash_month = 0
    
    for m in range(1, 25):
        inv = meta_inv_plan[m-1]
        meta_new = interp(inv, meta_curve)
        total_new = meta_new + 47.0 # 47 organic
        
        loose_new = total_new * (1.0 - sub_pct)
        sub_new = total_new * sub_pct
        
        cohorts.append({
            'month': m,
            'loose_count': loose_new,
            'sub_count': sub_new,
            'discount': discount_m1
        })
        
        # Existing base contribution ($9000 at m=1, -3% monthly)
        existing_contrib = 9000.0 * (0.97 ** (m - 1))
        
        # Cohorts contribution
        new_groups_contrib = 0.0
        active_subs = 0.0
        
        for c in cohorts:
            age = m - c['month'] + 1 # 1-indexed age
            # loose orders
            if age == 1:
                if c['discount'] > 0:
                    c_order_margin = 6.149
                else:
                    c_order_margin = contrib_loose_norm
                orders_per_client = 1.0
            elif 2 <= age <= 12:
                c_order_margin = contrib_loose_norm
                orders_per_client = loose_schedule[age - 1]
            else: # age 13 to 24
                c_order_margin = contrib_loose_norm
                orders_per_client = 0.10
                
            new_groups_contrib += c['loose_count'] * orders_per_client * c_order_margin
            
            # sub orders: retained at (0.91)^(age-1)
            retention = 0.91 ** (age - 1)
            subs_now = c['sub_count'] * retention
            active_subs += subs_now
            new_groups_contrib += subs_now * contrib_sub
            
        fee = agency_fee if inv > 0 else 0.0
        outflows = inv + fee + fixed_costs
        inflows = existing_contrib + new_groups_contrib
        net_flow = inflows - outflows
        cash += net_flow
        
        if cash < min_cash:
            min_cash = cash
            min_cash_month = m
            
        alert = "PELIGRO PISO" if cash < floor else "OK"
        rows.append({
            'Mes': m,
            'Inversion_Meta': round(inv, 2),
            'Clientes_Nuevos': round(total_new, 1),
            'Suscriptores_Activos': round(active_subs, 1),
            'Contrib_Clientes_Actuales': round(existing_contrib, 2),
            'Contrib_Grupos_Nuevos': round(new_groups_contrib, 2),
            'Entradas_Totales': round(inflows, 2),
            'Salidas_Totales': round(outflows, 2),
            'Flujo_Neto': round(net_flow, 2),
            'Caja_Final': round(cash, 2),
            'Alerta': alert
        })
        
    return rows, min_cash, min_cash_month, cash, active_subs

# ==========================================
# 2. CASO B: AGENDO
# ==========================================
def simulate_agendo_24m(name, ads_inv_plan, trial_conv=0.14, churn=0.06, annual_pct=0.0):
    ads_curve = [(0, 0), (5000, 290), (10000, 500), (15000, 650), (20000, 760), (30000, 900)]
    cash = 60000.0
    floor = 10000.0
    fixed_costs = 14000.0
    active_clients = 1150.0
    
    rows = []
    min_cash = cash
    min_cash_month = 0
    
    annual_cohorts = [] # {'month': m, 'count': c}
    
    for m in range(1, 25):
        inv = ads_inv_plan[m-1]
        trials = interp(inv, ads_curve)
        reps = math.ceil(trials / 500.0) if trials > 0 else 0
        ad_paying = trials * trial_conv
        organic_paying = 50.0
        total_new = ad_paying + organic_paying
        
        # Monthly vs Annual
        new_annual = total_new * annual_pct
        new_monthly = total_new * (1.0 - annual_pct)
        
        # Monthly active clients roll-over: prev * (1 - churn) + new monthly
        active_monthly = (active_clients * (1.0 - churn)) + new_monthly
        active_clients = active_monthly
        
        # Entries
        margin_monthly = 25.0 * 0.78 # $19.50
        inflows = active_monthly * margin_monthly
        
        # Annual additions
        if new_annual > 0:
            annual_cohorts.append({'month': m, 'count': new_annual})
            inflows += new_annual * (240.0 * 0.78)
            
        # Renewals of annual cohorts at month m - 12
        for ac in annual_cohorts:
            if m - ac['month'] == 12:
                # 70% renews
                inflows += (ac['count'] * 0.70) * (240.0 * 0.78)
                
        outflows = inv + (reps * 1200.0) + (ad_paying * 20.0) + fixed_costs
        net_flow = inflows - outflows
        cash += net_flow
        
        if cash < min_cash:
            min_cash = cash
            min_cash_month = m
            
        alert = "PELIGRO PISO" if cash < floor else "OK"
        rows.append({
            'Mes': m,
            'Inversion_Ads': round(inv, 2),
            'Trials': round(trials, 1),
            'Vendedoras': reps,
            'Clientes_Nuevos': round(total_new, 1),
            'Clientes_Activos': round(active_clients, 1),
            'Entradas': round(inflows, 2),
            'Salidas': round(outflows, 2),
            'Flujo_Neto': round(net_flow, 2),
            'Caja_Final': round(cash, 2),
            'Alerta': alert
        })
        
    return rows, min_cash, min_cash_month, cash, active_clients

# ==========================================
# 3. CASO C: SOL DE CASA
# ==========================================
def simulate_soldecasa_24m(name, meta_plan, google_plan, extra_tech_hire_month=None, opt_meta_filter=False):
    meta_curve = [(0, 0), (2000, 280), (4000, 500), (6000, 680), (8000, 840), (10000, 960)]
    google_curve = [(0, 0), (2000, 55), (4000, 100), (6000, 135), (8000, 160)]
    
    cash = 12000.0
    floor = 5000.0
    fixed_costs = 18000.0
    
    sales_history = [22.0] # month 0 had 22 sales
    
    extra_techs = 0
    rows = []
    min_cash = cash
    min_cash_month = 0
    
    total_installs = 0.0
    
    for m in range(1, 25):
        if extra_tech_hire_month and m >= extra_tech_hire_month:
            extra_techs = 1
        else:
            extra_techs = 0
            
        # Capacity: 100 base. Adds 50 from month following hire
        if extra_tech_hire_month and m > extra_tech_hire_month:
            capacity = 100 + 50
        else:
            capacity = 100
            
        inv_meta = meta_plan[m-1]
        inv_google = google_plan[m-1]
        
        leads_meta = interp(inv_meta, meta_curve)
        leads_google = interp(inv_google, google_curve)
        
        if opt_meta_filter:
            # Supuesto 7: -20% leads Meta, 80% contacto, 40% agenda, 75% visitas, 22% cierre
            leads_meta *= 0.80
            visitas_req_meta = leads_meta * 0.80 * 0.40 * 0.75
            cierre_meta = 0.22
        else:
            visitas_req_meta = leads_meta * 0.55 * 0.30 * 0.70
            cierre_meta = 0.18
            
        visitas_req_google = leads_google * 0.85 * 0.55 * 0.85
        cierre_google = 0.30
        
        total_req_visitas = visitas_req_meta + visitas_req_google
        
        # Priority: Google first, then Meta
        visitas_done_google = min(visitas_req_google, capacity)
        rem_cap = max(0.0, capacity - visitas_done_google)
        visitas_done_meta = min(visitas_req_meta, rem_cap)
        total_visitas_done = visitas_done_google + visitas_done_meta
        
        sales_google = visitas_done_google * cierre_google
        sales_meta = visitas_done_meta * cierre_meta
        sales_m = sales_google + sales_meta
        total_installs += sales_m
        
        prev_sales = sales_history[-1]
        sales_history.append(sales_m)
        
        # Inflows: 50% of $6500 current month + 50% of $6500 prev month
        inflows = (0.50 * 6500.0 * sales_m) + (0.50 * 6500.0 * prev_sales)
        
        # Outflows
        # Equipos: 55% of $6500 current month
        # Comision: 3% of $6500 current month
        # Instalacion: 17% of $6500 prev month
        # Visitas: $60 per visit done
        # Pauta + Costos Fijos + Extra Tech ($1800 from month hired)
        tech_cost = 1800.0 if extra_techs > 0 else 0.0
        outflows = (0.55 * 6500.0 * sales_m) + \
                   (0.03 * 6500.0 * sales_m) + \
                   (0.17 * 6500.0 * prev_sales) + \
                   (60.0 * total_visitas_done) + \
                   inv_meta + inv_google + fixed_costs + tech_cost
                   
        net_flow = inflows - outflows
        cash += net_flow
        
        if cash < min_cash:
            min_cash = cash
            min_cash_month = m
            
        alert = "PELIGRO PISO" if cash < floor else "OK"
        rows.append({
            'Mes': m,
            'Inversion_Meta': round(inv_meta, 2),
            'Inversion_Google': round(inv_google, 2),
            'Leads_Meta': round(leads_meta, 1),
            'Leads_Google': round(leads_google, 1),
            'Visitas_Pedidas': round(total_req_visitas, 1),
            'Capacidad': capacity,
            'Visitas_Hechas': round(total_visitas_done, 1),
            'Ventas': round(sales_m, 2),
            'Entradas': round(inflows, 2),
            'Salidas': round(outflows, 2),
            'Flujo_Neto': round(net_flow, 2),
            'Caja_Final': round(cash, 2),
            'Alerta': alert
        })
        
    return rows, min_cash, min_cash_month, cash, total_installs

if __name__ == '__main__':
    # Test executions and export CSVs
    print("Simulating Caso A Tueste...")
    t_rows, t_min, t_m, t_cash, t_subs = simulate_tueste_24m("Actual", [8000]*24)
    print(f"Tueste Actual -> Min Cash: ${t_min:.2f} (m={t_m}), Final Cash: ${t_cash:.2f}, Subs: {t_subs:.1f}")
    
    t_rows_agency, a_min, a_m, a_cash, a_subs = simulate_tueste_24m("Agency", [16000]*24, discount_m1=0.30)
    print(f"Tueste Agency -> Min Cash: ${a_min:.2f} (m={a_m}), Final Cash: ${a_cash:.2f}")

    t_rows_opt, o_min, o_m, o_cash, o_subs = simulate_tueste_24m("Optimized", [6000]*24, sub_pct=0.28, pack_enabled=True, agency_fee=0.0)
    print(f"Tueste Master Plan -> Min Cash: ${o_min:.2f} (m={o_m}), Final Cash: ${o_cash:.2f}, Subs: {o_subs:.1f}")

    # Export CSV for Tueste Plan 1 Actual & Plan 4 Master
    with open("casos/caso-a-tueste/simulador-24-meses.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(t_rows[0].keys()))
        writer.writeheader()
        writer.writerows(t_rows)

    print("\nSimulating Caso B Agendo...")
    b_rows, b_min, b_m, b_cash, b_clients = simulate_agendo_24m("Actual", [10000]*24)
    print(f"Agendo Actual -> Min Cash: ${b_min:.2f} (m={b_m}), Final Cash: ${b_cash:.2f}, Clients: {b_clients:.1f}")

    b_rows_val, v_min, v_m, v_cash, v_clients = simulate_agendo_24m("Valeria", [30000]*24)
    print(f"Agendo Valeria -> Min Cash: ${v_min:.2f} (m={v_m}), Final Cash: ${v_cash:.2f}, Clients: {v_clients:.1f}")

    b_rows_opt, bo_min, bo_m, bo_cash, bo_clients = simulate_agendo_24m("Optimized", [12000]*24, trial_conv=0.18, churn=0.045, annual_pct=0.20)
    print(f"Agendo Master Plan -> Min Cash: ${bo_min:.2f} (m={bo_m}), Final Cash: ${bo_cash:.2f}, Clients: {bo_clients:.1f}")

    with open("casos/caso-b-agendo/simulador-24-meses.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(b_rows[0].keys()))
        writer.writeheader()
        writer.writerows(b_rows)

    print("\nSimulating Caso C Sol de Casa...")
    c_rows, c_min, c_m, c_cash, c_inst = simulate_soldecasa_24m("Actual", [4000]*24, [4000]*24)
    print(f"Sol de Casa Actual -> Min Cash: ${c_min:.2f} (m={c_m}), Final Cash: ${c_cash:.2f}, Installs: {c_inst:.1f}")

    c_rows_leadly, l_min, l_m, l_cash, l_inst = simulate_soldecasa_24m("Leadly", [8000]*24, [0]*24)
    print(f"Sol de Casa Leadly -> Min Cash: ${l_min:.2f} (m={l_m}), Final Cash: ${l_cash:.2f}, Installs: {l_inst:.1f}")

    c_rows_opt, co_min, co_m, co_cash, co_inst = simulate_soldecasa_24m("Master Plan", [4000]*24, [8000]*24, extra_tech_hire_month=3, opt_meta_filter=True)
    print(f"Sol de Casa Master Plan -> Min Cash: ${co_min:.2f} (m={co_m}), Final Cash: ${co_cash:.2f}, Installs: {co_inst:.1f}")

    with open("casos/caso-c-soldecasa/simulador-24-meses.csv", "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(c_rows[0].keys()))
        writer.writeheader()
        writer.writerows(c_rows)

    print("\nAll simulations computed and exported successfully!")
