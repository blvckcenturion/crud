CREATE OR REPLACE FUNCTION delete_purchase_with_items(purchase_id integer)
RETURNS void AS $$
BEGIN
    -- Update the purchase to inactive
    UPDATE purchases
    SET active = false
    WHERE id = purchase_id;

    -- Update associated purchase items to inactive
    UPDATE purchase_items
    SET active = false
    WHERE purchase_id = purchase_id;
END;
$$ LANGUAGE plpgsql;