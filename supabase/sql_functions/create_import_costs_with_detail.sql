CREATE OR REPLACE FUNCTION create_import_costs_with_details(import_costs_data JSON, import_costs_details_data JSONB[])
RETURNS void AS $$
DECLARE
    new_import_costs_id BIGINT;
-- Start a transaction
BEGIN

    -- Insert into import_costs
    INSERT INTO import_costs (
        order_id, active,
        maritime_transportation, maritime_transportation_detail,
        land_transportation, land_transportation_detail,
        foreign_insurance, foreign_insurance_detail,
        aspb_port_expenses, aspb_port_expenses_detail,
        intermediary_commissions, intermediary_commissions_detail,
        other_expenses_i, other_expenses_i_detail,
        consolidated_tax_duty, consolidated_tax_duty_detail,
        value_added_tax_iva, value_added_tax_iva_detail,
        specific_consumption_tax_ice, specific_consumption_tax_ice_detail,
        other_penalties, other_penalties_detail,
        albo_customs_storage, albo_customs_storage_detail,
        albo_customs_logistics, albo_customs_logistics_detail,
        dui_forms, dui_forms_detail,
        djv_forms, djv_forms_detail,
        other_expenses_ii, other_expenses_ii_detail,
        chamber_of_commerce, chamber_of_commerce_detail,
        senasag, senasag_detail,
        custom_agent_commissions, custom_agent_commissions_detail,
        financial_commissions, financial_commissions_detail,
        other_commissions, other_commissions_detail,
        national_transportation, national_transportation_detail,
        insurance, insurance_detail,
        handling_and_storage, handling_and_storage_detail,
        other_expenses_iii, other_expenses_iii_detail,
        optional_expense_1, optional_expense_1_detail,
        optional_expense_2, optional_expense_2_detail,
        optional_expense_3, optional_expense_3_detail,
        optional_expense_4, optional_expense_4_detail,
        optional_expense_5, optional_expense_5_detail,
        fob_value, total_warehouse_cost, cf_iva, net_total_warehouse_cost
    )
    VALUES (
        (import_costs_data->>'order_id')::BIGINT,
        (import_costs_data->>'maritime_transportation')::FLOAT,
        (import_costs_data->>'maritime_transportation_detail')::TEXT,
        (import_costs_data->>'land_transportation')::FLOAT,
        (import_costs_data->>'land_transportation_detail')::TEXT,
        (import_costs_data->>'foreign_insurance')::FLOAT,
        (import_costs_data->>'foreign_insurance_detail')::TEXT,
        (import_costs_data->>'aspb_port_expenses')::FLOAT,
        (import_costs_data->>'aspb_port_expenses_detail')::TEXT,
        (import_costs_data->>'intermediary_commissions')::FLOAT,
        (import_costs_data->>'intermediary_commissions_detail')::TEXT,
        (import_costs_data->>'other_expenses_i')::FLOAT,
        (import_costs_data->>'other_expenses_i_detail')::TEXT,
        (import_costs_data->>'consolidated_tax_duty')::FLOAT,
        (import_costs_data->>'consolidated_tax_duty_detail')::TEXT,
        (import_costs_data->>'value_added_tax_iva')::FLOAT,
        (import_costs_data->>'value_added_tax_iva_detail')::TEXT,
        (import_costs_data->>'specific_consumption_tax_ice')::FLOAT,
        (import_costs_data->>'specific_consumption_tax_ice_detail')::TEXT,
        (import_costs_data->>'other_penalties')::FLOAT,
        (import_costs_data->>'other_penalties_detail')::TEXT,
        (import_costs_data->>'albo_customs_storage')::FLOAT,
        (import_costs_data->>'albo_customs_storage_detail')::TEXT,
        (import_costs_data->>'albo_customs_logistics')::FLOAT,
        (import_costs_data->>'albo_customs_logistics_detail')::TEXT,
        (import_costs_data->>'dui_forms')::FLOAT,
        (import_costs_data->>'dui_forms_detail')::TEXT,
        (import_costs_data->>'djv_forms')::FLOAT,
        (import_costs_data->>'djv_forms_detail')::TEXT,
        (import_costs_data->>'other_expenses_ii')::FLOAT,
        (import_costs_data->>'other_expenses_ii_detail')::TEXT,
        (import_costs_data->>'chamber_of_commerce')::FLOAT,
        (import_costs_data->>'chamber_of_commerce_detail')::TEXT,
        (import_costs_data->>'senasag')::FLOAT,
        (import_costs_data->>'senasag_detail')::TEXT,
        (import_costs_data->>'custom_agent_commissions')::FLOAT,
        (import_costs_data->>'custom_agent_commissions_detail')::TEXT,
        (import_costs_data->>'financial_commissions')::FLOAT,
        (import_costs_data->>'financial_commissions_detail')::TEXT,
        (import_costs_data->>'other_commissions')::FLOAT,
        (import_costs_data->>'other_commissions_detail')::TEXT,
        (import_costs_data->>'national_transportation')::FLOAT,
        (import_costs_data->>'national_transportation_detail')::TEXT,
        (import_costs_data->>'insurance')::FLOAT,
        (import_costs_data->>'insurance_detail')::TEXT,
        (import_costs_data->>'handling_and_storage')::FLOAT,
        (import_costs_data->>'handling_and_storage_detail')::TEXT,
        (import_costs_data->>'other_expenses_iii')::FLOAT,
        (import_costs_data->>'other_expenses_iii_detail')::TEXT,
        (import_costs_data->>'optional_expense_1')::FLOAT,
        (import_costs_data->>'optional_expense_1_detail')::TEXT,
        (import_costs_data->>'optional_expense_2')::FLOAT,
        (import_costs_data->>'optional_expense_2_detail')::TEXT,
        (import_costs_data->>'optional_expense_3')::FLOAT,
        (import_costs_data->>'optional_expense_3_detail')::TEXT,
        (import_costs_data->>'optional_expense_4')::FLOAT,
        (import_costs_data->>'optional_expense_4_detail')::TEXT,
        (import_costs_data->>'optional_expense_5')::FLOAT,
        (import_costs_data->>'optional_expense_5_detail')::TEXT,
        (import_costs_data->>'fob_value')::FLOAT,
        (import_costs_data->>'total_warehouse_cost')::FLOAT,
        (import_costs_data->>'cf_iva')::FLOAT,
        (import_costs_data->>'net_total_warehouse_cost')::FLOAT
    ) RETURNING id INTO new_import_costs_id;

    -- Loop through the array of import_costs_details and insert
    FOR i IN 1 .. array_length(import_costs_details_data, 1)
    LOOP
        INSERT INTO import_costs_detail (
            import_costs_id, product_id, order_id, active, unit_cost
        )
        VALUES (
            new_import_costs_id,
            (import_costs_details_data[i]->>'product_id')::BIGINT,
            (import_costs_details_data[i]->>'unit_cost')::FLOAT
        );
    END LOOP;

    -- Commit the transaction
    COMMIT;
EXCEPTION
    WHEN OTHERS THEN
        -- In case of error, roll back the transaction
        ROLLBACK;
        RAISE;
END;
$$ LANGUAGE plpgsql;