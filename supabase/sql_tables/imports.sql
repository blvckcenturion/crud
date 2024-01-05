CREATE TABLE IF NOT EXISTS import_costs (
    id SERIAL PRIMARY KEY,
    order_id BIGINT NOT NULL REFERENCES purchases(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Non-nullable fields
    maritime_transportation FLOAT NOT NULL,
    maritime_transportation_detail TEXT,
    land_transportation FLOAT NOT NULL,
    land_transportation_detail TEXT,
    foreign_insurance FLOAT NOT NULL,
    foreign_insurance_detail TEXT,
    aspb_port_expenses FLOAT NOT NULL,
    aspb_port_expenses_detail TEXT ,
    intermediary_commissions FLOAT NOT NULL,
    intermediary_commissions_detail TEXT,
    other_expenses_i FLOAT NOT NULL,
    other_expenses_i_detail TEXT,
    consolidated_tax_duty FLOAT NOT NULL,
    consolidated_tax_duty_detail TEXT,
    value_added_tax_iva FLOAT NOT NULL,
    value_added_tax_iva_detail TEXT,
    specific_consumption_tax_ice FLOAT NOT NULL,
    specific_consumption_tax_ice_detail TEXT,
    other_penalties FLOAT NOT NULL,
    other_penalties_detail TEXT,
    albo_customs_storage FLOAT NOT NULL,
    albo_customs_storage_detail TEXT,
    albo_customs_logistics FLOAT NOT NULL,
    albo_customs_logistics_detail TEXT,
    dui_forms FLOAT NOT NULL,
    dui_forms_detail TEXT,
    djv_forms FLOAT NOT NULL,
    djv_forms_detail TEXT,
    other_expenses_ii FLOAT NOT NULL,
    other_expenses_ii_detail TEXT,
    chamber_of_commerce FLOAT NOT NULL,
    chamber_of_commerce_detail TEXT,
    senasag FLOAT NOT NULL,
    senasag_detail TEXT,
    custom_agent_commissions FLOAT NOT NULL,
    custom_agent_commissions_detail TEXT,
    financial_commissions FLOAT NOT NULL,
    financial_commissions_detail TEXT,
    other_commissions FLOAT NOT NULL,
    other_commissions_detail TEXT,
    national_transportation FLOAT NOT NULL,
    national_transportation_detail TEXT,
    insurance FLOAT NOT NULL,
    insurance_detail TEXT,
    handling_and_storage FLOAT NOT NULL,
    handling_and_storage_detail TEXT,
    other_expenses_iii FLOAT NOT NULL,
    other_expenses_iii_detail TEXT,
    
    -- Nullable fields
    optional_expense_1 FLOAT,
    optional_expense_1_detail TEXT,
    optional_expense_2 FLOAT,
    optional_expense_2_detail TEXT,
    optional_expense_3 FLOAT,
    optional_expense_3_detail TEXT,
    optional_expense_4 FLOAT,
    optional_expense_4_detail TEXT,
    optional_expense_5 FLOAT,
    optional_expense_5_detail TEXT,
    
    -- Additional non-nullable rows without details
    fob_value FLOAT NOT NULL,
    cif_value FLOAT NOT NULL,
    total_warehouse_cost FLOAT NOT NULL,
    cf_iva FLOAT NOT NULL,
    net_total_warehouse_cost FLOAT NOT NULL
);

CREATE TABLE IF NOT EXISTS import_costs_detail (
    id SERIAL PRIMARY KEY,
    import_costs_id BIGINT NOT NULL REFERENCES import_costs(id),
    product_id BIGINT NOT NULL REFERENCES products(id),
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unit_cost FLOAT NOT NULL
);